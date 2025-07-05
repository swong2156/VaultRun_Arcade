import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Game } from "@/components/games/gamesList";
import FlipGame from "@/components/games/FlipGame";
import CrashGame from "@/components/games/CrashGame";
import DiceGame from "@/components/games/DiceGame";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import TimeBomb from "@/components/games/TimeBomb";
import QuickTap from "@/components/games/QuickTap";
import PredictionMarket from "@/components/games/PredictionMarket";
import ColorBlast from "@/components/games/ColorBlast";
import UnlockVault from "@/components/games/UnlockVault";
import MiniJackpot from "@/components/games/MiniJackpot";
import OddOrEven from "@/components/games/OddOrEven";
import SuddenDeath from "@/components/games/SuddenDeath";
import SpyFlip from "@/components/games/SpyFlip";
import TapTarget from "@/components/games/TapTarget";

interface EnhancedGameCardProps {
  game: Game;
}

export default function EnhancedGameCard({ game }: EnhancedGameCardProps) {
  const {
    canAffordBet,
    placeBet,
    recordWin,
    recordLoss,
    getCurrentBalance,
    currentCurrency,
  } = useGame();
  const [betAmount, setBetAmount] = useState(10);
  const [showGameModal, setShowGameModal] = useState(false);

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

  const startGame = () => {
    if (!canAffordBet(betAmount)) {
      alert("Insufficient balance!");
      return;
    }

    // Deduct bet amount
    placeBet(betAmount, game.name);
    setShowGameModal(true);
  };

  const handleGameComplete = (isWin: boolean, winAmount: number = 0) => {
    if (isWin) {
      recordWin(betAmount, winAmount, game.name);
    } else {
      recordLoss(betAmount, game.name);
    }
    setShowGameModal(false);
  };

  const getWinChance = () => {
    switch (game.difficulty) {
      case "Easy":
        return 0.35; // Reduced from 60% to 35%
      case "Medium":
        return 0.25; // Reduced from 40% to 25%
      case "Hard":
        return 0.15; // Reduced from 25% to 15%
      case "Extreme":
        return 0.05; // Reduced from 10% to 5%
      default:
        return 0.25;
    }
  };

  const getWinMultiplier = () => {
    switch (game.difficulty) {
      case "Easy":
        return 2.5; // Increased to compensate for lower win rate
      case "Medium":
        return 3.5; // Increased to compensate for lower win rate
      case "Hard":
        return 6.0; // Increased to compensate for lower win rate
      case "Extreme":
        return 15.0; // Increased to compensate for lower win rate
      default:
        return 3.5;
    }
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

  const renderGameInterface = () => {
    switch (game.id) {
      case "flip-game":
        return (
          <FlipGame betAmount={betAmount} onGameComplete={handleGameComplete} />
        );
      case "crash":
        return (
          <CrashGame
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "dice-roll":
        return (
          <DiceGame betAmount={betAmount} onGameComplete={handleGameComplete} />
        );
      case "rock-paper-scissors":
        return (
          <RockPaperScissors
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "time-bomb":
        return (
          <TimeBomb betAmount={betAmount} onGameComplete={handleGameComplete} />
        );
      case "quick-tap":
        return (
          <QuickTap betAmount={betAmount} onGameComplete={handleGameComplete} />
        );
      case "prediction-market":
        return (
          <PredictionMarket
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "color-blast":
        return (
          <ColorBlast
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "unlock-vault":
        return (
          <UnlockVault
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "mini-jackpot":
        return (
          <MiniJackpot
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "odd-or-even":
        return (
          <OddOrEven
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "sudden-death":
        return (
          <SuddenDeath
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      case "spy-flip":
        return (
          <SpyFlip betAmount={betAmount} onGameComplete={handleGameComplete} />
        );
      case "tap-target":
        return (
          <TapTarget
            betAmount={betAmount}
            onGameComplete={handleGameComplete}
          />
        );
      default:
        // Generic game interface for games not yet implemented
        return (
          <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-gaming font-bold mb-6 neon-green">
                {game.emoji} {game.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Coming soon! This game is under development.
              </p>
              <Button
                onClick={() =>
                  handleGameComplete(Math.random() > 0.5, betAmount * 2)
                }
                className="bg-gradient-to-r from-primary to-neon-blue text-white"
                size="lg"
              >
                Play Demo
              </Button>
            </CardContent>
          </Card>
        );
    }
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
                  <span className="text-2xl animate-pulse-neon">
                    {game.emoji}
                  </span>
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
                    setBetAmount(Math.min(getCurrentBalance(), 100))
                  }
                  className="text-xs"
                >
                  Max
                </Button>
              </div>

              <Button
                onClick={startGame}
                disabled={!canAffordBet(betAmount)}
                className="w-full bg-gradient-to-r from-primary to-neon-blue hover:from-primary/80 hover:to-neon-blue/80 transition-all duration-300"
              >
                Play {game.name}
              </Button>
            </div>

            {/* Quick Multiplier Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                Win up to {getWinMultiplier()}x • Bet with{" "}
                {getCurrencyIcon(currentCurrency)}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Game Modal */}
      <Dialog open={showGameModal} onOpenChange={setShowGameModal}>
        <DialogContent className="bg-background/95 backdrop-blur border-primary/20 max-w-2xl">
          <DialogTitle className="sr-only">{game.name} Game</DialogTitle>
          <div className="p-4">{renderGameInterface()}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
