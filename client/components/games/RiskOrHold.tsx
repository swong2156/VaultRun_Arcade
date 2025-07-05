import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RiskOrHoldProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function RiskOrHold({
  betAmount,
  onGameComplete,
}: RiskOrHoldProps) {
  const [gamePhase, setGamePhase] = useState<
    "start" | "round1" | "round2" | "round3" | "final"
  >("start");
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  const multipliers = [1.5, 2.0, 3.0, 5.0]; // Progressive multipliers
  const riskChances = [0.7, 0.6, 0.5, 0.4]; // Decreasing win chances

  const startGame = () => {
    setCurrentWinnings(betAmount * multipliers[0]);
    setTotalRounds(1);
    setGamePhase("round1");
  };

  const holdWinnings = () => {
    onGameComplete(true, currentWinnings);
  };

  const riskWinnings = () => {
    const currentRound = totalRounds;
    const winChance = riskChances[currentRound];

    if (Math.random() < winChance) {
      // Win - advance to next round
      const newWinnings = betAmount * multipliers[currentRound];
      setCurrentWinnings(newWinnings);
      setTotalRounds(currentRound + 1);

      if (currentRound >= 3) {
        // Final round completed
        setGamePhase("final");
        setTimeout(() => onGameComplete(true, newWinnings), 2000);
      } else {
        setGamePhase(["round1", "round2", "round3"][currentRound] as any);
      }
    } else {
      // Lose everything
      setGamePhase("final");
      setTimeout(() => onGameComplete(false), 2000);
    }
  };

  const getCurrentMultiplier = () => {
    return multipliers[totalRounds - 1] || 1;
  };

  const getNextMultiplier = () => {
    return multipliers[totalRounds] || multipliers[multipliers.length - 1];
  };

  const getCurrentWinChance = () => {
    return (riskChances[totalRounds] * 100).toFixed(0);
  };

  const getRoundName = () => {
    const names = ["First", "Second", "Third", "Final"];
    return names[totalRounds - 1] || "Final";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-orange">
          💼 Risk or Hold
        </h2>

        {gamePhase === "start" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Progressive risk game! Each round doubles your winnings but
              increases the risk.
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Round Structure:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 Round 1: 1.5x (70% chance)</p>
                <p>🎯 Round 2: 2.0x (60% chance)</p>
                <p>🎯 Round 3: 3.0x (50% chance)</p>
                <p>🎯 Round 4: 5.0x (40% chance)</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-orange to-neon-red text-white"
              size="lg"
            >
              💰 START CLIMBING
            </Button>
          </div>
        )}

        {(gamePhase === "round1" ||
          gamePhase === "round2" ||
          gamePhase === "round3") && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/50">
              <h3 className="text-xl font-bold text-green-400 mb-2">
                {getRoundName()} Round Complete! 🎉
              </h3>
              <p className="text-2xl font-bold text-green-300">
                Current Winnings: ${currentWinnings.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getCurrentMultiplier()}x Multiplier Applied
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                You can cash out now or risk it for more!
              </p>

              {totalRounds < 4 && (
                <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-500/50">
                  <p className="text-sm text-yellow-300">
                    Next round: {getNextMultiplier()}x multiplier
                  </p>
                  <p className="text-sm text-yellow-300">
                    Win chance: {getCurrentWinChance()}%
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">
                    Risk: Lose everything if you fail
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={holdWinnings}
                className="bg-gradient-to-r from-green-600 to-green-800 text-white"
                size="lg"
              >
                💰 HOLD
                <br />
                <span className="text-sm">${currentWinnings.toFixed(2)}</span>
              </Button>

              {totalRounds < 4 && (
                <Button
                  onClick={riskWinnings}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white"
                  size="lg"
                >
                  🎲 RISK
                  <br />
                  <span className="text-sm">
                    {getCurrentWinChance()}% chance
                  </span>
                </Button>
              )}
            </div>

            {totalRounds >= 4 && (
              <p className="text-lg text-neon-green font-bold">
                🏆 Maximum multiplier reached! Cash out your winnings!
              </p>
            )}
          </div>
        )}

        {gamePhase === "final" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-6xl">
                {currentWinnings > 0 ? "🏆" : "💥"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  currentWinnings > 0 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {currentWinnings > 0
                  ? "SUCCESSFUL CASH OUT!"
                  : "RISK DIDN'T PAY OFF!"}
              </h3>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Game Summary:</p>
                <div className="space-y-1">
                  <p>
                    🎯 Rounds Completed:{" "}
                    <span className="font-bold">{totalRounds}</span>
                  </p>
                  <p>
                    💰 Final Amount:{" "}
                    <span
                      className={`font-bold ${
                        currentWinnings > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${currentWinnings.toFixed(2)}
                    </span>
                  </p>
                  {currentWinnings > 0 && (
                    <p>
                      📈 Total Multiplier:{" "}
                      <span className="font-bold text-blue-400">
                        {getCurrentMultiplier()}x
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {currentWinnings === 0 && (
                <p className="text-sm text-red-300">
                  Sometimes the safe play is the smart play! 🤔
                </p>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
