import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DiceGameProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function DiceGame({ betAmount, onGameComplete }: DiceGameProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const rollDice = async () => {
    if (selectedNumber === null) return;

    setGameStarted(true);
    setIsRolling(true);

    // Simulate dice roll
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const diceResult = Math.floor(Math.random() * 6) + 1;
    setResult(diceResult);
    setIsRolling(false);

    // Check if player won
    const isWin = selectedNumber === diceResult;
    setTimeout(() => {
      onGameComplete(isWin, isWin ? betAmount * 6 : 0);
    }, 1000);
  };

  const numbers = [1, 2, 3, 4, 5, 6];

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-blue">
          🎲 Dice Roll
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">Pick a number 1-6!</p>

            <div className="grid grid-cols-3 gap-3">
              {numbers.map((num) => (
                <Button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  variant={selectedNumber === num ? "default" : "outline"}
                  className={`aspect-square text-xl font-bold ${
                    selectedNumber === num
                      ? "bg-primary text-primary-foreground"
                      : "border-primary/20 hover:bg-primary/10"
                  }`}
                >
                  {num}
                </Button>
              ))}
            </div>

            <Button
              onClick={rollDice}
              disabled={selectedNumber === null}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white"
              size="lg"
            >
              🎲 Roll Dice
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            <p className="text-lg">
              You picked:{" "}
              <span className="font-bold text-neon-blue text-2xl">
                {selectedNumber}
              </span>
            </p>

            <motion.div
              className="text-8xl mx-auto w-24 h-24 flex items-center justify-center"
              animate={
                isRolling
                  ? {
                      rotate: [0, 90, 180, 270, 360],
                      scale: [1, 1.3, 1, 1.3, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              🎲
            </motion.div>

            {isRolling && (
              <motion.p
                className="text-xl font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Rolling the dice...
              </motion.p>
            )}

            {result && !isRolling && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-xl mb-2">
                  Dice shows:{" "}
                  <span className="font-bold text-2xl text-neon-orange">
                    {result}
                  </span>
                </p>
                <p
                  className={`text-2xl font-bold ${
                    selectedNumber === result
                      ? "text-neon-green"
                      : "text-neon-red"
                  }`}
                >
                  {selectedNumber === result ? "🎉 YOU WIN!" : "😔 TRY AGAIN"}
                </p>
                {selectedNumber === result && (
                  <p className="text-lg text-neon-green mt-2">
                    6x Multiplier! Won: ${(betAmount * 6).toFixed(2)}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
