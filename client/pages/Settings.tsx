import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useTelegram } from "@/context/TelegramContext";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/ui/Navigation";
import { languages, Language } from "@/lib/i18n";
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
  User,
  Palette,
  Bell,
  Vibrate,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { isConnected, address, disconnect } = useWallet();
  const { user: telegramUser, isInTelegram } = useTelegram();
  const {
    user,
    settings,
    updateSettings,
    language,
    setLanguage,
    t,
    playSound,
    haptic,
  } = useApp();

  const handleSoundToggle = async (enabled: boolean) => {
    await updateSettings({ sound_enabled: enabled });
    playSound("click");
    toast.success(
      enabled ? "🔊 " + t("sound_enabled") : "🔇 " + t("sound_disabled"),
    );
  };

  const handleDarkModeToggle = async (enabled: boolean) => {
    await updateSettings({ theme: enabled ? "dark" : "light" });
    haptic("light");
    toast.success(
      enabled
        ? "🌙 " + t("dark_mode_enabled")
        : "☀️ " + t("light_mode_enabled"),
    );
  };

  const handleNotificationsToggle = async (enabled: boolean) => {
    await updateSettings({ notifications_enabled: enabled });
    haptic("light");
    toast.success(
      enabled
        ? "🔔 " + t("notifications_enabled")
        : "🔕 " + t("notifications_disabled"),
    );
  };

  const handleHapticToggle = async (enabled: boolean) => {
    await updateSettings({ haptic_enabled: enabled });
    if (enabled) haptic("medium");
    toast.success(
      enabled ? "📳 " + t("haptic_enabled") : "📴 " + t("haptic_disabled"),
    );
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    playSound("click");
    toast.success("🌍 " + t("language_updated"));
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("👋 " + t("wallet_disconnected"));
    } catch (error) {
      toast.error(t("disconnect_failed"));
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("📋 Address copied!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="main-content p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-neon-green">
              ⚙️ {t("settings")}
            </h1>
            <p className="text-gray-400">{t("manage_preferences")}</p>
          </div>

          {/* User Info */}
          {(isConnected || isInTelegram || user) && (
            <Card className="bg-gray-900 border-neon-green">
              <CardHeader>
                <CardTitle className="text-neon-green flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("account_information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Stats */}
                {user && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-neon-green">
                        {user.total_games}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t("total_games")}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-neon-blue">
                        {user.total_wins}
                      </div>
                      <div className="text-xs text-gray-400">{t("wins")}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-500">
                        {user.total_games > 0
                          ? Math.round(
                              (user.total_wins / user.total_games) * 100,
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-xs text-gray-400">
                        {t("win_rate")}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-neon-purple">
                        {user.total_staked.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t("total_staked")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Telegram User */}
                {isInTelegram && telegramUser && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{t("platform")}</span>
                      <Badge className="bg-blue-600 text-white">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Telegram
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{t("username")}</span>
                      <span className="text-white">
                        {telegramUser.username || telegramUser.first_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{t("user_id")}</span>
                      <span className="text-white font-mono">
                        {telegramUser.id}
                      </span>
                    </div>
                  </div>
                )}

                {/* Wallet Info */}
                {isConnected && address && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">
                        {t("wallet_status")}
                      </span>
                      <Badge className="bg-green-600 text-white">
                        <Wallet className="w-3 h-3 mr-1" />
                        {t("connected")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">{t("address")}</span>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(address);
                          toast.success("📋 " + t("address_copied"));
                        }}
                        className="text-white font-mono text-sm h-auto p-1"
                      >
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </Button>
                    </div>
                  </div>
                )}

                {!isConnected && !user && (
                  <div className="text-center py-4">
                    <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">{t("no_wallet_connected")}</p>
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
                {t("game_preferences")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.sound_enabled ? (
                    <Volume2 className="w-5 h-5 text-neon-blue" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {t("sound_effects")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t("play_sounds_during_games")}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.sound_enabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell
                    className={`w-5 h-5 ${settings.notifications_enabled ? "text-neon-green" : "text-gray-500"}`}
                  />
                  <div>
                    <div className="text-white font-medium">
                      {t("notifications")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t("get_notified_about_games")}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications_enabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>

              {isInTelegram && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Vibrate
                      className={`w-5 h-5 ${settings.haptic_enabled ? "text-neon-purple" : "text-gray-500"}`}
                    />
                    <div>
                      <div className="text-white font-medium">
                        {t("haptic_feedback")}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t("vibrate_on_game_actions")}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.haptic_enabled}
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
                <h3 className="text-white font-medium mb-2">
                  🔐 Privacy Notice
                </h3>
                <p className="text-sm text-gray-400">
                  VaultRun uses WalletConnect to securely connect your wallet.
                  We never store your private keys or seed phrases. All
                  transactions are initiated and signed from your connected
                  wallet only.
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-medium mb-2">📊 Data Usage</h3>
                <p className="text-sm text-gray-400">
                  We only store your game history and preferences locally in
                  your browser. No personal data is sent to external servers.
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
    </div>
  );
}
