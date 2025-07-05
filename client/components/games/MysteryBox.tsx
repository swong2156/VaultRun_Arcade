import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MysteryBoxProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function MysteryBox({
  betAmount,
  onGameComplete,
}: MysteryBoxProps) {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [winningBoxes] = useState(() => {
    // 2 out of 4 boxes contain prizes (50% chance)
    const boxes = [false, false, false, false];
    const winningIndices = [];
    while (winningIndices.length < 2) {
      const index = Math.floor(Math.random() * 4);
      if (!winningIndices.includes(index)) {
        winningIndices.push(index);
        boxes[index] = true;
      }
    }
    return boxes;
  });
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!revealed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (selectedBox !== null) {
              revealBoxes();
            } else {
              // Time's up without selection
              onGameComplete(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [revealed, selectedBox, onGameComplete]);

  const selectBox = (boxIndex: number) => {
    if (revealed) return;
    setSelectedBox(boxIndex);
  };

  const revealBoxes = () => {
    setRevealed(true);
    setTimeout(() => {
      const isWin = selectedBox !== null && winningBoxes[selectedBox];
      onGameComplete(isWin, isWin ? betAmount * 2 : 0); // 2x for 50% odds
    }, 2000);
  };

  const getBoxEmoji = (index: number) => {
    if (!revealed) return "📦";
    if (winningBoxes[index]) {
      return ["💎", "🏆", "💰", "🎁"][index];
    }
    return "📦";
  };

  const getBoxColor = (index: number) => {
    if (!revealed) {
      return selectedBox === index
        ? "border-primary bg-primary/20"
        : "border-gray-600 hover:border-primary/50";
    }
    if (index === selectedBox) {
      return winningBoxes[index]
        ? "border-green-400 bg-green-400/20"
        : "border-red-400 bg-red-400/20";
    }
    return winningBoxes[index]
      ? "border-yellow-400 bg-yellow-400/10"
      : "border-gray-600";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-purple">
          📦 Mystery Box
        </h2>

        {!revealed && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              2 out of 4 boxes contain prizes! Choose wisely...
            </p>

            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-lg text-neon-orange font-bold">
                ⏰ {timeLeft}s to choose!
              </p>
            </div>

            {/* Mystery Boxes Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((boxIndex) => (
                <motion.div
                  key={boxIndex}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <div
                    onClick={() => selectBox(boxIndex)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${getBoxColor(
                      boxIndex,
                    )}`}
                  >
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-sm font-bold">Box #{boxIndex + 1}</div>
                    {selectedBox === boxIndex && (
                      <div className="text-xs text-primary mt-1">SELECTED</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedBox !== null && (
              <div className="space-y-3">
                <p className="text-lg font-bold text-neon-blue">
                  Selected: Box #{selectedBox + 1}
                </p>
                <Button
                  onClick={revealBoxes}
                  className="bg-gradient-to-r from-neon-purple to-neon-pink text-white"
                  size="lg"
                >
                  🎁 OPEN ALL BOXES
                </Button>
              </div>
            )}
          </div>
        )}

        {revealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              {/* Show all boxes revealed */}
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((boxIndex) => (
                  <div
                    key={boxIndex}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${getBoxColor(
                      boxIndex,
                    )}`}
                  >
                    <div className="text-4xl mb-2">{getBoxEmoji(boxIndex)}</div>
                    <div className="text-sm font-bold">Box #{boxIndex + 1}</div>
                    {boxIndex === selectedBox && (
                      <div className="text-xs text-blue-400 mt-1">
                        YOUR PICK
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-6xl">
                {selectedBox !== null && winningBoxes[selectedBox]
                  ? "🎉"
                  : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  selectedBox !== null && winningBoxes[selectedBox]
                    ? "text-neon-green"
                    : "text-neon-red"
                }`}
              >
                {selectedBox !== null && winningBoxes[selectedBox]
                  ? "PRIZE FOUND!"
                  : "EMPTY BOX!"}
              </h3>

              <div className="text-center">
                <p className="text-lg">
                  You opened:{" "}
                  <span className="font-bold">Box #{selectedBox! + 1}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Winning boxes:{" "}
                  {winningBoxes
                    .map((isWinner, i) => (isWinner ? i + 1 : null))
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              {selectedBox !== null && winningBoxes[selectedBox] && (
                <div>
                  <p className="text-lg text-neon-green">2x Multiplier!</p>
                  <p className="text-lg text-neon-green">
                    Won: ${(betAmount * 2).toFixed(2)}
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
