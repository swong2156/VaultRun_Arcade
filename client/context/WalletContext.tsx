import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

export type CryptoCurrency = "ETH" | "USDT" | "BTC" | "MATIC" | "BNB" | "DOGE";

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

// WalletConnect Project ID
const projectId = "fa4b37eb3e10e3437345e2e6cc130c0b";

// Networks
const networks = [mainnet, arbitrum, polygon, base];

// Create modal
const metadata = {
  name: "VaultRun",
  description: "Crypto Game Arcade",
  url: "https://vault-run-arcade.vercel.app",
  icons: ["https://vault-run-arcade.vercel.app/favicon.ico"],
};

const ethersAdapter = new EthersAdapter();

createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

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
      // This opens the WalletConnect modal
      await ethersAdapter.connectWalletConnect();

      // Get connected account
      const provider = ethersAdapter.getWalletConnectProvider();
      if (provider && provider.accounts.length > 0) {
        setAddress(provider.accounts[0]);
        setIsConnected(true);
        await refreshBalances();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await ethersAdapter.disconnect();
      setIsConnected(false);
      setAddress(null);
      setBalances(mockBalances); // Return to mock balances
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
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
    if (!isConnected || !address) {
      // For demo mode, just simulate a transaction
      const mockTx: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        gameName,
        amount,
        currency: currentCurrency,
        type: "stake",
        status: "confirmed",
        timestamp: new Date(),
      };

      setTransactions((prev) => [mockTx, ...prev.slice(0, 49)]);

      // Deduct from mock balance
      setBalances((prev) => ({
        ...prev,
        [currentCurrency]: Math.max(0, prev[currentCurrency] - amount),
      }));

      return mockTx.hash;
    }

    try {
      // Real transaction logic would go here
      const provider = ethersAdapter.getWalletConnectProvider();
      if (!provider) throw new Error("No provider available");

      // Create transaction
      const tx = {
        to: "0x742d35Cc6634C0532925a3b8D581C9F63d92d7f2", // Game contract address
        value: (amount * 1e18).toString(), // Convert to wei
        gasLimit: "21000",
      };

      // Send transaction
      const result = await provider.request({
        method: "eth_sendTransaction",
        params: [tx],
      });

      // Record transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        hash: result as string,
        gameName,
        amount,
        currency: currentCurrency,
        type: "stake",
        status: "pending",
        timestamp: new Date(),
      };

      setTransactions((prev) => [transaction, ...prev.slice(0, 49)]);

      return result as string;
    } catch (error) {
      console.error("Transaction failed:", error);
      return null;
    }
  };

  const sendWinTransaction = async (
    amount: number,
    gameName: string,
  ): Promise<string | null> => {
    if (!isConnected || !address) {
      // For demo mode, just simulate adding winnings
      const mockTx: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        gameName,
        amount,
        currency: currentCurrency,
        type: "win",
        status: "confirmed",
        timestamp: new Date(),
      };

      setTransactions((prev) => [mockTx, ...prev.slice(0, 49)]);

      // Add to mock balance
      setBalances((prev) => ({
        ...prev,
        [currentCurrency]: prev[currentCurrency] + amount,
      }));

      return mockTx.hash;
    }

    try {
      // In a real implementation, this would be handled by the smart contract
      // For now, just record the win
      const transaction: Transaction = {
        id: Date.now().toString(),
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
        gameName,
        amount,
        currency: currentCurrency,
        type: "win",
        status: "confirmed",
        timestamp: new Date(),
      };

      setTransactions((prev) => [transaction, ...prev.slice(0, 49)]);
      await refreshBalances();

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
