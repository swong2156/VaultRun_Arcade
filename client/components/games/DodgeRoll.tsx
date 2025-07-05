import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DodgeRollProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function DodgeRoll({
  betAmount,
  onGameComplete,
}: DodgeRollProps) {
  const [gamePhase, setGamePhase] = useState<"ready" | "playing" | "result">(
    "ready",
  );
  const [playerY, setPlayerY] = useState(150); // Middle of 300px height
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [gameEnded, setGameEnded] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Spawn obstacles every 1200ms
      const obstacleTimer = setInterval(() => {
        spawnObstacle();
      }, 1200);

      // Move obstacles and check collisions
      const moveTimer = setInterval(() => {
        setObstacles((prev) => {
          const newObstacles = prev
            .map((obstacle) => ({
              ...obstacle,
              x: obstacle.x - 4, // Move left
            }))
            .filter((obstacle) => obstacle.x > -obstacle.width);

          // Check collisions
          const playerHitbox = {
            x: 30,
            y: playerY,
            width: 30,
            height: 30,
          };

          for (const obstacle of newObstacles) {
            if (
              playerHitbox.x < obstacle.x + obstacle.width &&
              playerHitbox.x + playerHitbox.width > obstacle.x &&
              playerHitbox.y < obstacle.y + obstacle.height &&
              playerHitbox.y + playerHitbox.height > obstacle.y
            ) {
              setCrashed(true);
              setGameEnded(true);
              setTimeout(() => onGameComplete(false), 1500);
              return newObstacles;
            }
          }

          return newObstacles;
        });

        // Increase score for surviving
        if (!crashed) {
          setScore((prev) => prev + 10);
        }
      }, 50);

      return () => {
        clearInterval(gameTimer);
        clearInterval(obstacleTimer);
        clearInterval(moveTimer);
      };
    }
  }, [gamePhase, gameEnded, playerY, crashed, onGameComplete]);

  const spawnObstacle = () => {
    if (gameEnded || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const types = [
      { width: 30, height: 60 }, // Tall thin obstacle
      { width: 50, height: 30 }, // Wide short obstacle
      { width: 40, height: 40 }, // Square obstacle
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const maxY = container.height - type.height;

    const newObstacle: Obstacle = {
      id: Date.now(),
      x: container.width,
      y: Math.random() * maxY,
      width: type.width,
      height: type.height,
    };

    setObstacles((prev) => [...prev, newObstacle]);
  };

  const movePlayer = (direction: "up" | "down") => {
    if (gameEnded) return;

    setPlayerY((prev) => {
      const newY = direction === "up" ? prev - 40 : prev + 40;
      return Math.max(0, Math.min(270, newY)); // Keep within bounds
    });
  };

  const startGame = () => {
    setGamePhase("playing");
    setPlayerY(150);
    setObstacles([]);
    setScore(0);
    setGameEnded(false);
    setCrashed(false);
    setTimeLeft(12);
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    if (!crashed) {
      setTimeout(() => {
        // Win condition: survive the full time
        let multiplier = 0;
        if (score >= 2000)
          multiplier = 5; // Excellent
        else if (score >= 1500)
          multiplier = 3.5; // Great
        else if (score >= 1000) multiplier = 2.5; // Good

        const isWin = score >= 1000;
        onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
      }, 1500);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-gaming font-bold mb-4 text-center neon-green">
          🏃 Dodge Roll
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Navigate through obstacles! Survive 12 seconds to win!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Mission:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 Survive 12 seconds</p>
                <p>📊 Score 1000+ points to win</p>
                <p>💰 2000+ points: 5x multiplier</p>
                <p>💰 1500+ points: 3.5x multiplier</p>
                <p>💰 1000+ points: 2.5x multiplier</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-green to-neon-blue text-white"
              size="lg"
            >
              🏃 START DODGING
            </Button>
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-green font-bold">Score: {score}</span>
              <span className="text-neon-blue font-bold">
                Player: {Math.round(playerY)}
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full h-80 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-2 border-primary/30 rounded-lg overflow-hidden"
            >
              {/* Player */}
              <motion.div
                className="absolute w-8 h-8 left-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold z-10"
                animate={{ y: playerY }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                🏃
              </motion.div>

              {/* Obstacles */}
              {obstacles.map((obstacle) => (
                <div
                  key={obstacle.id}
                  className="absolute bg-red-500 border border-red-400"
                  style={{
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    🚧
                  </div>
                </div>
              ))}

              {/* Crash effect */}
              {crashed && (
                <motion.div
                  className="absolute inset-0 bg-red-500/50 flex items-center justify-center text-6xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  💥
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => movePlayer("up")}
                className="bg-gradient-to-r from-neon-blue to-blue-400 text-white"
                size="lg"
              >
                ⬆️ UP
              </Button>
              <Button
                onClick={() => movePlayer("down")}
                className="bg-gradient-to-r from-neon-orange to-orange-400 text-white"
                size="lg"
              >
                ⬇️ DOWN
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {score >= 1000
                  ? "🎯 Win zone reached!"
                  : `${1000 - score} points to win`}
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
            <div className="text-6xl">{crashed ? "💥" : "🏃"}</div>

            <h3
              className={`text-2xl font-bold ${
                !crashed && score >= 1000 ? "text-neon-green" : "text-neon-red"
              }`}
            >
              {crashed
                ? "CRASHED!"
                : score >= 1000
                  ? "SURVIVAL EXPERT!"
                  : "NOT ENOUGH!"}
            </h3>

            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-lg mb-2">Final Results:</p>
              <div className="space-y-1">
                <p>
                  📊 Final Score: <span className="font-bold">{score}</span>
                </p>
                <p>
                  ⏰ Time Survived:{" "}
                  <span className="font-bold">{12 - timeLeft}s</span>
                </p>
                <p>
                  🎯 Target: <span className="font-bold">1000+ points</span>
                </p>
                <p>
                  🏃 Status:{" "}
                  <span
                    className={`font-bold ${
                      crashed ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {crashed ? "Crashed" : "Survived"}
                  </span>
                </p>
              </div>
            </div>

            {!crashed && score >= 1000 && (
              <div>
                <p className="text-lg text-neon-green">
                  {score >= 2000 ? "5x" : score >= 1500 ? "3.5x" : "2.5x"}{" "}
                  Survival Multiplier!
                </p>
                <p className="text-lg text-neon-green">
                  Won: $
                  {(
                    betAmount * (score >= 2000 ? 5 : score >= 1500 ? 3.5 : 2.5)
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-green-300">
                  {score >= 2000
                    ? "🏆 Obstacle Master!"
                    : score >= 1500
                      ? "🥇 Great Dodger!"
                      : "👍 Good Survivor!"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
