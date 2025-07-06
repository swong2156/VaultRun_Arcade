import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

export type CryptoCurrency =
  | "ETH"
  | "USDT"
  | "BTC"
  | "MATIC"
  | "BNB"
  | "DOGE"
  | "ADA"
  | "SOL";

export interface WalletBalance {
  ETH: number;
  USDT: number;
  BTC: number;
  MATIC: number;
  BNB: number;
  DOGE: number;
}

export interface Transaction {
  id: string;
  hash: string;
  gameName: string;
  amount: number;
  currency: CryptoCurrency;
  type: "stake" | "win" | "loss";
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
}

interface WalletContextType {
  // Connection state
  isConnected: boolean;
  address: string | null;
  connecting: boolean;

  // Balances
  balances: WalletBalance;
  currentCurrency: CryptoCurrency;

  // Transactions
  transactions: Transaction[];

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setCurrency: (currency: CryptoCurrency) => void;
  sendStakeTransaction: (
    amount: number,
    gameName: string,
  ) => Promise<string | null>;
  sendWinTransaction: (
    amount: number,
    gameName: string,
  ) => Promise<string | null>;
  refreshBalances: () => Promise<void>;

  // Utilities
  getCurrentBalance: () => number;
  canAffordBet: (amount: number) => boolean;
  formatBalance: (amount: number, currency: CryptoCurrency) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// For demo purposes, we'll simulate wallet connection
// In production, this would be replaced with actual WalletConnect/Reown integration

const initialBalances: WalletBalance = {
  ETH: 0,
  USDT: 0,
  BTC: 0,
  MATIC: 0,
  BNB: 0,
  DOGE: 0,
};

// Mock balances for testing (when wallet is not connected)
const mockBalances: WalletBalance = {
  ETH: 2.5,
  USDT: 5000,
  BTC: 0.1,
  MATIC: 100,
  BNB: 5,
  DOGE: 1000,
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [balances, setBalances] = useState<WalletBalance>(mockBalances);
  const [currentCurrency, setCurrentCurrency] = useState<CryptoCurrency>("ETH");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("vaultrun_currency");
    const savedTransactions = localStorage.getItem("vaultrun_transactions");

    if (savedCurrency) setCurrentCurrency(savedCurrency as CryptoCurrency);
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      const transactionsWithDates = parsedTransactions.map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp),
      }));
      setTransactions(transactionsWithDates);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("vaultrun_currency", currentCurrency);
  }, [currentCurrency]);

  useEffect(() => {
    localStorage.setItem("vaultrun_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const connect = async () => {
    try {
      setConnecting(true);

      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock wallet address
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      setAddress(mockAddress);
      setIsConnected(true);

      // Generate realistic crypto balances
      const realBalances: WalletBalance = {
        ETH: Math.random() * 2 + 0.1,
        USDT: Math.random() * 5000 + 100,
        BTC: Math.random() * 0.5 + 0.01,
        MATIC: Math.random() * 200 + 10,
        BNB: Math.random() * 5 + 0.5,
        DOGE: Math.random() * 1000 + 50,
      };
      setBalances(realBalances);

      toast.success("🎉 Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("❌ Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnected(false);
      setAddress(null);
      setBalances(mockBalances); // Return to mock balances
      toast.success("👋 Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("❌ Failed to disconnect wallet");
    }
  };

  const setCurrency = (currency: CryptoCurrency) => {
    setCurrentCurrency(currency);
  };

  const refreshBalances = async () => {
    if (!isConnected || !address) {
      setBalances(mockBalances);
      return;
    }

    try {
      // In a real implementation, you would fetch actual balances from the blockchain
      // For now, we'll simulate with some realistic values
      const realBalances: WalletBalance = {
        ETH: Math.random() * 5,
        USDT: Math.random() * 10000,
        BTC: Math.random() * 0.5,
        MATIC: Math.random() * 500,
        BNB: Math.random() * 10,
        DOGE: Math.random() * 5000,
      };
      setBalances(realBalances);
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    }
  };

  const sendStakeTransaction = async (
    amount: number,
    gameName: string,
  ): Promise<string | null> => {
    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock transaction hash
      const mockTx: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gameName,
        amount,
        currency: currentCurrency,
        type: "stake",
        status: "confirmed",
        timestamp: new Date(),
      };

      setTransactions((prev) => [mockTx, ...prev.slice(0, 49)]);

      // Deduct from balance
      setBalances((prev) => ({
        ...prev,
        [currentCurrency]: Math.max(0, prev[currentCurrency] - amount),
      }));

      return mockTx.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      return null;
    }
  };

  const sendWinTransaction = async (
    amount: number,
    gameName: string,
  ): Promise<string | null> => {
    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const transaction: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gameName,
        amount,
        currency: currentCurrency,
        type: "win",
        status: "confirmed",
        timestamp: new Date(),
      };

      setTransactions((prev) => [transaction, ...prev.slice(0, 49)]);

      // Add to balance
      setBalances((prev) => ({
        ...prev,
        [currentCurrency]: prev[currentCurrency] + amount,
      }));

      return transaction.hash;
    } catch (error) {
      console.error("Win transaction failed:", error);
      return null;
    }
  };

  const getCurrentBalance = () => {
    return balances[currentCurrency];
  };

  const canAffordBet = (amount: number) => {
    return getCurrentBalance() >= amount;
  };

  const formatBalance = (amount: number, currency: CryptoCurrency): string => {
    switch (currency) {
      case "BTC":
        return amount.toFixed(8);
      case "ETH":
        return amount.toFixed(6);
      case "USDT":
        return amount.toFixed(2);
      case "MATIC":
        return amount.toFixed(4);
      case "BNB":
        return amount.toFixed(4);
      case "DOGE":
        return amount.toFixed(2);
      default:
        return amount.toFixed(4);
    }
  };

  const value: WalletContextType = {
    isConnected,
    address,
    connecting,
    balances,
    currentCurrency,
    transactions,
    connect,
    disconnect,
    setCurrency,
    sendStakeTransaction,
    sendWinTransaction,
    refreshBalances,
    getCurrentBalance,
    canAffordBet,
    formatBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
