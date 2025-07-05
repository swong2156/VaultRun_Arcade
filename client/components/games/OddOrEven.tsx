import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OddOrEvenProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function OddOrEven({
  betAmount,
  onGameComplete,
}: OddOrEvenProps) {
  const [prediction, setPrediction] = useState<"odd" | "even" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const playGame = async (choice: "odd" | "even") => {
    setPrediction(choice);
    setGameStarted(true);
    setIsGenerating(true);

    // Generate random number between 1-100
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setResult(randomNumber);
    setIsGenerating(false);

    // Check if prediction was correct
    const isOdd = randomNumber % 2 === 1;
    const isWin = (choice === "odd" && isOdd) || (choice === "even" && !isOdd);

    setTimeout(() => {
      onGameComplete(isWin, isWin ? betAmount * 1.8 : 0); // 1.8x for 50% odds
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-blue">
          🧮 Odd or Even
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Guess if the number will be odd or even!
            </p>
            <p className="text-sm text-muted-foreground">
              Numbers range from 1-100
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => playGame("odd")}
                className="bg-gradient-to-r from-neon-purple to-purple-400 text-white h-20 text-xl font-bold"
              >
                🔢 ODD
              </Button>
              <Button
                onClick={() => playGame("even")}
                className="bg-gradient-to-r from-neon-blue to-blue-400 text-white h-20 text-xl font-bold"
              >
                🔢 EVEN
              </Button>
            </div>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            <p className="text-lg">
              Your prediction:{" "}
              <span className="font-bold text-neon-blue text-xl">
                {prediction?.toUpperCase()}
              </span>
            </p>

            <motion.div
              className="text-8xl mx-auto w-32 h-32 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl border border-primary/30"
              animate={
                isGenerating
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: isGenerating ? Infinity : 0,
              }}
            >
              {isGenerating ? (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  🎲
                </motion.span>
              ) : result !== null ? (
                <span
                  className={`font-mono font-bold ${
                    result % 2 === 1 ? "text-neon-purple" : "text-neon-blue"
                  }`}
                >
                  {result}
                </span>
              ) : (
                "?"
              )}
            </motion.div>

            {isGenerating && (
              <motion.p
                className="text-xl font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Generating number...
              </motion.p>
            )}

            {result !== null && !isGenerating && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="space-y-4">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-xl mb-2">
                      Number:{" "}
                      <span className="font-bold text-2xl">{result}</span>
                    </p>
                    <p className="text-lg">
                      This number is:{" "}
                      <span
                        className={`font-bold ${
                          result % 2 === 1
                            ? "text-neon-purple"
                            : "text-neon-blue"
                        }`}
                      >
                        {result % 2 === 1 ? "ODD" : "EVEN"}
                      </span>
                    </p>
                  </div>

                  <div className="text-6xl">
                    {(prediction === "odd" && result % 2 === 1) ||
                    (prediction === "even" && result % 2 === 0)
                      ? "🎉"
                      : "😔"}
                  </div>

                  <h3
                    className={`text-2xl font-bold ${
                      (prediction === "odd" && result % 2 === 1) ||
                      (prediction === "even" && result % 2 === 0)
                        ? "text-neon-green"
                        : "text-neon-red"
                    }`}
                  >
                    {(prediction === "odd" && result % 2 === 1) ||
                    (prediction === "even" && result % 2 === 0)
                      ? "CORRECT!"
                      : "WRONG!"}
                  </h3>

                  {((prediction === "odd" && result % 2 === 1) ||
                    (prediction === "even" && result % 2 === 0)) && (
                    <div>
                      <p className="text-lg text-neon-green">
                        1.8x Multiplier!
                      </p>
                      <p className="text-lg text-neon-green">
                        Won: ${(betAmount * 1.8).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
