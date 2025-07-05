import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BlockBreakProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

interface Block {
  id: number;
  x: number;
  y: number;
  color: string;
  destroyed: boolean;
}

export default function BlockBreak({
  betAmount,
  onGameComplete,
}: BlockBreakProps) {
  const [gamePhase, setGamePhase] = useState<"ready" | "playing" | "result">(
    "ready",
  );
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [blocksDestroyed, setBlocksDestroyed] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
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

      // Spawn blocks every 800ms
      const blockTimer = setInterval(() => {
        spawnBlock();
      }, 800);

      return () => {
        clearInterval(gameTimer);
        clearInterval(blockTimer);
      };
    }
  }, [gamePhase, gameEnded]);

  const spawnBlock = () => {
    if (gameEnded || !containerRef.current) return;

    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
    ];
    const container = containerRef.current.getBoundingClientRect();

    const newBlock: Block = {
      id: Date.now(),
      x: Math.random() * (container.width - 60), // Account for block size
      y: -60, // Start above visible area
      color: colors[Math.floor(Math.random() * colors.length)],
      destroyed: false,
    };

    setBlocks((prev) => [...prev, newBlock]);

    // Move block down
    setTimeout(() => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === newBlock.id ? { ...block, y: 320 } : block,
        ),
      );
    }, 50);

    // Remove block if it reaches bottom (player failed to destroy it)
    setTimeout(() => {
      setBlocks((prev) => {
        const blockStillExists = prev.find(
          (b) => b.id === newBlock.id && !b.destroyed,
        );
        if (blockStillExists) {
          // Block reached bottom without being destroyed - lose points
          setScore((s) => Math.max(0, s - 50));
        }
        return prev.filter((block) => block.id !== newBlock.id);
      });
    }, 2000);
  };

  const destroyBlock = (blockId: number) => {
    if (gameEnded) return;

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, destroyed: true } : block,
      ),
    );

    setBlocksDestroyed((prev) => prev + 1);
    setScore((prev) => prev + 100);

    // Remove destroyed block after animation
    setTimeout(() => {
      setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    }, 300);
  };

  const startGame = () => {
    setGamePhase("playing");
    setScore(0);
    setBlocksDestroyed(0);
    setBlocks([]);
    setGameEnded(false);
    setTimeLeft(10);
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    setTimeout(() => {
      // Win condition: destroy at least 8 blocks
      const isWin = blocksDestroyed >= 8;
      let multiplier = 0;

      if (blocksDestroyed >= 15)
        multiplier = 6; // Excellent
      else if (blocksDestroyed >= 12)
        multiplier = 4; // Great
      else if (blocksDestroyed >= 8) multiplier = 2.5; // Good enough

      onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
    }, 1500);
  };

  const getBlockColor = (color: string) => {
    switch (color) {
      case "bg-red-500":
        return "🔴";
      case "bg-blue-500":
        return "🔵";
      case "bg-green-500":
        return "🟢";
      case "bg-yellow-500":
        return "🟡";
      default:
        return "⬜";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-6">
        <h2 className="text-2xl font-gaming font-bold mb-4 text-center neon-red">
          🧱 Block Break
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Destroy falling blocks before they hit the bottom!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Mission:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 Destroy 8+ blocks to win</p>
                <p>⏰ 10 seconds total</p>
                <p>💰 15+ blocks: 6x multiplier</p>
                <p>💰 12+ blocks: 4x multiplier</p>
                <p>💰 8+ blocks: 2.5x multiplier</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-neon-red to-neon-orange text-white"
              size="lg"
            >
              🧱 START BREAKING
            </Button>
          </div>
        )}

        {gamePhase === "playing" && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-green font-bold">
                Destroyed: {blocksDestroyed}
              </span>
              <span className="text-neon-blue font-bold">Score: {score}</span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Game Area */}
            <div
              ref={containerRef}
              className="relative w-full h-80 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-primary/30 rounded-lg overflow-hidden"
            >
              {/* Falling Blocks */}
              {blocks.map((block) => (
                <motion.div
                  key={block.id}
                  className="absolute w-12 h-12 cursor-pointer"
                  style={{ left: block.x, top: 0 }}
                  initial={{ y: -60 }}
                  animate={{
                    y: block.destroyed ? block.y : block.y + 60,
                    scale: block.destroyed ? [1, 1.2, 0] : 1,
                    rotate: block.destroyed ? [0, 180, 360] : 0,
                  }}
                  transition={{
                    y: { duration: 2, ease: "linear" },
                    scale: { duration: 0.3 },
                    rotate: { duration: 0.3 },
                  }}
                  onClick={() => destroyBlock(block.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`w-full h-full ${block.color} rounded-lg border border-white/30 flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {block.destroyed ? "💥" : getBlockColor(block.color)}
                  </div>
                </motion.div>
              ))}

              {/* Target line */}
              <div className="absolute bottom-4 w-full border-t-2 border-dashed border-neon-red">
                <span className="text-xs text-neon-red bg-black/50 px-1 rounded">
                  DANGER ZONE
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-neon-yellow">
                {blocksDestroyed >= 8
                  ? "🎯 WIN ZONE!"
                  : `${8 - blocksDestroyed} more to win`}
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
            <div className="text-6xl">{blocksDestroyed >= 8 ? "🧱" : "😔"}</div>

            <h3
              className={`text-2xl font-bold ${
                blocksDestroyed >= 8 ? "text-neon-green" : "text-neon-red"
              }`}
            >
              {blocksDestroyed >= 8 ? "DEMOLITION EXPERT!" : "NOT ENOUGH!"}
            </h3>

            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-lg mb-2">Final Results:</p>
              <div className="space-y-1">
                <p>
                  🧱 Blocks Destroyed:{" "}
                  <span className="font-bold">{blocksDestroyed}</span>
                </p>
                <p>
                  📊 Final Score: <span className="font-bold">{score}</span>
                </p>
                <p>
                  🎯 Target: <span className="font-bold">8+ blocks</span>
                </p>
              </div>
            </div>

            {blocksDestroyed >= 8 && (
              <div>
                <p className="text-lg text-neon-green">
                  {blocksDestroyed >= 15
                    ? "6x"
                    : blocksDestroyed >= 12
                      ? "4x"
                      : "2.5x"}{" "}
                  Multiplier!
                </p>
                <p className="text-lg text-neon-green">
                  Won: $
                  {(
                    betAmount *
                    (blocksDestroyed >= 15
                      ? 6
                      : blocksDestroyed >= 12
                        ? 4
                        : 2.5)
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-green-300">
                  {blocksDestroyed >= 15
                    ? "🏆 Demolition Master!"
                    : blocksDestroyed >= 12
                      ? "💪 Block Breaker!"
                      : "👍 Good Job!"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
