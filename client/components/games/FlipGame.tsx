import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FlipGameProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function FlipGame({ betAmount, onGameComplete }: FlipGameProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<"heads" | "tails" | null>(
    null,
  );
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const playFlip = async (choice: "heads" | "tails") => {
    setPlayerChoice(choice);
    setGameStarted(true);
    setIsFlipping(true);

    // Simulate coin flip
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const flipResult = Math.random() > 0.5 ? "heads" : "tails";
    setResult(flipResult);
    setIsFlipping(false);

    // Check if player won
    const isWin = choice === flipResult;
    setTimeout(() => {
      onGameComplete(isWin, isWin ? betAmount * 1.8 : 0);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-green">
          ⚡ Coin Flip
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Choose heads or tails!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => playFlip("heads")}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                size="lg"
              >
                🪙 Heads
              </Button>
              <Button
                onClick={() => playFlip("tails")}
                className="flex-1 bg-gradient-to-r from-neon-orange to-neon-red text-white"
                size="lg"
              >
                🔶 Tails
              </Button>
            </div>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            <p className="text-lg">
              You chose:{" "}
              <span className="font-bold text-neon-blue">
                {playerChoice === "heads" ? "🪙 Heads" : "🔶 Tails"}
              </span>
            </p>

            <motion.div
              className="text-8xl mx-auto w-24 h-24 flex items-center justify-center"
              animate={
                isFlipping
                  ? {
                      rotateY: [0, 180, 360, 540, 720],
                      scale: [1, 1.2, 1, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {isFlipping ? "🪙" : result === "heads" ? "🪙" : "🔶"}
            </motion.div>

            {isFlipping && (
              <motion.p
                className="text-xl font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Flipping...
              </motion.p>
            )}

            {result && !isFlipping && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-xl mb-2">
                  Result:{" "}
                  <span className="font-bold">
                    {result === "heads" ? "🪙 Heads" : "🔶 Tails"}
                  </span>
                </p>
                <p
                  className={`text-2xl font-bold ${
                    playerChoice === result
                      ? "text-neon-green"
                      : "text-neon-red"
                  }`}
                >
                  {playerChoice === result ? "🎉 YOU WIN!" : "😔 YOU LOSE"}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
