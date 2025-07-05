import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CrashGameProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function CrashGame({
  betAmount,
  onGameComplete,
}: CrashGameProps) {
  const [multiplier, setMultiplier] = useState(1.0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint] = useState(1.5 + Math.random() * 8.5); // Random crash between 1.5x and 10x

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMultiplier((prev) => {
        const newMultiplier = prev + 0.01;

        if (newMultiplier >= crashPoint) {
          setHasCrashed(true);
          setIsRunning(false);
          if (!cashedOut) {
            setTimeout(() => onGameComplete(false), 1000);
          }
          return crashPoint;
        }

        return newMultiplier;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, crashPoint, cashedOut, onGameComplete]);

  const startGame = () => {
    setHasStarted(true);
    setIsRunning(true);
    setMultiplier(1.0);
  };

  const cashOut = () => {
    if (!isRunning || hasCrashed || cashedOut) return;

    setCashedOut(true);
    setIsRunning(false);

    const winAmount = betAmount * multiplier;
    setTimeout(() => onGameComplete(true, winAmount), 500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-red">
          💥 Crash Game
        </h2>

        {!hasStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Cash out before it crashes!
            </p>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
              size="lg"
            >
              🚀 Start Game
            </Button>
          </div>
        )}

        {hasStarted && (
          <div className="space-y-6">
            <motion.div
              className="text-center"
              animate={hasCrashed ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`text-6xl font-bold font-cyber ${
                  hasCrashed ? "text-neon-red animate-pulse" : "text-neon-green"
                }`}
              >
                {multiplier.toFixed(2)}x
              </div>

              {hasCrashed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl mt-4"
                >
                  💥 CRASHED!
                </motion.div>
              ) : (
                <div className="text-lg text-muted-foreground mt-2">
                  Multiplier rising...
                </div>
              )}
            </motion.div>

            {isRunning && !hasCrashed && !cashedOut && (
              <Button
                onClick={cashOut}
                className="bg-gradient-to-r from-neon-yellow to-neon-orange text-black font-bold"
                size="lg"
              >
                💰 Cash Out: ${(betAmount * multiplier).toFixed(2)}
              </Button>
            )}

            {cashedOut && !hasCrashed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <div className="text-2xl text-neon-green font-bold">
                  🎉 Cashed Out!
                </div>
                <div className="text-lg text-neon-green">
                  Won: ${(betAmount * multiplier).toFixed(2)}
                </div>
              </motion.div>
            )}

            {hasCrashed && cashedOut && (
              <div className="text-lg text-neon-green">
                Lucky escape! You cashed out in time.
              </div>
            )}

            {hasCrashed && !cashedOut && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <div className="text-2xl text-neon-red font-bold">
                  😔 You Lost!
                </div>
                <div className="text-lg text-muted-foreground">
                  Crashed at {crashPoint.toFixed(2)}x
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
