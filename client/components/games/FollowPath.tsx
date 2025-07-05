import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FollowPathProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

interface PathPoint {
  x: number;
  y: number;
  id: number;
  completed: boolean;
}

export default function FollowPath({
  betAmount,
  onGameComplete,
}: FollowPathProps) {
  const [gamePhase, setGamePhase] = useState<
    "ready" | "memorize" | "tracing" | "result"
  >("ready");
  const [pathPoints, setPathPoints] = useState<PathPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [accuracy, setAccuracy] = useState(100);
  const [gameEnded, setGameEnded] = useState(false);
  const [showPath, setShowPath] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random path on component mount
    generatePath();
  }, []);

  useEffect(() => {
    if (gamePhase === "memorize") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startTracing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (gamePhase === "tracing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase]);

  const generatePath = () => {
    if (!containerRef.current) return;

    const points: PathPoint[] = [];
    const numPoints = 6; // 6 points to trace
    const container = containerRef.current.getBoundingClientRect();

    for (let i = 0; i < numPoints; i++) {
      points.push({
        id: i,
        x: 50 + (i * (container.width - 100)) / (numPoints - 1),
        y: 50 + Math.random() * (container.height - 100),
        completed: false,
      });
    }

    setPathPoints(points);
  };

  const startGame = () => {
    setGamePhase("memorize");
    setCurrentPoint(0);
    setAccuracy(100);
    setGameEnded(false);
    setShowPath(true);
    setTimeLeft(5); // 5 seconds to memorize
    generatePath();
  };

  const startTracing = () => {
    setGamePhase("tracing");
    setShowPath(false);
    setTimeLeft(8); // 8 seconds to trace
  };

  const handlePointClick = (pointId: number) => {
    if (gameEnded || gamePhase !== "tracing") return;

    if (pointId === currentPoint) {
      // Correct point clicked
      setPathPoints((prev) =>
        prev.map((point) =>
          point.id === pointId ? { ...point, completed: true } : point,
        ),
      );
      setCurrentPoint((prev) => prev + 1);

      // Check if all points completed
      if (currentPoint === pathPoints.length - 1) {
        setGameEnded(true);
        setGamePhase("result");
        setTimeout(() => {
          const multiplier = accuracy > 90 ? 4 : accuracy > 70 ? 3 : 2;
          onGameComplete(true, betAmount * multiplier);
        }, 1500);
      }
    } else {
      // Wrong point clicked
      setAccuracy((prev) => Math.max(0, prev - 20));
      if (accuracy <= 20) {
        // Too many mistakes
        setGameEnded(true);
        setGamePhase("result");
        setTimeout(() => onGameComplete(false), 1500);
      }
    }
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    setTimeout(() => {
      // Partial completion based on progress
      const completion = (currentPoint / pathPoints.length) * 100;
      if (completion >= 80) {
        const multiplier = accuracy > 90 ? 3.5 : accuracy > 70 ? 2.5 : 1.8;
        onGameComplete(true, betAmount * multiplier);
      } else {
        onGameComplete(false);
      }
    }, 1500);
  };

  const getPointColor = (point: PathPoint, index: number) => {
    if (point.completed) return "bg-green-500 border-green-400";
    if (index === currentPoint && gamePhase === "tracing")
      return "bg-yellow-500 border-yellow-400 animate-pulse";
    if (showPath) return "bg-blue-500 border-blue-400";
    return "bg-gray-600 border-gray-500";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-gaming font-bold mb-4 text-center neon-purple">
          🧭 Follow Path
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Memorize the glowing path, then trace it in order!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Game Rules:</h3>
              <div className="text-sm space-y-1">
                <p>👁️ 5s to memorize the path</p>
                <p>✋ 8s to trace it correctly</p>
                <p>🎯 Click points in order</p>
                <p>💰 High accuracy = better rewards</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-purple to-neon-pink text-white"
              size="lg"
            >
              🧭 START MEMORIZING
            </Button>
          </div>
        )}

        {(gamePhase === "memorize" || gamePhase === "tracing") && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-blue font-bold">
                Point: {currentPoint + 1}/{pathPoints.length}
              </span>
              <span className="text-neon-green font-bold">
                Accuracy: {accuracy}%
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Phase indicator */}
            <div className="text-center">
              <p className="text-lg font-bold">
                {gamePhase === "memorize" ? (
                  <span className="text-neon-blue">📖 MEMORIZE THE PATH</span>
                ) : (
                  <span className="text-neon-yellow">✋ TRACE THE PATH</span>
                )}
              </p>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-primary/30 rounded-lg overflow-hidden"
            >
              {/* Path lines (only show during memorize phase) */}
              {showPath && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {pathPoints.map((point, index) => {
                    if (index === pathPoints.length - 1) return null;
                    const nextPoint = pathPoints[index + 1];
                    return (
                      <motion.line
                        key={`line-${index}`}
                        x1={point.x}
                        y1={point.y}
                        x2={nextPoint.x}
                        y2={nextPoint.y}
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: index * 0.3, duration: 0.5 }}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Path Points */}
              {pathPoints.map((point, index) => (
                <motion.div
                  key={point.id}
                  className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center text-white font-bold text-sm ${getPointColor(
                    point,
                    index,
                  )}`}
                  style={{
                    left: point.x - 16,
                    top: point.y - 16,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePointClick(point.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {point.completed ? "✓" : index + 1}
                </motion.div>
              ))}

              {/* Current target indicator */}
              {gamePhase === "tracing" && currentPoint < pathPoints.length && (
                <motion.div
                  className="absolute w-12 h-12 border-4 border-yellow-400 rounded-full pointer-events-none"
                  style={{
                    left: pathPoints[currentPoint].x - 24,
                    top: pathPoints[currentPoint].y - 24,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {gamePhase === "memorize"
                  ? "Study the path carefully!"
                  : currentPoint < pathPoints.length
                    ? `Click point ${currentPoint + 1}`
                    : "Path complete!"}
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
              {currentPoint === pathPoints.length ? "🧭" : "😔"}
            </div>

            <h3
              className={`text-2xl font-bold ${
                currentPoint === pathPoints.length
                  ? "text-neon-green"
                  : "text-neon-red"
              }`}
            >
              {currentPoint === pathPoints.length
                ? "PATH MASTER!"
                : "PATH LOST!"}
            </h3>

            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-lg mb-2">Navigation Results:</p>
              <div className="space-y-1">
                <p>
                  🧭 Points Traced:{" "}
                  <span className="font-bold">
                    {currentPoint}/{pathPoints.length}
                  </span>
                </p>
                <p>
                  📊 Completion:{" "}
                  <span className="font-bold">
                    {Math.round((currentPoint / pathPoints.length) * 100)}%
                  </span>
                </p>
                <p>
                  🎯 Accuracy: <span className="font-bold">{accuracy}%</span>
                </p>
              </div>
            </div>

            {(currentPoint === pathPoints.length ||
              (currentPoint / pathPoints.length) * 100 >= 80) && (
              <div>
                <p className="text-lg text-neon-green">
                  {currentPoint === pathPoints.length && accuracy > 90
                    ? "4x"
                    : currentPoint === pathPoints.length && accuracy > 70
                      ? "3x"
                      : currentPoint === pathPoints.length
                        ? "2x"
                        : accuracy > 90
                          ? "3.5x"
                          : accuracy > 70
                            ? "2.5x"
                            : "1.8x"}{" "}
                  Navigation Multiplier!
                </p>
                <p className="text-lg text-neon-green">
                  Won: $
                  {(
                    betAmount *
                    (currentPoint === pathPoints.length && accuracy > 90
                      ? 4
                      : currentPoint === pathPoints.length && accuracy > 70
                        ? 3
                        : currentPoint === pathPoints.length
                          ? 2
                          : accuracy > 90
                            ? 3.5
                            : accuracy > 70
                              ? 2.5
                              : 1.8)
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-green-300">
                  {currentPoint === pathPoints.length && accuracy > 90
                    ? "🧭 Master Navigator!"
                    : currentPoint === pathPoints.length
                      ? "🗺️ Path Completed!"
                      : "👍 Good Progress!"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
