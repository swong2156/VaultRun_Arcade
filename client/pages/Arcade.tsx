import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/Navigation";
import { gamesList } from "@/components/games/gamesList";
import {
  Trophy,
  Target,
  Zap,
  Flame,
  Star,
  Crown,
  Gem,
  Coins,
} from "lucide-react";

export default function Arcade() {
  const { t, playSound, haptic, settings } = useApp();
  const { isConnected, getCurrentBalance, currentCurrency, formatBalance } =
    useWallet();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const categories = [
    { id: "all", name: t("all_games"), icon: Target, color: "neon-green" },
    {
      id: "suspense",
      name: t("suspense"),
      icon: Flame,
      color: "neon-red",
    },
    { id: "puzzle", name: t("puzzle"), icon: Star, color: "neon-blue" },
    { id: "reflex", name: t("reflex"), icon: Zap, color: "neon-yellow" },
    {
      id: "high-risk",
      name: t("high_risk"),
      icon: Crown,
      color: "neon-purple",
    },
  ];

  const filteredGames =
    selectedCategory === "all"
      ? gamesList
      : gamesList.filter((game) => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-500 to-green-600";
      case "Medium":
        return "from-yellow-500 to-orange-500";
      case "Hard":
        return "from-red-500 to-red-600";
      case "Extreme":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getDifficultyWinRate = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return 55;
      case "Medium":
        return 40;
      case "Hard":
        return 30;
      case "Extreme":
        return 15;
      default:
        return 40;
    }
  };

  const getDifficultyMultiplier = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return 1.8;
      case "Medium":
        return 2.3;
      case "Hard":
        return 3.2;
      case "Extreme":
        return 6.5;
      default:
        return 2.3;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    playSound("click");
    haptic("light");
  };

  const handleGameHover = (gameId: string | null) => {
    setHoveredGame(gameId);
    if (gameId) {
      haptic("light");
    }
  };

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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🎮 {t("crypto_arcade")}
                </motion.h1>
                <p className="text-gray-400 mt-2">
                  {t("suspenseful_games_description")}
                </p>
              </div>

              {isConnected && (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-neon-green">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-neon-green" />
                        <div>
                          <p className="text-sm text-gray-400">
                            {t("balance")}
                          </p>
                          <p className="text-lg font-bold text-neon-green">
                            {formatBalance(
                              getCurrentBalance(),
                              currentCurrency,
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Selection */}
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              🎯 {t("game_categories")}
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleCategorySelect(category.id)}
                      variant={isActive ? "default" : "outline"}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r from-${category.color} to-${category.color}/80 text-black border-${category.color}`
                          : `border-${category.color}/50 text-${category.color} hover:bg-${category.color}/10`
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-black/20 text-white"
                      >
                        {
                          gamesList.filter(
                            (game) =>
                              category.id === "all" ||
                              game.category === category.id,
                          ).length
                        }
                      </Badge>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Games Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              🎲{" "}
              {selectedCategory === "all"
                ? t("all_games")
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      z: 50,
                    }}
                    onHoverStart={() => handleGameHover(game.id)}
                    onHoverEnd={() => handleGameHover(null)}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-neon-green transition-all duration-300 overflow-hidden group-hover:shadow-2xl group-hover:shadow-neon-green/20">
                      <CardContent className="p-0">
                        {/* Game Banner */}
                        <div
                          className={`h-32 bg-gradient-to-br ${getDifficultyColor(game.difficulty)} relative overflow-hidden`}
                        >
                          <motion.div
                            className="absolute inset-0 bg-black/20"
                            animate={{
                              opacity: hoveredGame === game.id ? 0 : 0.2,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute top-4 left-4">
                            <motion.span
                              className="text-4xl"
                              animate={{
                                scale: hoveredGame === game.id ? 1.2 : 1,
                                rotate: hoveredGame === game.id ? 10 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {game.emoji}
                            </motion.span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-black/50 text-white border-0">
                              {getDifficultyWinRate(game.difficulty)}%
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-neon-green text-black border-0">
                              {getDifficultyMultiplier(game.difficulty)}x
                            </Badge>
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                            {game.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={`${getDifficultyColor(game.difficulty).replace("from-", "border-").replace("to-", "text-").split(" ")[0]} ${getDifficultyColor(game.difficulty).replace("from-", "").replace("to-", "").split("-").slice(0, 2).join("-")}`}
                            >
                              {game.difficulty}
                            </Badge>

                            <div className="flex items-center gap-1">
                              <Gem className="w-3 h-3 text-neon-blue" />
                              <span className="text-xs text-gray-400">
                                {game.category}
                              </span>
                            </div>
                          </div>

                          <motion.div
                            className="mt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: hoveredGame === game.id ? 1 : 0,
                              y: hoveredGame === game.id ? 0 : 10,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-black font-bold"
                              onClick={() => {
                                playSound("play");
                                haptic("medium");
                                // Navigate to game or open game modal
                              }}
                            >
                              🎮 {t("play_now")}
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-neon-green/20 to-green-900/20 border-neon-green/50">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-neon-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {gamesList.length}
                </p>
                <p className="text-sm text-gray-400">{t("total_games")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-blue/20 to-blue-900/20 border-neon-blue/50">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">6</p>
                <p className="text-sm text-gray-400">{t("currencies")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-purple/20 to-purple-900/20 border-neon-purple/50">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-sm text-gray-400">{t("available")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-neon-yellow/20 to-yellow-900/20 border-neon-yellow/50">
              <CardContent className="p-4 text-center">
                <Gem className="w-8 h-8 text-neon-yellow mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">6.5x</p>
                <p className="text-sm text-gray-400">{t("max_multiplier")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
