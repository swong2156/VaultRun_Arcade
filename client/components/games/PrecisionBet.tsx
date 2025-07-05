import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface PrecisionBetProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function PrecisionBet({
  betAmount,
  onGameComplete,
}: PrecisionBetProps) {
  const [gamePhase, setGamePhase] = useState<"aiming" | "spinning" | "result">(
    "aiming",
  );
  const [playerGuess, setPlayerGuess] = useState([50]); // Slider value
  const [targetMultiplier] = useState(
    Math.random() * 90 + 10, // Random between 10-100
  );
  const [currentMultiplier, setCurrentMultiplier] = useState(50);
  const [timeLeft, setTimeLeft] = useState(8);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (gamePhase === "aiming") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startSpinning();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === "spinning") {
      setIsSpinning(true);
      let duration = 0;
      const maxDuration = 3000; // 3 seconds of spinning

      const interval = setInterval(() => {
        duration += 50;

        // Gradually slow down the spinning toward the target
        const progress = duration / maxDuration;
        const speed = Math.max(0.1, 1 - progress); // Slow down over time

        setCurrentMultiplier((prev) => {
          if (progress > 0.8) {
            // In final 20%, move toward target
            const diff = targetMultiplier - prev;
            return prev + diff * 0.1;
          } else {
            // Random movement
            const change = (Math.random() - 0.5) * 20 * speed;
            return Math.max(0, Math.min(100, prev + change));
          }
        });

        if (duration >= maxDuration) {
          clearInterval(interval);
          setCurrentMultiplier(targetMultiplier);
          setIsSpinning(false);
          setGamePhase("result");

          setTimeout(() => {
            const difference = Math.abs(playerGuess[0] - targetMultiplier);
            let isWin = false;
            let multiplier = 0;

            if (difference <= 2) {
              isWin = true;
              multiplier = 8; // Perfect precision
            } else if (difference <= 5) {
              isWin = true;
              multiplier = 5; // Very close
            } else if (difference <= 10) {
              isWin = true;
              multiplier = 3; // Close enough
            }

            onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
          }, 1500);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gamePhase, targetMultiplier, playerGuess, betAmount, onGameComplete]);

  const startSpinning = () => {
    setGamePhase("spinning");
  };

  const lockInGuess = () => {
    startSpinning();
  };

  const getDifference = () => {
    return Math.abs(playerGuess[0] - targetMultiplier);
  };

  const getAccuracyColor = (difference: number) => {
    if (difference <= 2) return "text-green-400";
    if (difference <= 5) return "text-yellow-400";
    if (difference <= 10) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-blue">
          🎯 Precision Bet
        </h2>

        {gamePhase === "aiming" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Guess where the multiplier will stop!
            </p>

            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-lg text-neon-orange font-bold">
                ⏰ {timeLeft}s to aim!
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Guess</p>
                <p className="text-3xl font-bold text-neon-blue">
                  {playerGuess[0].toFixed(1)}x
                </p>
              </div>

              <div className="px-4">
                <Slider
                  value={playerGuess}
                  onValueChange={setPlayerGuess}
                  max={100}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0x</span>
                  <span>50x</span>
                  <span>100x</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Precision Rewards:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 ±2.0: 8x multiplier</p>
                <p>🎯 ±5.0: 5x multiplier</p>
                <p>🎯 ±10.0: 3x multiplier</p>
                <p>❌ &gt;10.0: No reward</p>
              </div>
            </div>

            <Button
              onClick={lockInGuess}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white"
              size="lg"
            >
              🔒 LOCK IN GUESS
            </Button>
          </div>
        )}

        {gamePhase === "spinning" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your guess: <span className="font-bold">{playerGuess[0]}x</span>
            </p>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Current Multiplier
                </p>
                <motion.p
                  className="text-4xl font-bold text-neon-orange"
                  animate={
                    isSpinning
                      ? {
                          scale: [1, 1.1, 1],
                          color: [
                            "#f97316",
                            "#ea580c",
                            "#dc2626",
                            "#ea580c",
                            "#f97316",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  {currentMultiplier.toFixed(1)}x
                </motion.p>
              </div>

              {/* Visual multiplier gauge */}
              <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-green via-neon-yellow to-neon-red transition-all duration-100"
                  style={{ width: `${currentMultiplier}%` }}
                />
                {/* Player guess marker */}
                <div
                  className="absolute top-0 w-1 h-full bg-white border border-black"
                  style={{ left: `${playerGuess[0]}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0x</span>
                <span>50x</span>
                <span>100x</span>
              </div>
            </div>

            <motion.p
              className="text-lg font-cyber neon-yellow"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              Multiplier spinning...
            </motion.p>
          </div>
        )}

        {gamePhase === "result" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-6xl">
                {getDifference() <= 10 ? "🎯" : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  getDifference() <= 10 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {getDifference() <= 2
                  ? "PERFECT SHOT!"
                  : getDifference() <= 5
                    ? "GREAT AIM!"
                    : getDifference() <= 10
                      ? "CLOSE ENOUGH!"
                      : "MISSED TARGET!"}
              </h3>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Precision Results:</p>
                <div className="space-y-1">
                  <p>
                    🎯 Your Guess:{" "}
                    <span className="font-bold">{playerGuess[0]}x</span>
                  </p>
                  <p>
                    🎪 Actual Result:{" "}
                    <span className="font-bold text-neon-orange">
                      {targetMultiplier.toFixed(1)}x
                    </span>
                  </p>
                  <p>
                    📏 Difference:{" "}
                    <span
                      className={`font-bold ${getAccuracyColor(getDifference())}`}
                    >
                      ±{getDifference().toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>

              {getDifference() <= 10 && (
                <div>
                  <p className="text-lg text-neon-green">
                    {getDifference() <= 2
                      ? "8x"
                      : getDifference() <= 5
                        ? "5x"
                        : "3x"}{" "}
                    Precision Multiplier!
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (getDifference() <= 2 ? 8 : getDifference() <= 5 ? 5 : 3)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-300">
                    {getDifference() <= 2
                      ? "🏹 Legendary precision!"
                      : getDifference() <= 5
                        ? "🎯 Sharp shooter!"
                        : "👍 Good enough!"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
