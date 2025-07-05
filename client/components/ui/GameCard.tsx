import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Game } from "@/components/games/gamesList";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { canAffordBet, placeBet, recordWin, recordLoss, getCurrentBalance } =
    useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [gameResult, setGameResult] = useState<{
    type: "win" | "loss";
    amount: number;
  } | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-neon-green/20 text-neon-green border-neon-green";
      case "Medium":
        return "bg-neon-yellow/20 text-neon-yellow border-neon-yellow";
      case "Hard":
        return "bg-neon-red/20 text-neon-red border-neon-red";
      case "Extreme":
        return "bg-neon-purple/20 text-neon-purple border-neon-purple";
      default:
        return "bg-primary/20 text-primary border-primary";
    }
  };

  const playGame = async () => {
    if (!canAffordBet(betAmount)) {
      alert("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setGameResult(null);

    // Deduct bet amount
    placeBet(betAmount, game.name);

    // Simulate game logic with realistic win rates
    const winChance = getWinChance();
    const isWin = Math.random() < winChance;

    // Add suspense delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (isWin) {
      const multiplier = getWinMultiplier();
      const winAmount = betAmount * multiplier;
      recordWin(betAmount, winAmount, game.name);
      setGameResult({ type: "win", amount: winAmount });
    } else {
      recordLoss(betAmount, game.name);
      setGameResult({ type: "loss", amount: betAmount });
    }

    setIsPlaying(false);
  };

  const getWinChance = () => {
    switch (game.difficulty) {
      case "Easy":
        return 0.6; // 60% win rate
      case "Medium":
        return 0.4; // 40% win rate
      case "Hard":
        return 0.25; // 25% win rate
      case "Extreme":
        return 0.1; // 10% win rate
      default:
        return 0.5;
    }
  };

  const getWinMultiplier = () => {
    switch (game.difficulty) {
      case "Easy":
        return 1.5; // 1.5x multiplier
      case "Medium":
        return 2.0; // 2x multiplier
      case "Hard":
        return 3.0; // 3x multiplier
      case "Extreme":
        return 8.0; // 8x multiplier
      default:
        return 2.0;
    }
  };

  const handleCloseDialog = () => {
    setGameResult(null);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-primary/20 hover:border-primary/40 transition-all duration-300 glow-border hover:shadow-2xl overflow-hidden">
          <CardContent className="p-6">
            {/* Game Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{game.emoji}</span>
                  <h3 className="text-lg font-bold text-foreground">
                    {game.name}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getDifficultyColor(game.difficulty)}`}
                >
                  {game.difficulty}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-lg font-bold text-neon-green">
                  {(getWinChance() * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Game Description */}
            <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">
              {game.description}
            </p>

            {/* Bet Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min="1"
                  max={getCurrentBalance()}
                  className="flex-1 bg-muted/50 border-primary/20"
                  placeholder="Bet amount"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBetAmount(Math.min(getCurrentBalance(), 50))
                  }
                  className="text-xs"
                >
                  Max
                </Button>
              </div>

              <Button
                onClick={playGame}
                disabled={isPlaying || !canAffordBet(betAmount)}
                className="w-full bg-gradient-to-r from-primary to-neon-blue hover:from-primary/80 hover:to-neon-blue/80 transition-all duration-300"
              >
                {isPlaying ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <span>🎰</span> Playing...
                  </motion.div>
                ) : (
                  `Play ${game.name}`
                )}
              </Button>
            </div>

            {/* Quick Multiplier Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                Win up to {getWinMultiplier()}x your bet!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Result Dialog */}
      <Dialog open={gameResult !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-card border-primary/20">
          <DialogTitle className="sr-only">Game Result</DialogTitle>
          <motion.div
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {gameResult?.type === "win" ? (
              <>
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-neon-green mb-2">
                  YOU WIN!
                </h2>
                <p className="text-xl text-neon-green">
                  +${gameResult.amount.toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-3xl font-bold text-neon-red mb-2">
                  YOU LOSE
                </h2>
                <p className="text-xl text-neon-red">
                  -${gameResult?.amount.toFixed(2)}
                </p>
              </>
            )}
            <Button
              onClick={handleCloseDialog}
              className="mt-6 bg-primary hover:bg-primary/80"
            >
              Play Again
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
