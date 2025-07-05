import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "USDT" | "BTC" | "ETH" | "USD" | "EUR" | "GBP";

export interface GameHistory {
  id: string;
  gameName: string;
  betAmount: number;
  currency: Currency;
  result: "win" | "loss";
  winAmount?: number;
  timestamp: Date;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winStreak: number;
  currentStreak: number;
  totalWinnings: number;
  totalLosses: number;
}

export interface UserBalance {
  USDT: number;
  BTC: number;
  ETH: number;
  USD: number;
  EUR: number;
  GBP: number;
}

interface GameContextType {
  // Balances
  balances: UserBalance;
  currentCurrency: Currency;

  // Game data
  gameHistory: GameHistory[];
  gameStats: GameStats;

  // Actions
  setCurrency: (currency: Currency) => void;
  placeBet: (amount: number, gameName: string) => boolean;
  recordWin: (betAmount: number, winAmount: number, gameName: string) => void;
  recordLoss: (betAmount: number, gameName: string) => void;

  // Utilities
  getCurrentBalance: () => number;
  canAffordBet: (amount: number) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialBalances: UserBalance = {
  USDT: 10000,
  BTC: 0.5,
  ETH: 5.0,
  USD: 10000,
  EUR: 9500,
  GBP: 8500,
};

const initialStats: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  winStreak: 0,
  currentStreak: 0,
  totalWinnings: 0,
  totalLosses: 0,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [balances, setBalances] = useState<UserBalance>(initialBalances);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("USDT");
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>(initialStats);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBalances = localStorage.getItem("vaultrun_balances");
    const savedCurrency = localStorage.getItem("vaultrun_currency");
    const savedHistory = localStorage.getItem("vaultrun_history");
    const savedStats = localStorage.getItem("vaultrun_stats");

    if (savedBalances) setBalances(JSON.parse(savedBalances));
    if (savedCurrency) setCurrentCurrency(savedCurrency as Currency);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      // Convert timestamp strings back to Date objects
      const historyWithDates = parsedHistory.map((game: any) => ({
        ...game,
        timestamp: new Date(game.timestamp),
      }));
      setGameHistory(historyWithDates);
    }
    if (savedStats) setGameStats(JSON.parse(savedStats));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("vaultrun_balances", JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem("vaultrun_currency", currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem("vaultrun_history", JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    localStorage.setItem("vaultrun_stats", JSON.stringify(gameStats));
  }, [gameStats]);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const getCurrentBalance = () => {
    return balances[currentCurrency];
  };

  const canAffordBet = (amount: number) => {
    return getCurrentBalance() >= amount;
  };

  const placeBet = (amount: number, gameName: string) => {
    if (!canAffordBet(amount)) return false;

    setBalances((prev) => ({
      ...prev,
      [currentCurrency]: prev[currentCurrency] - amount,
    }));

    return true;
  };

  const recordWin = (
    betAmount: number,
    winAmount: number,
    gameName: string,
  ) => {
    // Add winnings to balance
    setBalances((prev) => ({
      ...prev,
      [currentCurrency]: prev[currentCurrency] + winAmount,
    }));

    // Update stats
    setGameStats((prev) => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      wins: prev.wins + 1,
      currentStreak: prev.currentStreak >= 0 ? prev.currentStreak + 1 : 1,
      winStreak: Math.max(
        prev.winStreak,
        prev.currentStreak >= 0 ? prev.currentStreak + 1 : 1,
      ),
      totalWinnings: prev.totalWinnings + winAmount,
    }));

    // Add to history
    const historyEntry: GameHistory = {
      id: Date.now().toString(),
      gameName,
      betAmount,
      currency: currentCurrency,
      result: "win",
      winAmount,
      timestamp: new Date(),
    };

    setGameHistory((prev) => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const recordLoss = (betAmount: number, gameName: string) => {
    // Update stats
    setGameStats((prev) => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      losses: prev.losses + 1,
      currentStreak: prev.currentStreak <= 0 ? prev.currentStreak - 1 : -1,
      totalLosses: prev.totalLosses + betAmount,
    }));

    // Add to history
    const historyEntry: GameHistory = {
      id: Date.now().toString(),
      gameName,
      betAmount,
      currency: currentCurrency,
      result: "loss",
      timestamp: new Date(),
    };

    setGameHistory((prev) => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const value: GameContextType = {
    balances,
    currentCurrency,
    gameHistory,
    gameStats,
    setCurrency,
    placeBet,
    recordWin,
    recordLoss,
    getCurrentBalance,
    canAffordBet,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
