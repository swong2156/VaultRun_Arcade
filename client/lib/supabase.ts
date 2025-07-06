import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gncddrvvyhxotjekhxch.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduY2RkcnZ2eWh4b3RqZWtoeGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjMyMTEsImV4cCI6MjA2NzIzOTIxMX0.OSiwdyybm10JmMKYEEtpwO2vx0IB-62Rli8lSVQMOYo";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface User {
  id: string;
  wallet_address?: string;
  telegram_id?: number;
  telegram_username?: string;
  referred_by?: string;
  total_games: number;
  total_wins: number;
  total_losses: number;
  total_staked: number;
  total_winnings: number;
  referral_earnings: number;
  language: string;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  sound_enabled: boolean;
  haptic_enabled: boolean;
  notifications_enabled: boolean;
  theme: "dark" | "light";
  language: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_name: string;
  stake_amount: number;
  currency: string;
  result: "win" | "loss";
  win_amount?: number;
  transaction_hash?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  commission_earned: number;
  created_at: string;
}

// Helper functions
export const getCurrentUser = async (
  walletAddress?: string,
  telegramId?: number,
) => {
  if (walletAddress) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    return { data, error };
  }

  if (telegramId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();

    return { data, error };
  }

  return { data: null, error: new Error("No identifier provided") };
};

export const createUser = async (userData: Partial<User>) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...userData,
        total_games: 0,
        total_wins: 0,
        total_losses: 0,
        total_staked: 0,
        total_winnings: 0,
        referral_earnings: 0,
        language: "en",
        settings: {
          sound_enabled: true,
          haptic_enabled: true,
          notifications_enabled: true,
          theme: "dark",
          language: "en",
        },
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const updateUserStats = async (
  userId: string,
  gameData: {
    gameResult: "win" | "loss";
    stakeAmount: number;
    winAmount?: number;
  },
) => {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError || !user) return { error: fetchError };

  const updates = {
    total_games: user.total_games + 1,
    total_staked: user.total_staked + gameData.stakeAmount,
    total_wins:
      gameData.gameResult === "win" ? user.total_wins + 1 : user.total_wins,
    total_losses:
      gameData.gameResult === "loss"
        ? user.total_losses + 1
        : user.total_losses,
    total_winnings:
      gameData.gameResult === "win"
        ? user.total_winnings + (gameData.winAmount || 0)
        : user.total_winnings,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
};

export const recordGameSession = async (
  sessionData: Omit<GameSession, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("game_sessions")
    .insert([
      {
        ...sessionData,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const getReferralStats = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, created_at")
    .eq("referred_by", userId);

  if (error) return { referredCount: 0, totalEarnings: 0, error };

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("referral_earnings")
    .eq("id", userId)
    .single();

  return {
    referredCount: data?.length || 0,
    totalEarnings: user?.referral_earnings || 0,
    error: userError,
  };
};

export const processReferralReward = async (
  referrerId: string,
  commission: number,
) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      referral_earnings: supabase.sql`referral_earnings + ${commission}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referrerId)
    .select()
    .single();

  return { data, error };
};
