import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/Navigation";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  TrendingUp,
  Users,
  Coins,
  Target,
  RefreshCw,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  wins: number;
  totalStaked: number;
  winRate: number;
  avatar: string;
}

export default function Leaderboard() {
  const { t, leaderboard, refreshLeaderboard, user } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedPeriod]);

  const loadLeaderboard = async () => {
    setLoading(true);
    await refreshLeaderboard();
    setLoading(false);
  };

  const periods = [
    { id: "all", name: t("all_time"), icon: Trophy },
    { id: "month", name: t("this_month"), icon: Crown },
    { id: "week", name: t("this_week"), icon: Medal },
    { id: "today", name: t("today"), icon: Star },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-black";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-black";
      default:
        return "bg-gray-700 text-white";
    }
  };

  // Mock leaderboard data for demonstration
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "CryptoKing",
      wins: 247,
      totalStaked: 15.6,
      winRate: 68,
      avatar: "👑",
    },
    {
      rank: 2,
      username: "DiamondHands",
      wins: 189,
      totalStaked: 12.3,
      winRate: 62,
      avatar: "💎",
    },
    {
      rank: 3,
      username: "MoonShot",
      wins: 156,
      totalStaked: 9.8,
      winRate: 59,
      avatar: "🚀",
    },
    {
      rank: 4,
      username: "VaultMaster",
      wins: 134,
      totalStaked: 8.2,
      winRate: 55,
      avatar: "⚡",
    },
    {
      rank: 5,
      username: "GemHunter",
      wins: 98,
      totalStaked: 6.7,
      winRate: 52,
      avatar: "💰",
    },
  ];

  const currentUserRank = user ? 15 : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="main-content">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 p-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🏆 {t("leaderboard")}
                </motion.h1>
                <p className="text-gray-400 mt-2">
                  {t("top_performers_description")}
                </p>
              </div>

              <motion.div
                className="flex gap-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={loadLeaderboard}
                  disabled={loading}
                  variant="outline"
                  className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  {t("refresh")}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Period Selection */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              📅 {t("time_period")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => {
                const IconComponent = period.icon;
                const isActive = selectedPeriod === period.id;

                return (
                  <Button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    variant={isActive ? "default" : "outline"}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                        : "border-gray-600 text-gray-400 hover:text-white hover:border-neon-blue"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {period.name}
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Current User Rank */}
          {currentUserRank && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border-neon-green">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {t("your_rank")}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {t("current_position")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-neon-green">
                        #{currentUserRank}
                      </div>
                      <p className="text-sm text-gray-400">
                        {user?.total_wins || 0} {t("wins")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Top 3 Podium */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              🥇 {t("top_champions")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockLeaderboard.slice(0, 3).map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.7 }}
                  className={`order-${index === 0 ? "2 md:order-1" : index === 1 ? "1 md:order-2" : "3"}`}
                >
                  <Card
                    className={`${getRankBadgeColor(entry.rank).includes("gradient") ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900"} border-2 ${
                      entry.rank === 1
                        ? "border-yellow-500 shadow-2xl shadow-yellow-500/20"
                        : entry.rank === 2
                          ? "border-gray-400 shadow-xl shadow-gray-400/20"
                          : "border-amber-600 shadow-xl shadow-amber-600/20"
                    } relative overflow-hidden`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <motion.div
                        className="mb-4"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-5xl mb-2">{entry.avatar}</div>
                        <div className="flex justify-center mb-2">
                          {getRankIcon(entry.rank)}
                        </div>
                        <Badge className={getRankBadgeColor(entry.rank)}>
                          #{entry.rank}
                        </Badge>
                      </motion.div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {entry.username}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {t("wins")}
                          </span>
                          <span className="font-bold text-neon-green">
                            {entry.wins}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {t("staked")}
                          </span>
                          <span className="font-bold text-neon-blue">
                            {entry.totalStaked} ETH
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            {t("win_rate")}
                          </span>
                          <span className="font-bold text-neon-purple">
                            {entry.winRate}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t("full_rankings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {mockLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.9 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-l-4 border-transparent hover:border-neon-green"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(entry.rank)}
                          <div className="text-2xl">{entry.avatar}</div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white">
                            {entry.username}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {entry.wins} wins
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {entry.winRate}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-neon-blue">
                          <Coins className="w-5 h-5" />
                          {entry.totalStaked} ETH
                        </div>
                        <div className="text-sm text-gray-400">
                          {t("total_staked")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {mockLeaderboard[0]?.wins || 0}
                </p>
                <p className="text-sm text-gray-400">{t("top_wins")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-green/20 to-green-600/20 border-neon-green/50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {mockLeaderboard[0]?.winRate || 0}%
                </p>
                <p className="text-sm text-gray-400">{t("best_win_rate")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-blue/20 to-blue-600/20 border-neon-blue/50">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {mockLeaderboard[0]?.totalStaked || 0}
                </p>
                <p className="text-sm text-gray-400">{t("highest_stake")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-purple/20 to-purple-600/20 border-neon-purple/50">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {mockLeaderboard.length}
                </p>
                <p className="text-sm text-gray-400">{t("total_players")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
