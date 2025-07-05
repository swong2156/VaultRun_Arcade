import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import GameCard from "@/components/ui/GameCard";
import { gamesList } from "@/components/games/gamesList";

export default function Dashboard() {
  const {
    balances,
    currentCurrency,
    setCurrency,
    gameHistory,
    gameStats,
    getCurrentBalance,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Games", emoji: "🎮" },
    { id: "suspense", name: "Suspense", emoji: "🔥" },
    { id: "puzzle", name: "Puzzle", emoji: "🧠" },
    { id: "reflex", name: "Reflex", emoji: "⚡" },
    { id: "high-risk", name: "High Risk", emoji: "🏆" },
  ];

  const filteredGames =
    selectedCategory === "all"
      ? gamesList
      : gamesList.filter((game) => game.category === selectedCategory);

  const formatBalance = (amount: number, currency: string) => {
    if (currency === "BTC" || currency === "ETH") {
      return amount.toFixed(6);
    }
    return amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "BTC":
        return "₿";
      case "ETH":
        return "Ξ";
      case "USDT":
        return "₮";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-gaming font-black neon-green">
                ⚡ VaultRun
              </h1>
              <Badge
                variant="outline"
                className="bg-neon-green/10 text-neon-green border-neon-green"
              >
                🟢 Connected
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              {/* Currency Selector */}
              <Select value={currentCurrency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32 bg-card border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20">
                  {Object.keys(balances).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {getCurrencyIcon(currency)} {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Current Balance */}
              <Card className="bg-gradient-to-r from-primary/20 to-neon-blue/20 border-primary/30">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold text-neon-green">
                      {getCurrencyIcon(currentCurrency)}{" "}
                      {formatBalance(getCurrentBalance(), currentCurrency)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-neon-green">
                    {gameStats.wins}
                  </p>
                  <p className="text-sm text-muted-foreground">Wins</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-neon-red">
                    {gameStats.losses}
                  </p>
                  <p className="text-sm text-muted-foreground">Losses</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-neon-yellow">
                    {gameStats.winStreak}
                  </p>
                  <p className="text-sm text-muted-foreground">Best Streak</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-neon-blue">
                    {gameStats.totalGames}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Games</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Game Categories */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "border-primary/20 hover:bg-primary/10"
                    }`}
                  >
                    {category.emoji} {category.name}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Games Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-card/50">
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="balances">Balances</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
                  <Card className="bg-card/50 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Games</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        <div className="p-4 space-y-3">
                          {gameHistory.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No games played yet
                            </p>
                          ) : (
                            gameHistory.slice(0, 20).map((game) => (
                              <div
                                key={game.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {game.gameName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {game.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`text-sm font-bold ${
                                      game.result === "win"
                                        ? "text-neon-green"
                                        : "text-neon-red"
                                    }`}
                                  >
                                    {game.result === "win" ? "+" : "-"}
                                    {getCurrencyIcon(game.currency)}
                                    {formatBalance(
                                      game.result === "win"
                                        ? game.winAmount!
                                        : game.betAmount,
                                      game.currency,
                                    )}
                                  </p>
                                  <Badge
                                    variant={
                                      game.result === "win"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {game.result.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="balances" className="mt-4">
                  <Card className="bg-card/50 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">All Balances</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(balances).map(([currency, amount]) => (
                        <div
                          key={currency}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getCurrencyIcon(currency)}
                            </span>
                            <span className="font-medium">{currency}</span>
                          </div>
                          <span className="font-bold">
                            {formatBalance(amount, currency)}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
