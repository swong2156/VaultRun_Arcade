import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimeBombProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function TimeBomb({ betAmount, onGameComplete }: TimeBombProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [defuseTime, setDefuseTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.01;
        if (newTime <= 0) {
          setIsActive(false);
          setGameOver(true);
          // Exploded - lose
          setTimeout(() => onGameComplete(false), 1000);
          return 0;
        }
        return newTime;
      });
    }, 10); // Very fast updates for precision

    return () => clearInterval(interval);
  }, [isActive, onGameComplete]);

  const startBomb = () => {
    setHasStarted(true);
    setIsActive(true);
    startTimeRef.current = Date.now();
  };

  const defuseBomb = () => {
    if (!isActive || gameOver) return;

    const endTime = Date.now();
    const actualDefuseTime = (endTime - startTimeRef.current) / 1000;
    setDefuseTime(actualDefuseTime);
    setIsActive(false);
    setGameOver(true);

    // Win condition: defuse between 4.5-4.7 seconds (very narrow window)
    const targetTime = 4.6;
    const tolerance = 0.15; // ±0.15 seconds
    const isWin = Math.abs(actualDefuseTime - targetTime) <= tolerance;

    setTimeout(() => {
      onGameComplete(isWin, isWin ? betAmount * 8 : 0); // High payout for precision
    }, 1000);
  };

  const getTimerColor = () => {
    if (timeLeft > 3) return "text-neon-green";
    if (timeLeft > 1.5) return "text-neon-yellow";
    return "text-neon-red";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-red">
          💣 Time Bomb
        </h2>

        {!hasStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Defuse the bomb at exactly 4.6 seconds!
            </p>
            <p className="text-sm text-neon-orange">
              ⚠️ Precision timing required: ±0.15s window
            </p>
            <Button
              onClick={startBomb}
              className="bg-gradient-to-r from-neon-red to-neon-orange text-white"
              size="lg"
            >
              💣 Start Bomb
            </Button>
          </div>
        )}

        {hasStarted && !gameOver && (
          <div className="space-y-6">
            <motion.div
              className="text-8xl"
              animate={{
                scale: timeLeft < 2 ? [1, 1.2, 1] : [1],
                rotate: timeLeft < 1 ? [0, 5, -5, 0] : [0],
              }}
              transition={{
                duration: 0.2,
                repeat: timeLeft < 2 ? Infinity : 0,
              }}
            >
              💣
            </motion.div>

            <div className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
              {timeLeft.toFixed(2)}s
            </div>

            <Button
              onClick={defuseBomb}
              className="bg-gradient-to-r from-neon-blue to-neon-green text-white"
              size="lg"
            >
              ✂️ DEFUSE NOW!
            </Button>

            <div className="text-sm text-muted-foreground">
              Target: 4.60s (±0.15s)
            </div>
          </div>
        )}

        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {timeLeft <= 0 ? (
              <div className="space-y-4">
                <div className="text-6xl">💥</div>
                <h3 className="text-2xl font-bold text-neon-red">BOOM!</h3>
                <p className="text-lg text-neon-red">The bomb exploded!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">
                  {Math.abs(defuseTime! - 4.6) <= 0.15 ? "🎉" : "😔"}
                </div>
                <h3
                  className={`text-2xl font-bold ${
                    Math.abs(defuseTime! - 4.6) <= 0.15
                      ? "text-neon-green"
                      : "text-neon-red"
                  }`}
                >
                  {Math.abs(defuseTime! - 4.6) <= 0.15
                    ? "DEFUSED!"
                    : "TOO EARLY/LATE"}
                </h3>
                <p className="text-lg">
                  Your time:{" "}
                  <span className="font-bold">{defuseTime!.toFixed(2)}s</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Target: 4.60s ± 0.15s
                </p>
                {Math.abs(defuseTime! - 4.6) <= 0.15 && (
                  <p className="text-lg text-neon-green">
                    Won: ${(betAmount * 8).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
