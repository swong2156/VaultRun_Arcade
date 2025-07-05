import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuickTapProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function QuickTap({ betAmount, onGameComplete }: QuickTapProps) {
  const [gameState, setGameState] = useState<
    "waiting" | "ready" | "go" | "success" | "fail"
  >("waiting");
  const [countdown, setCountdown] = useState(3);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [targetVisible, setTargetVisible] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameState === "ready") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startTargetSequence();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const startTargetSequence = () => {
    setGameState("go");

    // Random delay between 1-4 seconds before showing target
    const delay = 1000 + Math.random() * 3000;

    timeoutRef.current = setTimeout(() => {
      setTargetVisible(true);
      startTimeRef.current = Date.now();

      // Auto-fail after 400ms (very short window)
      timeoutRef.current = setTimeout(() => {
        if (targetVisible) {
          setGameState("fail");
          setTargetVisible(false);
          setTimeout(() => onGameComplete(false), 1000);
        }
      }, 400);
    }, delay);
  };

  const handleTap = () => {
    if (gameState === "go" && !targetVisible) {
      // Tapped too early
      clearTimeout(timeoutRef.current!);
      setGameState("fail");
      setTimeout(() => onGameComplete(false), 1000);
      return;
    }

    if (gameState === "go" && targetVisible) {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setTargetVisible(false);
      clearTimeout(timeoutRef.current!);

      // Win condition: react within 400ms
      if (reaction <= 400) {
        setGameState("success");
        // Higher multiplier for faster reactions
        const multiplier = reaction < 200 ? 6 : reaction < 300 ? 4 : 3;
        setTimeout(() => onGameComplete(true, betAmount * multiplier), 1000);
      } else {
        setGameState("fail");
        setTimeout(() => onGameComplete(false), 1000);
      }
    }
  };

  const startGame = () => {
    setGameState("ready");
    setCountdown(3);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-yellow">
          ⚡ QuickTap
        </h2>

        {gameState === "waiting" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Tap the green button as fast as possible!
            </p>
            <p className="text-sm text-neon-orange">
              ⚠️ You have only 400ms to react
            </p>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
              size="lg"
            >
              🚀 Start Challenge
            </Button>
          </div>
        )}

        {gameState === "ready" && (
          <div className="space-y-6">
            <p className="text-lg text-neon-yellow">Get ready...</p>
            <div className="text-6xl font-bold text-neon-orange">
              {countdown}
            </div>
          </div>
        )}

        {gameState === "go" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Wait for the green button...
            </p>

            <motion.div
              className="h-40 flex items-center justify-center"
              onClick={handleTap}
            >
              {targetVisible ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-32 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
                  style={{
                    boxShadow: "0 0 30px hsl(var(--neon-green))",
                  }}
                >
                  <span className="text-3xl font-bold text-white">TAP!</span>
                </motion.div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground">Wait...</span>
                </div>
              )}
            </motion.div>

            <p className="text-sm text-neon-red">
              Don't tap too early or you'll lose!
            </p>
          </div>
        )}

        {(gameState === "success" || gameState === "fail") && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-4">
              <div className="text-6xl">
                {gameState === "success" ? "🎉" : "😔"}
              </div>
              <h3
                className={`text-2xl font-bold ${
                  gameState === "success" ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {gameState === "success" ? "AMAZING!" : "TOO SLOW!"}
              </h3>
              {reactionTime && (
                <p className="text-lg">
                  Reaction time:{" "}
                  <span className="font-bold">{reactionTime}ms</span>
                </p>
              )}
              {gameState === "success" && reactionTime && (
                <div>
                  <p className="text-lg text-neon-green">
                    Multiplier:{" "}
                    {reactionTime < 200
                      ? "6x"
                      : reactionTime < 300
                        ? "4x"
                        : "3x"}
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (reactionTime < 200 ? 6 : reactionTime < 300 ? 4 : 3)
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
