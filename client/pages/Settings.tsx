import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useTelegram } from "@/context/TelegramContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/Navigation";
import {
  Wallet,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Smartphone,
  Globe,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { isConnected, address, disconnect } = useWallet();
  const { user, isInTelegram } = useTelegram();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSound = localStorage.getItem("vaultrun_sound");
    const savedDarkMode = localStorage.getItem("vaultrun_darkmode");
    const savedNotifications = localStorage.getItem("vaultrun_notifications");
    const savedHaptic = localStorage.getItem("vaultrun_haptic");

    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === "true");
    if (savedNotifications !== null)
      setNotifications(savedNotifications === "true");
    if (savedHaptic !== null) setHapticFeedback(savedHaptic === "true");
  }, []);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("vaultrun_sound", enabled.toString());
    toast.success(enabled ? "🔊 Sound enabled" : "🔇 Sound disabled");
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem("vaultrun_darkmode", enabled.toString());
    toast.success(enabled ? "🌙 Dark mode enabled" : "☀️ Light mode enabled");
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem("vaultrun_notifications", enabled.toString());
    toast.success(
      enabled ? "🔔 Notifications enabled" : "🔕 Notifications disabled",
    );
  };

  const handleHapticToggle = (enabled: boolean) => {
    setHapticFeedback(enabled);
    localStorage.setItem("vaultrun_haptic", enabled.toString());
    toast.success(
      enabled ? "📳 Haptic feedback enabled" : "📴 Haptic feedback disabled",
    );
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("👋 Wallet disconnected");
    } catch (error) {
      toast.error("Failed to disconnect wallet");
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("📋 Address copied!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-neon-green">⚙️ Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* User Info */}
        {(isConnected || isInTelegram) && (
          <Card className="bg-gray-900 border-neon-green">
            <CardHeader>
              <CardTitle className="text-neon-green flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Telegram User */}
              {isInTelegram && user && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Platform</span>
                    <Badge className="bg-blue-600 text-white">
                      <Smartphone className="w-3 h-3 mr-1" />
                      Telegram
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Username</span>
                    <span className="text-white">
                      {user.username || user.first_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">User ID</span>
                    <span className="text-white font-mono">{user.id}</span>
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              {isConnected && address && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Wallet Status</span>
                    <Badge className="bg-green-600 text-white">
                      <Wallet className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Address</span>
                    <Button
                      variant="ghost"
                      onClick={copyAddress}
                      className="text-white font-mono text-sm h-auto p-1"
                    >
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </Button>
                  </div>
                </div>
              )}

              {!isConnected && (
                <div className="text-center py-4">
                  <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No wallet connected</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Settings */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Game Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-neon-blue" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <div className="text-white font-medium">Sound Effects</div>
                  <div className="text-sm text-gray-400">
                    Play sounds during games
                  </div>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notifications ? (
                  <span className="text-neon-green text-xl">🔔</span>
                ) : (
                  <span className="text-gray-500 text-xl">🔕</span>
                )}
                <div>
                  <div className="text-white font-medium">Notifications</div>
                  <div className="text-sm text-gray-400">
                    Get notified about wins and losses
                  </div>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>

            {isInTelegram && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hapticFeedback ? (
                    <span className="text-neon-purple text-xl">📳</span>
                  ) : (
                    <span className="text-gray-500 text-xl">📴</span>
                  )}
                  <div>
                    <div className="text-white font-medium">
                      Haptic Feedback
                    </div>
                    <div className="text-sm text-gray-400">
                      Vibrate on game actions
                    </div>
                  </div>
                </div>
                <Switch
                  checked={hapticFeedback}
                  onCheckedChange={handleHapticToggle}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Display & Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-neon-blue" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <div className="text-white font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-400">
                    Use dark theme for better gaming experience
                  </div>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-neon-green text-xl">🌍</span>
                <div>
                  <div className="text-white font-medium">Language</div>
                  <div className="text-sm text-gray-400">English (US)</div>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-medium mb-2">🔐 Privacy Notice</h3>
              <p className="text-sm text-gray-400">
                VaultRun uses WalletConnect to securely connect your wallet. We
                never store your private keys or seed phrases. All transactions
                are initiated and signed from your connected wallet only.
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-medium mb-2">📊 Data Usage</h3>
              <p className="text-sm text-gray-400">
                We only store your game history and preferences locally in your
                browser. No personal data is sent to external servers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Actions */}
        {isConnected && (
          <Card className="bg-gray-900 border-red-500">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Wallet Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* App Info */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-gray-400 text-sm space-y-1">
              <div>VaultRun v1.0.0</div>
              <div>Crypto Game Arcade</div>
              <div>Built with ❤️ for the Web3 community</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
