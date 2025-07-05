import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GuessMultiplierProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function GuessMultiplier({
  betAmount,
  onGameComplete,
}: GuessMultiplierProps) {
  const [gamePhase, setGamePhase] = useState<
    "guessing" | "spinning" | "result"
  >("guessing");
  const [playerGuess, setPlayerGuess] = useState("");
  const [targetMultiplier] = useState(1 + Math.random() * 9); // 1.0x to 10.0x
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (gamePhase === "guessing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (playerGuess) {
              startSpinning();
            } else {
              // Time's up without guess
              onGameComplete(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase, playerGuess, onGameComplete]);

  useEffect(() => {
    if (gamePhase === "spinning") {
      setIsSpinning(true);
      let duration = 0;
      const maxDuration = 4000; // 4 seconds of spinning

      const interval = setInterval(() => {
        duration += 100;

        setCurrentMultiplier((prev) => {
          const progress = duration / maxDuration;

          if (progress > 0.75) {
            // In final 25%, move toward target
            const diff = targetMultiplier - prev;
            return prev + diff * 0.2;
          } else {
            // Random spinning
            const speed = Math.max(0.1, 1 - progress * 0.5);
            const change = (Math.random() - 0.5) * 2 * speed;
            return Math.max(1, Math.min(10, prev + change));
          }
        });

        if (duration >= maxDuration) {
          clearInterval(interval);
          setCurrentMultiplier(targetMultiplier);
          setIsSpinning(false);
          setGamePhase("result");

          setTimeout(() => {
            const guess = parseFloat(playerGuess);
            const difference = Math.abs(guess - targetMultiplier);

            let isWin = false;
            let multiplier = 0;

            if (difference <= 0.1) {
              isWin = true;
              multiplier = 10; // Almost perfect
            } else if (difference <= 0.3) {
              isWin = true;
              multiplier = 6; // Very close
            } else if (difference <= 0.7) {
              isWin = true;
              multiplier = 3; // Close
            } else if (difference <= 1.5) {
              isWin = true;
              multiplier = 1.5; // Acceptable
            }

            onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
          }, 1500);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gamePhase, targetMultiplier, playerGuess, betAmount, onGameComplete]);

  const startSpinning = () => {
    setGamePhase("spinning");
  };

  const lockInGuess = () => {
    const guess = parseFloat(playerGuess);
    if (isNaN(guess) || guess < 1 || guess > 10) return;
    startSpinning();
  };

  const getDifference = () => {
    const guess = parseFloat(playerGuess);
    if (isNaN(guess)) return 0;
    return Math.abs(guess - targetMultiplier);
  };

  const getAccuracyLevel = (difference: number) => {
    if (difference <= 0.1) return { text: "Perfect!", color: "text-green-400" };
    if (difference <= 0.3)
      return { text: "Excellent!", color: "text-green-300" };
    if (difference <= 0.7) return { text: "Good!", color: "text-yellow-400" };
    if (difference <= 1.5) return { text: "Close", color: "text-orange-400" };
    return { text: "Way Off", color: "text-red-400" };
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-purple">
          🧮 Guess Multiplier
        </h2>

        {gamePhase === "guessing" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Guess the exact multiplier the wheel will land on!
            </p>

            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-lg text-neon-orange font-bold">
                ⏰ {timeLeft}s to guess!
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter multiplier (1.0 - 10.0)
                </p>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={playerGuess}
                  onChange={(e) => setPlayerGuess(e.target.value)}
                  placeholder="e.g., 5.7"
                  className="text-center text-xl font-bold"
                />
              </div>

              {playerGuess && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Your Guess</p>
                  <p className="text-3xl font-bold text-neon-purple">
                    {parseFloat(playerGuess).toFixed(1)}x
                  </p>
                </div>
              )}
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Precision Rewards:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 ±0.1: 10x multiplier</p>
                <p>🎯 ±0.3: 6x multiplier</p>
                <p>🎯 ±0.7: 3x multiplier</p>
                <p>🎯 ±1.5: 1.5x multiplier</p>
              </div>
            </div>

            <Button
              onClick={lockInGuess}
              disabled={!playerGuess}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white"
              size="lg"
            >
              🎲 SPIN THE WHEEL
            </Button>
          </div>
        )}

        {gamePhase === "spinning" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your guess:{" "}
              <span className="font-bold text-neon-purple">
                {parseFloat(playerGuess).toFixed(1)}x
              </span>
            </p>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Current Multiplier
                </p>
                <motion.p
                  className="text-5xl font-bold text-neon-orange"
                  animate={
                    isSpinning
                      ? {
                          scale: [1, 1.1, 1],
                          color: [
                            "#f97316",
                            "#ea580c",
                            "#dc2626",
                            "#7c3aed",
                            "#3b82f6",
                            "#f97316",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  {currentMultiplier.toFixed(1)}x
                </motion.p>
              </div>

              {/* Multiplier Range Visual */}
              <div className="relative w-full h-8 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full border">
                {/* Player guess marker */}
                <div
                  className="absolute top-0 w-1 h-full bg-white border border-black"
                  style={{
                    left: `${((parseFloat(playerGuess) - 1) / 9) * 100}%`,
                  }}
                />
                {/* Current position marker */}
                <motion.div
                  className="absolute top-0 w-2 h-full bg-black rounded"
                  style={{
                    left: `${((currentMultiplier - 1) / 9) * 100}%`,
                  }}
                  animate={isSpinning ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.2, repeat: Infinity }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1.0x</span>
                <span>5.5x</span>
                <span>10.0x</span>
              </div>
            </div>

            <motion.p
              className="text-lg font-cyber neon-yellow"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            >
              Wheel is spinning...
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
                {getDifference() <= 1.5 ? "🎯" : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  getDifference() <= 1.5 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {getAccuracyLevel(getDifference()).text}
              </h3>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Final Results:</p>
                <div className="space-y-1">
                  <p>
                    🎯 Your Guess:{" "}
                    <span className="font-bold text-neon-purple">
                      {parseFloat(playerGuess).toFixed(1)}x
                    </span>
                  </p>
                  <p>
                    🎲 Actual Result:{" "}
                    <span className="font-bold text-neon-orange">
                      {targetMultiplier.toFixed(1)}x
                    </span>
                  </p>
                  <p>
                    📏 Difference:{" "}
                    <span
                      className={`font-bold ${getAccuracyLevel(getDifference()).color}`}
                    >
                      ±{getDifference().toFixed(1)}
                    </span>
                  </p>
                </div>
              </div>

              {getDifference() <= 1.5 && (
                <div>
                  <p className="text-lg text-neon-green">
                    {getDifference() <= 0.1
                      ? "10x"
                      : getDifference() <= 0.3
                        ? "6x"
                        : getDifference() <= 0.7
                          ? "3x"
                          : "1.5x"}{" "}
                    Precision Multiplier!
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (getDifference() <= 0.1
                        ? 10
                        : getDifference() <= 0.3
                          ? 6
                          : getDifference() <= 0.7
                            ? 3
                            : 1.5)
                    ).toFixed(2)}
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
