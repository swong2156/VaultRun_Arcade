import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MiniJackpotProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function MiniJackpot({
  betAmount,
  onGameComplete,
}: MiniJackpotProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
  const [finalReels, setFinalReels] = useState<number[] | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const symbols = ["7️⃣", "💰", "🍒", "⭐", "💎", "🔔", "🍋", "🍊"];

  const spinSlots = async () => {
    setGameStarted(true);
    setIsSpinning(true);
    setFinalReels(null);

    // Generate final results
    const results = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
    ];

    // Animate spinning for 3 seconds
    const spinInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
      ]);
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(spinInterval);
    setReels(results);
    setFinalReels(results);
    setIsSpinning(false);

    // Calculate winnings
    setTimeout(() => {
      const [a, b, c] = results;
      let multiplier = 0;

      if (a === b && b === c) {
        // Three of a kind
        if (a === 0)
          multiplier = 50; // Three 7s
        else if (a === 1)
          multiplier = 25; // Three money bags
        else if (a === 4)
          multiplier = 20; // Three diamonds
        else multiplier = 15; // Other three of a kind
      } else if (a === b || b === c || a === c) {
        // Two of a kind
        multiplier = 3;
      }

      const isWin = multiplier > 0;
      onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-yellow">
          🎰 Mini Jackpot
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Match symbols to win the jackpot!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Payouts:</h3>
              <div className="text-sm space-y-1">
                <p>🎰 Three 7️⃣: 50x</p>
                <p>💰 Three 💰: 25x</p>
                <p>💎 Three 💎: 20x</p>
                <p>⭐ Any Three: 15x</p>
                <p>🎲 Two Match: 3x</p>
              </div>
            </div>

            <Button
              onClick={spinSlots}
              className="w-full bg-gradient-to-r from-neon-yellow to-neon-red text-black font-bold"
              size="lg"
            >
              🎰 SPIN THE SLOTS
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            {/* Slot Machine Display */}
            <div className="bg-black/80 rounded-lg p-6 border-4 border-yellow-400">
              <div className="flex justify-center gap-4">
                {reels.map((reel, index) => (
                  <motion.div
                    key={index}
                    className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-2 border-gray-300"
                    animate={
                      isSpinning
                        ? {
                            y: [0, -10, 0, 10, 0],
                            rotateX: [0, 180, 360],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.2,
                      repeat: isSpinning ? Infinity : 0,
                      delay: index * 0.1,
                    }}
                  >
                    {symbols[reel]}
                  </motion.div>
                ))}
              </div>

              {/* Spinning indicator */}
              <div className="flex justify-center mt-4 gap-2">
                {[0, 1, 2].map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                    animate={
                      isSpinning
                        ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: isSpinning ? Infinity : 0,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>

            {isSpinning && (
              <motion.p
                className="text-xl font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎰 Spinning the reels...
              </motion.p>
            )}

            {finalReels && !isSpinning && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="space-y-4">
                  {(() => {
                    const [a, b, c] = finalReels;
                    let result = "";
                    let multiplier = 0;

                    if (a === b && b === c) {
                      if (a === 0) {
                        result = "🎉 JACKPOT! Three 7s!";
                        multiplier = 50;
                      } else if (a === 1) {
                        result = "💰 BIG WIN! Three Money Bags!";
                        multiplier = 25;
                      } else if (a === 4) {
                        result = "💎 DIAMOND WIN! Three Diamonds!";
                        multiplier = 20;
                      } else {
                        result = "⭐ THREE OF A KIND!";
                        multiplier = 15;
                      }
                    } else if (a === b || b === c || a === c) {
                      result = "🎲 Two Match!";
                      multiplier = 3;
                    } else {
                      result = "😔 No Match";
                      multiplier = 0;
                    }

                    return (
                      <>
                        <div className="text-6xl">
                          {multiplier > 0 ? "🎰" : "😔"}
                        </div>
                        <h3
                          className={`text-xl font-bold ${
                            multiplier > 0 ? "text-neon-green" : "text-neon-red"
                          }`}
                        >
                          {result}
                        </h3>
                        {multiplier > 0 && (
                          <div>
                            <p className="text-lg text-neon-green">
                              {multiplier}x Multiplier!
                            </p>
                            <p className="text-lg text-neon-green">
                              Won: ${(betAmount * multiplier).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
