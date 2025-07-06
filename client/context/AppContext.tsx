import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWallet } from "@/context/WalletContext";
import { useTelegram } from "@/context/TelegramContext";
import {
  supabase,
  getCurrentUser,
  createUser,
  updateUserStats,
  recordGameSession,
  User,
  UserSettings,
} from "@/lib/supabase";
import { Language, getTranslation } from "@/lib/i18n";
import { soundEngine, SoundType, enableSounds } from "@/lib/sounds";
import { toast } from "sonner";

interface AppContextType {
  // User data
  user: User | null;
  loading: boolean;

  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;

  // Language
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => Promise<void>;

  // Game actions
  playGame: (
    gameName: string,
    stakeAmount: number,
    currency: string,
  ) => Promise<string | null>;
  recordGameResult: (
    gameSessionId: string,
    result: "win" | "loss",
    winAmount?: number,
    transactionHash?: string,
  ) => Promise<void>;

  // Referral
  referralCode: string;
  referralStats: {
    referredCount: number;
    totalEarnings: number;
  };
  processReferral: (referrerCode: string) => Promise<void>;

  // Sound & Haptic
  playSound: (type: SoundType) => void;
  haptic: (type: "light" | "medium" | "heavy") => void;

  // Leaderboard
  leaderboard: Array<{
    username: string;
    wins: number;
    totalStaked: number;
  }>;
  refreshLeaderboard: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: UserSettings = {
  sound_enabled: true,
  haptic_enabled: true,
  notifications_enabled: true,
  theme: "dark",
  language: "en",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useWallet();
  const { user: telegramUser, isInTelegram } = useTelegram();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [language, setLanguageState] = useState<Language>("en");
  const [referralStats, setReferralStats] = useState({
    referredCount: 0,
    totalEarnings: 0,
  });
  const [leaderboard, setLeaderboard] = useState<
    Array<{ username: string; wins: number; totalStaked: number }>
  >([]);

  // Initialize user and load data
  useEffect(() => {
    initializeUser();
  }, [address, telegramUser]);

  // Load referral from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      localStorage.setItem("vaultrun_referrer", ref);
    }
  }, []);

  const initializeUser = async () => {
    try {
      setLoading(true);

      let userData: User | null = null;

      // Try to get existing user
      if (address) {
        const { data } = await getCurrentUser(address);
        userData = data;
      } else if (telegramUser?.id) {
        const { data } = await getCurrentUser(undefined, telegramUser.id);
        userData = data;
      }

      // Create new user if doesn't exist
      if (!userData && (address || telegramUser)) {
        const referrer = localStorage.getItem("vaultrun_referrer");

        const newUserData = {
          wallet_address: address,
          telegram_id: telegramUser?.id,
          telegram_username: telegramUser?.username,
          referred_by: referrer,
        };

        const { data: newUser } = await createUser(newUserData);
        userData = newUser;

        // Process referral if exists
        if (referrer && newUser) {
          await processReferral(referrer);
        }

        // Clear referrer from storage
        localStorage.removeItem("vaultrun_referrer");
      }

      if (userData) {
        setUser(userData);
        setSettings(userData.settings || defaultSettings);
        setLanguageState((userData.settings?.language as Language) || "en");

        // Load referral stats
        await loadReferralStats(userData.id);
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralStats = async (userId: string) => {
    try {
      const { data: referrals } = await supabase
        .from("users")
        .select("id, total_staked")
        .eq("referred_by", userId);

      const { data: user } = await supabase
        .from("users")
        .select("referral_earnings")
        .eq("id", userId)
        .single();

      setReferralStats({
        referredCount: referrals?.length || 0,
        totalEarnings: user?.referral_earnings || 0,
      });
    } catch (error) {
      console.error("Error loading referral stats:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    if (newSettings.language) {
      setLanguageState(newSettings.language as Language);
    }

    // Update sound engine when sound settings change
    if (newSettings.sound_enabled !== undefined) {
      enableSounds(newSettings.sound_enabled);
    }

    // Update theme when theme settings change
    if (newSettings.theme !== undefined) {
      const htmlElement = document.documentElement;
      if (newSettings.theme === "light") {
        htmlElement.classList.add("light");
      } else {
        htmlElement.classList.remove("light");
      }
    }

    try {
      await supabase
        .from("users")
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setUser({ ...user, settings: updatedSettings });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    await updateSettings({ language: lang });
  };

  const t = (key: string) => getTranslation(key, language);

  const playGame = async (
    gameName: string,
    stakeAmount: number,
    currency: string,
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // Record game session
      const { data: session } = await recordGameSession({
        user_id: user.id,
        game_name: gameName,
        stake_amount: stakeAmount,
        currency,
        result: "loss", // Will be updated later
      });

      return session?.id || null;
    } catch (error) {
      console.error("Error recording game session:", error);
      return null;
    }
  };

  const recordGameResult = async (
    gameSessionId: string,
    result: "win" | "loss",
    winAmount = 0,
    transactionHash?: string,
  ) => {
    if (!user) return;

    try {
      // Update game session
      await supabase
        .from("game_sessions")
        .update({
          result,
          win_amount: winAmount,
          transaction_hash: transactionHash,
        })
        .eq("id", gameSessionId);

      // Update user stats
      await updateUserStats(user.id, {
        gameResult: result,
        stakeAmount: user.total_staked, // This should be the current game stake
        winAmount,
      });

      // Process referral commission if user has referrer
      if (user.referred_by && result === "win") {
        const commission = winAmount * 0.05; // 5% commission
        await supabase
          .from("users")
          .update({
            referral_earnings: supabase.sql`referral_earnings + ${commission}`,
          })
          .eq("wallet_address", user.referred_by)
          .or(
            `telegram_username.eq.${user.referred_by},telegram_id.eq.${user.referred_by}`,
          );
      }

      // Refresh user data
      await initializeUser();
    } catch (error) {
      console.error("Error recording game result:", error);
    }
  };

  const processReferral = async (referrerCode: string) => {
    if (!user) return;

    try {
      // Find referrer by wallet address, telegram username, or telegram ID
      const { data: referrer } = await supabase
        .from("users")
        .select("id")
        .or(
          `wallet_address.eq.${referrerCode},telegram_username.eq.${referrerCode.replace("@", "")},telegram_id.eq.${referrerCode}`,
        )
        .single();

      if (referrer) {
        await supabase
          .from("users")
          .update({ referred_by: referrer.id })
          .eq("id", user.id);

        toast.success("🎉 Referral processed successfully!");
      }
    } catch (error) {
      console.error("Error processing referral:", error);
    }
  };

  const playSound = (type: SoundType) => {
    if (!settings.sound_enabled) return;
    soundEngine.playSound(type);
  };

  const haptic = (type: "light" | "medium" | "heavy") => {
    if (!settings.haptic_enabled || !isInTelegram) return;

    try {
      if ((window as any).Telegram?.WebApp?.HapticFeedback) {
        const telegram = (window as any).Telegram.WebApp;
        switch (type) {
          case "light":
            telegram.HapticFeedback.selectionChanged();
            break;
          case "medium":
            telegram.HapticFeedback.notificationOccurred("warning");
            break;
          case "heavy":
            telegram.HapticFeedback.notificationOccurred("error");
            break;
        }
      }
    } catch (error) {
      console.error("Error with haptic feedback:", error);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const { data } = await supabase
        .from("users")
        .select("telegram_username, wallet_address, total_wins, total_staked")
        .order("total_wins", { ascending: false })
        .limit(10);

      if (data) {
        const formattedLeaderboard = data.map((user) => ({
          username:
            user.telegram_username ||
            (user.wallet_address
              ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
              : "Anonymous"),
          wins: user.total_wins,
          totalStaked: user.total_staked,
        }));

        setLeaderboard(formattedLeaderboard);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  const referralCode =
    user?.telegram_username ||
    user?.telegram_id?.toString() ||
    user?.wallet_address ||
    "";

  const value: AppContextType = {
    user,
    loading,
    settings,
    updateSettings,
    language,
    t,
    setLanguage,
    playGame,
    recordGameResult,
    referralCode,
    referralStats,
    processReferral,
    playSound,
    haptic,
    leaderboard,
    refreshLeaderboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
