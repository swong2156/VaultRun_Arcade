import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HotColdProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function HotCold({ betAmount, onGameComplete }: HotColdProps) {
  const [targetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<"playing" | "won" | "lost">(
    "playing",
  );
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds

  useEffect(() => {
    if (gamePhase === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGamePhase("lost");
            setTimeout(() => onGameComplete(false), 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase, onGameComplete]);

  const makeGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNum === targetNumber) {
      setGamePhase("won");
      // Better multiplier for fewer attempts
      const multiplier = newAttempts <= 3 ? 4 : newAttempts <= 6 ? 3 : 2;
      setTimeout(() => onGameComplete(true, betAmount * multiplier), 1500);
      return;
    }

    if (newAttempts >= 8) {
      setGamePhase("lost");
      setTimeout(() => onGameComplete(false), 1500);
      return;
    }

    // Generate feedback
    const difference = Math.abs(guessNum - targetNumber);
    let feedbackText = "";
    let temperature = "";

    if (difference <= 2) {
      feedbackText = "🔥 BURNING HOT! Very close!";
      temperature = "burning";
    } else if (difference <= 5) {
      feedbackText = "🔥 HOT! Getting close!";
      temperature = "hot";
    } else if (difference <= 10) {
      feedbackText = "🌡️ WARM. You're in the area.";
      temperature = "warm";
    } else if (difference <= 20) {
      feedbackText = "❄️ COOL. Not quite there.";
      temperature = "cool";
    } else {
      feedbackText = "🧊 COLD! Way off.";
      temperature = "cold";
    }

    // Add direction hint after 3rd attempt
    if (newAttempts >= 3) {
      feedbackText += guessNum < targetNumber ? " Try HIGHER!" : " Try LOWER!";
    }

    setFeedback((prev) => [...prev, `${guessNum}: ${feedbackText}`]);
    setGuess("");
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case "burning":
        return "from-red-500 to-orange-500";
      case "hot":
        return "from-orange-500 to-yellow-500";
      case "warm":
        return "from-yellow-500 to-green-500";
      case "cool":
        return "from-blue-500 to-cyan-500";
      case "cold":
        return "from-cyan-500 to-blue-800";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-orange">
          🔥 Hot/Cold
        </h2>

        {gamePhase === "playing" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              I'm thinking of a number between 1-100. Can you find it?
            </p>

            <div className="flex justify-between text-sm">
              <span className="text-neon-blue font-bold">
                Attempts: {attempts}/8
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter 1-100"
                  className="flex-1 text-center text-lg"
                  onKeyPress={(e) => e.key === "Enter" && makeGuess()}
                />
                <Button
                  onClick={makeGuess}
                  disabled={!guess}
                  className="bg-gradient-to-r from-neon-orange to-neon-red text-white"
                >
                  🎯 GUESS
                </Button>
              </div>
            </div>

            {/* Feedback History */}
            {feedback.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <h3 className="text-sm font-bold">Temperature Readings:</h3>
                {feedback.map((fb, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm p-2 rounded bg-muted/30"
                  >
                    {fb}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="bg-muted/20 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                💡 Tip: The closer you get, the hotter it gets!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Fewer attempts = higher multiplier (2x-4x)
              </p>
            </div>
          </div>
        )}

        {(gamePhase === "won" || gamePhase === "lost") && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-6xl">
                {gamePhase === "won" ? "🎯" : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  gamePhase === "won" ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {gamePhase === "won" ? "BULLSEYE!" : "TIME'S UP!"}
              </h3>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Game Results:</p>
                <div className="space-y-1">
                  <p>
                    🎯 Target Number:{" "}
                    <span className="font-bold text-neon-yellow">
                      {targetNumber}
                    </span>
                  </p>
                  <p>
                    🔄 Attempts Used:{" "}
                    <span className="font-bold">{attempts}/8</span>
                  </p>
                  {gamePhase === "won" && (
                    <p>
                      ⏱️ Time Remaining:{" "}
                      <span className="font-bold">{timeLeft}s</span>
                    </p>
                  )}
                </div>
              </div>

              {gamePhase === "won" && (
                <div>
                  <p className="text-lg text-neon-green">
                    {attempts <= 3 ? "4x" : attempts <= 6 ? "3x" : "2x"}{" "}
                    Multiplier!
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount * (attempts <= 3 ? 4 : attempts <= 6 ? 3 : 2)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-300">
                    {attempts <= 3
                      ? "🔥 Master Detective!"
                      : attempts <= 6
                        ? "🎯 Great Guess!"
                        : "👍 Nice Work!"}
                  </p>
                </div>
              )}

              {feedback.length > 0 && (
                <div className="text-sm">
                  <p className="font-bold mb-1">Your Journey:</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {feedback.map((fb, index) => (
                      <div key={index} className="text-xs opacity-70">
                        {fb}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
