import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;

  ready(): void;
  expand(): void;
  close(): void;
  MainButton: any;
  BackButton: any;
  HapticFeedback: any;
  showAlert(message: string): void;
  showConfirm(message: string, callback: (confirmed: boolean) => void): void;
  showPopup(params: any, callback?: (button_id: string) => void): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  enableVerticalSwipes(): void;
  disableVerticalSwipes(): void;
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isInTelegram: boolean;
  colorScheme: "light" | "dark";
  ready: boolean;
}

const TelegramContext = createContext<TelegramContextType | undefined>(
  undefined,
);

// Mock user for development/demo
const mockTelegramUser: TelegramUser = {
  id: 123456789,
  first_name: "Vault",
  last_name: "Player",
  username: "demo_user",
  language_code: "en",
  is_premium: false,
};

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check if we're running in Telegram
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      setWebApp(tg);
      setIsInTelegram(true);

      // Configure Telegram WebApp
      tg.ready();
      tg.expand();

      // Set theme
      const scheme = tg.colorScheme || "dark";
      setColorScheme(scheme);
      document.documentElement.classList.toggle("dark", scheme === "dark");
      document.body.setAttribute("data-theme", scheme);

      // Set colors to match Telegram theme
      if (scheme === "dark") {
        tg.setHeaderColor("#020817"); // Dark background
        tg.setBackgroundColor("#020817");
      } else {
        tg.setHeaderColor("#ffffff"); // Light background
        tg.setBackgroundColor("#ffffff");
      }

      // Get user data (use mock for demo)
      const telegramUser = tg.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
      } else {
        // Use mock user for demo/development
        setUser(mockTelegramUser);
      }

      // Disable closing confirmation for better UX
      tg.disableClosingConfirmation();

      // Enable vertical swipes
      tg.enableVerticalSwipes();

      // Listen for theme changes
      const handleThemeChange = () => {
        const newScheme = tg.colorScheme || "dark";
        setColorScheme(newScheme);
        document.documentElement.classList.toggle("dark", newScheme === "dark");
        document.body.setAttribute("data-theme", newScheme);
      };

      // Note: Telegram doesn't have a theme change event, but we set it once
      setReady(true);
    } else {
      // Not in Telegram - use default dark theme and mock user
      setIsInTelegram(false);
      setColorScheme("dark");
      setUser(mockTelegramUser);
      document.documentElement.classList.add("dark");
      document.body.setAttribute("data-theme", "dark");
      setReady(true);
    }
  }, []);

  const value: TelegramContextType = {
    webApp,
    user,
    isInTelegram,
    colorScheme,
    ready,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
}

// Utility function for haptic feedback
export function hapticFeedback(
  type: "impact" | "notification" | "selection" = "impact",
) {
  const tg = (window as any).Telegram?.WebApp;
  if (tg?.HapticFeedback) {
    switch (type) {
      case "impact":
        tg.HapticFeedback.impactOccurred("medium");
        break;
      case "notification":
        tg.HapticFeedback.notificationOccurred("success");
        break;
      case "selection":
        tg.HapticFeedback.selectionChanged();
        break;
    }
  }
}

// Utility function to show Telegram alerts
export function showTelegramAlert(message: string) {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}

// Utility function to show Telegram popups
export function showTelegramPopup(
  title: string,
  message: string,
  buttons: Array<{ id: string; type?: string; text: string }> = [
    { id: "ok", type: "default", text: "OK" },
  ],
): Promise<string> {
  return new Promise((resolve) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.showPopup(
        {
          title,
          message,
          buttons,
        },
        (button_id: string) => {
          resolve(button_id);
        },
      );
    } else {
      // Fallback for non-Telegram environments
      if (confirm(`${title}\n\n${message}`)) {
        resolve("ok");
      } else {
        resolve("cancel");
      }
    }
  });
}
