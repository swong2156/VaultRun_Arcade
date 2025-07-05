import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ComboPickerProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function ComboPicker({
  betAmount,
  onGameComplete,
}: ComboPickerProps) {
  const [gamePhase, setGamePhase] = useState<
    "setup" | "guessing" | "checking" | "result"
  >("setup");
  const [targetCombo] = useState([
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ]);
  const [playerCombo, setPlayerCombo] = useState([0, 0, 0]);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hints, setHints] = useState<string[]>([]);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (gamePhase === "guessing") {
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

  const startGame = () => {
    setGamePhase("guessing");
    setAttempts(0);
    setHints([]);
    setGameEnded(false);
    setTimeLeft(30);
  };

  const updateCombo = (index: number, value: number) => {
    const newCombo = [...playerCombo];
    newCombo[index] = value;
    setPlayerCombo(newCombo);
  };

  const submitGuess = () => {
    if (gameEnded) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if exact match
    if (
      playerCombo[0] === targetCombo[0] &&
      playerCombo[1] === targetCombo[1] &&
      playerCombo[2] === targetCombo[2]
    ) {
      // Perfect match!
      setGamePhase("result");
      setGameEnded(true);
      setTimeout(() => {
        const multiplier = newAttempts === 1 ? 10 : newAttempts <= 3 ? 6 : 4;
        onGameComplete(true, betAmount * multiplier);
      }, 2000);
      return;
    }

    // Provide hints
    const newHints = [];
    let correctPositions = 0;
    let correctNumbers = 0;

    // Check correct positions
    for (let i = 0; i < 3; i++) {
      if (playerCombo[i] === targetCombo[i]) {
        correctPositions++;
      }
    }

    // Check correct numbers in wrong positions
    for (let i = 0; i < 3; i++) {
      if (targetCombo.includes(playerCombo[i])) {
        correctNumbers++;
      }
    }

    newHints.push(
      `Attempt ${newAttempts}: [${playerCombo.join(",")}] - ${correctPositions} correct positions, ${correctNumbers} correct numbers`,
    );

    setHints((prev) => [...prev, ...newHints]);

    // Check if too many attempts
    if (newAttempts >= 8) {
      endGame();
    }
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    setTimeout(() => {
      onGameComplete(false);
    }, 2000);
  };

  const getNumberColor = (index: number) => {
    if (gamePhase === "result") {
      return playerCombo[index] === targetCombo[index]
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white";
    }
    return "bg-gray-700 text-white";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-cyan">
          🔢 Combo Picker
        </h2>

        {gamePhase === "setup" && (
          <div className="space-y-6">
            <motion.div
              className="text-6xl"
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔒
            </motion.div>

            <p className="text-lg text-muted-foreground">
              Crack the 3-digit combination lock! Each digit is 0-9.
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Lock Rules:</h3>
              <div className="text-sm space-y-1">
                <p>🎯 Guess 3-digit combo (0-9 each)</p>
                <p>⏰ 30 seconds to crack it</p>
                <p>🔍 Get hints after each guess</p>
                <p>💰 1st try: 10x | 2-3 tries: 6x | 4-8 tries: 4x</p>
              </div>
            </div>

            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white"
              size="lg"
            >
              🔓 START CRACKING
            </Button>
          </div>
        )}

        {gamePhase === "guessing" && (
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span className="text-cyan-400 font-bold">
                Attempts: {attempts}/8
              </span>
              <span className="text-red-400 font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Combination Dials */}
            <div className="space-y-4">
              <p className="text-lg font-bold text-cyan-400">
                🔒 Enter Combination
              </p>
              <div className="flex justify-center gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-lg border-2 border-cyan-400 flex items-center justify-center text-2xl font-bold ${getNumberColor(
                        index,
                      )}`}
                    >
                      {playerCombo[index]}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <Button
                        onClick={() =>
                          updateCombo(
                            index,
                            playerCombo[index] === 9
                              ? 0
                              : playerCombo[index] + 1,
                          )
                        }
                        size="sm"
                        className="text-xs h-6 bg-cyan-600 hover:bg-cyan-700"
                      >
                        ▲
                      </Button>
                      <Button
                        onClick={() =>
                          updateCombo(
                            index,
                            playerCombo[index] === 0
                              ? 9
                              : playerCombo[index] - 1,
                          )
                        }
                        size="sm"
                        className="text-xs h-6 bg-cyan-600 hover:bg-cyan-700"
                      >
                        ▼
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={submitGuess}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
              size="lg"
            >
              🔍 TRY COMBINATION
            </Button>

            {/* Hints */}
            {hints.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <h3 className="text-sm font-bold text-cyan-400">🔍 Hints:</h3>
                {hints.map((hint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xs p-2 rounded bg-muted/30 text-left"
                  >
                    {hint}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                💡 Correct positions = exact match | Correct numbers = right
                digit, wrong spot
              </p>
            </div>
          </div>
        )}

        {gamePhase === "result" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-6xl">
                {playerCombo.join("") === targetCombo.join("") ? "🔓" : "🔒"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  playerCombo.join("") === targetCombo.join("")
                    ? "text-cyan-400"
                    : "text-red-400"
                }`}
              >
                {playerCombo.join("") === targetCombo.join("")
                  ? "LOCK CRACKED!"
                  : "LOCK REMAINS SEALED!"}
              </h3>

              <div className="space-y-4">
                {/* Show final combination comparison */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-lg mb-2">Final Results:</p>
                  <div className="space-y-2">
                    <div className="flex justify-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Your Combo
                        </p>
                        <div className="flex gap-1">
                          {playerCombo.map((num, index) => (
                            <div
                              key={index}
                              className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold ${getNumberColor(
                                index,
                              )}`}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Correct Combo
                        </p>
                        <div className="flex gap-1">
                          {targetCombo.map((num, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 rounded border-2 border-cyan-400 bg-cyan-600 text-white flex items-center justify-center font-bold"
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="space-y-1 text-sm">
                    <p>
                      🎯 Target Combo:{" "}
                      <span className="font-bold text-cyan-400">
                        {targetCombo.join("-")}
                      </span>
                    </p>
                    <p>
                      🔄 Attempts Used:{" "}
                      <span className="font-bold">{attempts}</span>
                    </p>
                    <p>
                      ⏰ Time Remaining:{" "}
                      <span className="font-bold">{timeLeft}s</span>
                    </p>
                  </div>
                </div>
              </div>

              {playerCombo.join("") === targetCombo.join("") && (
                <div>
                  <p className="text-lg text-cyan-400">
                    {attempts === 1 ? "10x" : attempts <= 3 ? "6x" : "4x"} Crack
                    Multiplier!
                  </p>
                  <p className="text-lg text-cyan-400">
                    Won: $
                    {(
                      betAmount * (attempts === 1 ? 10 : attempts <= 3 ? 6 : 4)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-cyan-300">
                    {attempts === 1
                      ? "🔓 Master Safecracker!"
                      : attempts <= 3
                        ? "🎯 Expert Lockpick!"
                        : "👍 Lock Breaker!"}
                  </p>
                </div>
              )}

              {/* Show some hints from the game */}
              {hints.length > 0 && (
                <div className="text-sm">
                  <p className="font-bold mb-1 text-cyan-400">Your Journey:</p>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {hints.slice(-3).map((hint, index) => (
                      <div key={index} className="text-xs opacity-70">
                        {hint}
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
