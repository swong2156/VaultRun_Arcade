import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StackCoinsProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function StackCoins({
  betAmount,
  onGameComplete,
}: StackCoinsProps) {
  const [gamePhase, setGamePhase] = useState<"ready" | "playing" | "result">(
    "ready",
  );
  const [stackHeight, setStackHeight] = useState(0);
  const [targetHeight] = useState(15 + Math.random() * 10); // Target between 15-25
  const [timeLeft, setTimeLeft] = useState(12);
  const [coins, setCoins] = useState<Array<{ id: number; y: number }>>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gamePhase === "playing" && !gameEnded) {
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Drop coins periodically
      const coinTimer = setInterval(() => {
        dropCoin();
      }, 300); // New coin every 300ms

      intervalRef.current = coinTimer;

      return () => {
        clearInterval(gameTimer);
        clearInterval(coinTimer);
      };
    }
  }, [gamePhase, gameEnded]);

  const dropCoin = () => {
    if (gameEnded) return;

    const newCoin = {
      id: Date.now(),
      y: 0,
    };

    setCoins((prev) => [...prev, newCoin]);

    // Animate coin falling
    setTimeout(() => {
      setCoins((prev) =>
        prev.map((coin) =>
          coin.id === newCoin.id ? { ...coin, y: 300 } : coin,
        ),
      );
    }, 50);

    // Remove coin after animation
    setTimeout(() => {
      setCoins((prev) => prev.filter((coin) => coin.id !== newCoin.id));
    }, 1000);
  };

  const catchCoin = () => {
    if (gameEnded) return;

    setStackHeight((prev) => prev + 1);
    setCoins((prev) => prev.slice(0, -1)); // Remove the last coin

    // Check if target reached
    if (stackHeight + 1 >= targetHeight) {
      setGameEnded(true);
      setGamePhase("result");
      setTimeout(() => {
        onGameComplete(true, betAmount * 2.5); // 2.5x for skill
      }, 1500);
    }
  };

  const startGame = () => {
    setGamePhase("playing");
    setStackHeight(0);
    setCoins([]);
    setGameEnded(false);
    setTimeLeft(12);
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTimeout(() => {
      // Win if within 3 coins of target
      const isWin = Math.abs(stackHeight - targetHeight) <= 3;
      onGameComplete(isWin, isWin ? betAmount * 2 : 0);
    }, 1500);
  };

  const getStackProgress = () => {
    return Math.min((stackHeight / targetHeight) * 100, 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-gaming font-bold mb-4 text-center neon-yellow">
          🪙 Stack Coins
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Catch falling coins to build your stack!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Target:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 Stack {targetHeight.toFixed(0)} coins</p>
                <p>⏰ 12 seconds</p>
                <p>💰 Within ±3 coins = Win!</p>
                <p>🎯 Exact target = 2.5x bonus</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-yellow to-neon-orange text-black font-bold"
              size="lg"
            >
              🪙 START STACKING
            </Button>
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-green font-bold">
                Stack: {stackHeight}
              </span>
              <span className="text-neon-blue font-bold">
                Target: {targetHeight.toFixed(0)}
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-neon-yellow to-neon-orange h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStackProgress()}%` }}
              />
            </div>

            {/* Game Area */}
            <div className="relative w-full h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-primary/30 rounded-lg overflow-hidden">
              {/* Falling Coins */}
              {coins.map((coin) => (
                <motion.div
                  key={coin.id}
                  className="absolute w-8 h-8 text-2xl left-1/2 transform -translate-x-1/2"
                  initial={{ y: 0 }}
                  animate={{ y: coin.y }}
                  transition={{ duration: 1, ease: "linear" }}
                >
                  🪙
                </motion.div>
              ))}

              {/* Stack Display */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col-reverse items-center">
                  {Array.from({ length: stackHeight }).map((_, index) => (
                    <motion.div
                      key={index}
                      className="text-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      🪙
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Catch Button */}
              <div className="absolute bottom-4 w-full flex justify-center">
                <Button
                  onClick={catchCoin}
                  className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
                  size="lg"
                >
                  ⬇️ CATCH
                </Button>
              </div>

              {/* Target Line */}
              <div
                className="absolute w-full border-t-2 border-dashed border-neon-red left-0"
                style={{
                  bottom: `${20 + targetHeight * 8}px`, // Rough estimation
                }}
              >
                <span className="text-xs text-neon-red bg-black/50 px-1 rounded">
                  TARGET
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {Math.abs(stackHeight - targetHeight) <= 3
                  ? "🎯 In win zone!"
                  : `${Math.abs(stackHeight - targetHeight)} away from target`}
              </p>
            </div>
          </div>
        )}

        {gamePhase === "result" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl">
              {Math.abs(stackHeight - targetHeight) <= 3 ? "🎯" : "😔"}
            </div>

            <h3
              className={`text-2xl font-bold ${
                Math.abs(stackHeight - targetHeight) <= 3
                  ? "text-neon-green"
                  : "text-neon-red"
              }`}
            >
              {Math.abs(stackHeight - targetHeight) <= 3
                ? "GREAT STACKING!"
                : "MISSED TARGET!"}
            </h3>

            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-lg mb-2">Final Results:</p>
              <div className="space-y-1">
                <p>
                  🪙 Final Stack:{" "}
                  <span className="font-bold">{stackHeight}</span>
                </p>
                <p>
                  🎯 Target:{" "}
                  <span className="font-bold">{targetHeight.toFixed(0)}</span>
                </p>
                <p>
                  📏 Difference:{" "}
                  <span className="font-bold">
                    {Math.abs(stackHeight - targetHeight).toFixed(0)}
                  </span>
                </p>
              </div>
            </div>

            {Math.abs(stackHeight - targetHeight) <= 3 && (
              <div>
                <p className="text-lg text-neon-green">
                  {stackHeight === Math.floor(targetHeight) ? "2.5x" : "2x"}{" "}
                  Multiplier!
                </p>
                <p className="text-lg text-neon-green">
                  Won: $
                  {(
                    betAmount *
                    (stackHeight === Math.floor(targetHeight) ? 2.5 : 2)
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
