import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { useApp } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Smartphone,
  Monitor,
  Shield,
  ExternalLink,
} from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "mobile" | "desktop" | "web";
  popular?: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    category: "web",
    popular: true,
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Secure mobile crypto wallet",
    category: "mobile",
    popular: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Easy-to-use wallet by Coinbase",
    category: "web",
    popular: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect any mobile wallet",
    category: "mobile",
    popular: true,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "🌈",
    description: "Colorful, fun crypto wallet",
    category: "mobile",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "Solana & Ethereum wallet",
    category: "web",
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "⭕",
    description: "Multi-chain crypto wallet",
    category: "web",
  },
  {
    id: "binance",
    name: "Binance Web3",
    icon: "🟡",
    description: "Binance's crypto wallet",
    category: "web",
  },
];

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WalletConnectModal({
  open,
  onOpenChange,
}: WalletConnectModalProps) {
  const { connect, connecting } = useWallet();
  const { playSound, haptic, t } = useApp();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleWalletSelect = async (walletId: string) => {
    try {
      setSelectedWallet(walletId);
      playSound("click");
      haptic("medium");

      // Simulate wallet-specific connection logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await connect();
      onOpenChange(false);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setSelectedWallet(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "web":
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mobile":
        return "text-neon-blue border-neon-blue";
      case "desktop":
        return "text-neon-purple border-neon-purple";
      case "web":
        return "text-neon-green border-neon-green";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            🔗 {t("connect_wallet")}
          </DialogTitle>
          <p className="text-gray-400 text-center">
            Choose your preferred wallet to start playing with real crypto
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg border border-neon-green/30">
            <Shield className="w-5 h-5 text-neon-green mt-0.5" />
            <div>
              <h3 className="text-white font-medium">🔐 Secure Connection</h3>
              <p className="text-sm text-gray-400">
                VaultRun uses WalletConnect for secure wallet connections. Your
                private keys never leave your wallet.
              </p>
            </div>
          </div>

          {/* Popular Wallets */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              ⭐ Popular Wallets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {walletOptions
                .filter((wallet) => wallet.popular)
                .map((wallet) => (
                  <motion.div
                    key={wallet.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleWalletSelect(wallet.id)}
                      disabled={connecting || selectedWallet !== null}
                      className="w-full h-auto p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-neon-green text-left relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="text-3xl">{wallet.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">
                              {wallet.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCategoryColor(wallet.category)}`}
                            >
                              {getCategoryIcon(wallet.category)}
                              {wallet.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {wallet.description}
                          </p>
                        </div>
                        {selectedWallet === wallet.id && (
                          <Loader2 className="w-5 h-5 animate-spin text-neon-green" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* All Wallets */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              🔗 More Wallets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {walletOptions
                .filter((wallet) => !wallet.popular)
                .map((wallet) => (
                  <motion.div
                    key={wallet.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleWalletSelect(wallet.id)}
                      disabled={connecting || selectedWallet !== null}
                      variant="outline"
                      className="w-full h-auto p-3 bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-neon-blue text-left"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-2xl">{wallet.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">
                              {wallet.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCategoryColor(wallet.category)}`}
                            >
                              {getCategoryIcon(wallet.category)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            {wallet.description}
                          </p>
                        </div>
                        {selectedWallet === wallet.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-neon-blue" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white font-medium mb-2">📱 How to Connect:</h4>
            <ol className="text-sm text-gray-400 space-y-1">
              <li>1. Select your wallet from the list above</li>
              <li>2. Approve the connection in your wallet app</li>
              <li>3. Start playing with real crypto!</li>
            </ol>
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {(connecting || selectedWallet) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center p-6"
              >
                <Loader2 className="w-8 h-8 animate-spin text-neon-green mx-auto mb-3" />
                <p className="text-white font-medium">
                  Connecting to{" "}
                  {selectedWallet
                    ? walletOptions.find((w) => w.id === selectedWallet)?.name
                    : "wallet"}
                  ...
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please check your wallet app to approve the connection
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
