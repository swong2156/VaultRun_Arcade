import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TapTargetProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  active: boolean;
  hit: boolean;
}

export default function TapTarget({
  betAmount,
  onGameComplete,
}: TapTargetProps) {
  const [gamePhase, setGamePhase] = useState<"ready" | "playing" | "result">(
    "ready",
  );
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8); // 8 seconds to hit targets
  const [targetsHit, setTargetsHit] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gamePhase === "playing") {
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

      // Spawn targets every 800ms
      const targetTimer = setInterval(() => {
        spawnTarget();
      }, 800);

      return () => {
        clearInterval(gameTimer);
        clearInterval(targetTimer);
      };
    }
  }, [gamePhase]);

  const spawnTarget = () => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const newTarget: Target = {
      id: Date.now(),
      x: Math.random() * (container.width - 60), // Account for target size
      y: Math.random() * (container.height - 60),
      active: true,
      hit: false,
    };

    setTargets((prev) => [...prev, newTarget]);

    // Remove target after 1.5 seconds if not hit
    setTimeout(() => {
      setTargets((prev) =>
        prev.map((t) => (t.id === newTarget.id ? { ...t, active: false } : t)),
      );
    }, 1500);
  };

  const hitTarget = (targetId: number) => {
    setTargets((prev) =>
      prev.map((t) =>
        t.id === targetId ? { ...t, hit: true, active: false } : t,
      ),
    );
    setTargetsHit((prev) => prev + 1);
    setScore((prev) => prev + 100);
  };

  const startGame = () => {
    setGamePhase("playing");
    setScore(0);
    setTargetsHit(0);
    setTargets([]);
    setTimeLeft(8);
  };

  const endGame = () => {
    setGamePhase("result");
    setTimeout(() => {
      // Win condition: hit at least 8 targets
      const isWin = targetsHit >= 8;
      let multiplier = 0;

      if (targetsHit >= 12)
        multiplier = 8; // Excellent
      else if (targetsHit >= 10)
        multiplier = 5; // Good
      else if (targetsHit >= 8) multiplier = 3; // Minimum win

      onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-gaming font-bold mb-4 text-center neon-orange">
          🎯 Tap Target
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Hit moving targets as fast as possible!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Scoring:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 12+ targets: 8x multiplier</p>
                <p>🎯 10+ targets: 5x multiplier</p>
                <p>🎯 8+ targets: 3x multiplier</p>
                <p>⏰ 8 seconds total</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-orange to-neon-red text-white"
              size="lg"
            >
              🎯 START CHALLENGE
            </Button>
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-green font-bold">
                Hits: {targetsHit}
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
              <span className="text-neon-blue font-bold">Score: {score}</span>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-primary/30 rounded-lg overflow-hidden"
            >
              {targets.map(
                (target) =>
                  target.active && (
                    <motion.div
                      key={target.id}
                      className="absolute w-12 h-12 cursor-pointer"
                      style={{ left: target.x, top: target.y }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => hitTarget(target.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-neon-red to-neon-orange rounded-full flex items-center justify-center text-white font-bold text-lg shadow-2xl">
                        🎯
                      </div>
                    </motion.div>
                  ),
              )}

              {targets
                .filter((t) => t.hit)
                .map((target) => (
                  <motion.div
                    key={`hit-${target.id}`}
                    className="absolute w-12 h-12 pointer-events-none"
                    style={{ left: target.x, top: target.y }}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full h-full text-2xl flex items-center justify-center">
                      ✅
                    </div>
                  </motion.div>
                ))}
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-neon-yellow">
                {targetsHit >= 8
                  ? "🎉 WIN ZONE!"
                  : `${8 - targetsHit} more to win`}
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
            <div className="text-6xl">{targetsHit >= 8 ? "🎯" : "😔"}</div>

            <h3
              className={`text-2xl font-bold ${
                targetsHit >= 8 ? "text-neon-green" : "text-neon-red"
              }`}
            >
              {targetsHit >= 8 ? "SHARPSHOOTER!" : "NEEDS PRACTICE!"}
            </h3>

            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-lg mb-2">Final Stats:</p>
              <div className="space-y-1">
                <p>
                  🎯 Targets Hit:{" "}
                  <span className="font-bold">{targetsHit}</span>
                </p>
                <p>
                  📊 Final Score: <span className="font-bold">{score}</span>
                </p>
                <p>
                  ⚡ Accuracy:{" "}
                  <span className="font-bold">
                    {((targetsHit / Math.max(targets.length, 1)) * 100).toFixed(
                      1,
                    )}
                    %
                  </span>
                </p>
              </div>
            </div>

            {targetsHit >= 8 && (
              <div>
                <p className="text-lg text-neon-green">
                  Multiplier:{" "}
                  {targetsHit >= 12 ? "8x" : targetsHit >= 10 ? "5x" : "3x"}
                </p>
                <p className="text-lg text-neon-green">
                  Won: $
                  {(
                    betAmount *
                    (targetsHit >= 12 ? 8 : targetsHit >= 10 ? 5 : 3)
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
