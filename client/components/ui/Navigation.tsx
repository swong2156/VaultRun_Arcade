import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/context/WalletContext";
import { useTelegram } from "@/context/TelegramContext";
import {
  Home,
  Users,
  History,
  Settings,
  HelpCircle,
  Wallet,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const location = useLocation();
  const { isConnected, address, connect } = useWallet();
  const { isInTelegram } = useTelegram();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/arcade", icon: Menu, label: "Arcade" },
    { to: "/referral", icon: Users, label: "Referral" },
    { to: "/history", icon: History, label: "History" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive(item.to)
                    ? "bg-neon-green text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Navigation Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-40">
        <div className="p-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 mb-8">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-neon-green">VaultRun</h1>
          </Link>

          {/* Wallet Status */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            {isConnected && address ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-neon-green" />
                  <Badge className="bg-green-600 text-white">Connected</Badge>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            ) : (
              <Button
                onClick={connect}
                className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                size="sm"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Platform Badge */}
          {isInTelegram && (
            <Badge className="bg-blue-600 text-white mb-6">
              📱 Telegram Mini App
            </Badge>
          )}

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive(item.to)
                      ? "bg-neon-green text-black"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center text-xs text-gray-500">
              <p>VaultRun v1.0.0</p>
              <p>Crypto Gaming Arcade</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
