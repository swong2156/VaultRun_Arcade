import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ColorBlastProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

type Color = "red" | "blue" | "green" | "yellow" | "purple" | "orange";

export default function ColorBlast({
  betAmount,
  onGameComplete,
}: ColorBlastProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Color | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const colors: { name: Color; color: string; emoji: string }[] = [
    { name: "red", color: "bg-red-500", emoji: "🔴" },
    { name: "blue", color: "bg-blue-500", emoji: "🔵" },
    { name: "green", color: "bg-green-500", emoji: "🟢" },
    { name: "yellow", color: "bg-yellow-500", emoji: "🟡" },
    { name: "purple", color: "bg-purple-500", emoji: "🟣" },
    { name: "orange", color: "bg-orange-500", emoji: "🟠" },
  ];

  const spinWheel = async () => {
    if (!selectedColor) return;

    setGameStarted(true);
    setIsSpinning(true);

    // Calculate final rotation (multiple full spins + final position)
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const colorIndex = Math.floor(Math.random() * colors.length);
    const finalAngle = colorIndex * 60 + (Math.random() * 40 - 20); // ±20 degrees variation
    const totalRotation = wheelRotation + spins * 360 + finalAngle;

    setWheelRotation(totalRotation);

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const resultColor = colors[colorIndex].name;
    setResult(resultColor);
    setIsSpinning(false);

    // Check win (1 in 6 chance, but higher multiplier)
    const isWin = selectedColor === resultColor;
    setTimeout(() => {
      onGameComplete(isWin, isWin ? betAmount * 5.5 : 0); // 5.5x for 1/6 odds
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-rainbow">
          🎨 Color Blast
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Pick a color and spin the wheel!
            </p>

            {/* Color Wheel Preview */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 overflow-hidden">
                {colors.map((color, index) => (
                  <div
                    key={color.name}
                    className={`absolute w-full h-full ${color.color}`}
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((index * 60 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((index * 60 - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos((((index + 1) * 60 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin((((index + 1) * 60 - 90) * Math.PI) / 180)}%)`,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white mix-blend-difference">
                🎯
              </div>
            </div>

            {/* Color Selection */}
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <Button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  variant={selectedColor === color.name ? "default" : "outline"}
                  className={`aspect-square text-xl ${
                    selectedColor === color.name
                      ? "ring-2 ring-primary"
                      : "border-primary/20"
                  }`}
                >
                  {color.emoji}
                </Button>
              ))}
            </div>

            {selectedColor && (
              <div className="text-lg font-bold text-neon-blue">
                Selected: {colors.find((c) => c.name === selectedColor)?.emoji}{" "}
                {selectedColor}
              </div>
            )}

            <Button
              onClick={spinWheel}
              disabled={!selectedColor}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-pink text-white"
              size="lg"
            >
              🎡 Spin Wheel
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            <p className="text-lg">
              Your pick:{" "}
              <span className="font-bold text-neon-blue">
                {colors.find((c) => c.name === selectedColor)?.emoji}{" "}
                {selectedColor}
              </span>
            </p>

            {/* Animated Spinning Wheel */}
            <div className="relative w-40 h-40 mx-auto">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary overflow-hidden"
                animate={{ rotate: wheelRotation }}
                transition={{
                  duration: isSpinning ? 3 : 0,
                  ease: isSpinning ? "easeOut" : "linear",
                }}
              >
                {colors.map((color, index) => (
                  <div
                    key={color.name}
                    className={`absolute w-full h-full ${color.color}`}
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((index * 60 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((index * 60 - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos((((index + 1) * 60 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin((((index + 1) * 60 - 90) * Math.PI) / 180)}%)`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white z-10" />

              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white mix-blend-difference z-10">
                🎯
              </div>
            </div>

            {isSpinning && (
              <motion.p
                className="text-xl font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Spinning the wheel...
              </motion.p>
            )}

            {result && !isSpinning && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-xl mb-2">
                  Result:{" "}
                  <span className="font-bold text-2xl">
                    {colors.find((c) => c.name === result)?.emoji} {result}
                  </span>
                </p>
                <p
                  className={`text-2xl font-bold ${
                    selectedColor === result
                      ? "text-neon-green"
                      : "text-neon-red"
                  }`}
                >
                  {selectedColor === result ? "🎉 WINNER!" : "😔 TRY AGAIN"}
                </p>
                {selectedColor === result && (
                  <p className="text-lg text-neon-green mt-2">
                    5.5x Multiplier! Won: ${(betAmount * 5.5).toFixed(2)}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
