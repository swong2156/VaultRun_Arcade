import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SuddenDeathProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function SuddenDeath({
  betAmount,
  onGameComplete,
}: SuddenDeathProps) {
  const [riskAmount, setRiskAmount] = useState(betAmount);
  const [countdown, setCountdown] = useState(10);
  const [gamePhase, setGamePhase] = useState<
    "warning" | "betting" | "countdown" | "result"
  >("warning");
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  useEffect(() => {
    if (gamePhase === "countdown") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            executeGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase]);

  const executeGame = async () => {
    // Extremely low win rate - only 8% chance to win
    const isWin = Math.random() < 0.08;
    setResult(isWin ? "win" : "lose");
    setGamePhase("result");

    setTimeout(() => {
      if (isWin) {
        // Massive multiplier for the high risk
        onGameComplete(true, riskAmount * 20);
      } else {
        onGameComplete(false);
      }
    }, 2000);
  };

  const startSuddenDeath = () => {
    setGamePhase("countdown");
    setCountdown(5); // 5 second countdown
  };

  const proceedFromWarning = () => {
    setGamePhase("betting");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-red-900/90 to-black/90 border-red-500/50">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-red-400">
          🧨 SUDDEN DEATH
        </h2>

        {gamePhase === "warning" && (
          <div className="space-y-6">
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ☠️
            </motion.div>

            <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4">
              <h3 className="text-xl font-bold text-red-400 mb-2">
                ⚠️ EXTREME RISK WARNING ⚠️
              </h3>
              <div className="text-sm text-red-300 space-y-2">
                <p>• Only 8% chance to win</p>
                <p>• 92% chance to lose everything</p>
                <p>• 20x multiplier if you win</p>
                <p>• This is GAMBLING at its most extreme</p>
              </div>
            </div>

            <p className="text-lg text-red-300">
              Are you absolutely sure you want to risk it all?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => onGameComplete(false, betAmount)}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                🏃 FLEE
              </Button>
              <Button
                onClick={proceedFromWarning}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white"
              >
                💀 PROCEED
              </Button>
            </div>
          </div>
        )}

        {gamePhase === "betting" && (
          <div className="space-y-6">
            <p className="text-lg text-red-300">
              Set your risk amount. You could lose it ALL!
            </p>

            <div className="space-y-3">
              <Input
                type="number"
                value={riskAmount}
                onChange={(e) => setRiskAmount(Number(e.target.value))}
                min={betAmount}
                max={betAmount * 5} // Allow up to 5x the bet
                className="bg-red-950/50 border-red-500/30 text-center text-xl"
              />
              <p className="text-sm text-red-400">
                Risk: ${riskAmount} • Potential win: ${riskAmount * 20}
              </p>
            </div>

            <Button
              onClick={startSuddenDeath}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold"
              size="lg"
            >
              💣 ACTIVATE SUDDEN DEATH
            </Button>
          </div>
        )}

        {gamePhase === "countdown" && (
          <div className="space-y-6">
            <motion.div
              className="text-9xl"
              animate={{
                scale: [1, 1.3, 1],
                color: countdown <= 2 ? ["#ef4444", "#dc2626", "#ef4444"] : [],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {countdown}
            </motion.div>

            <p className="text-xl text-red-300">Fate is deciding...</p>

            <div className="bg-red-900/50 rounded-lg p-3">
              <p className="text-lg text-red-400">
                Risk Amount: <span className="font-bold">${riskAmount}</span>
              </p>
              <p className="text-sm text-red-300">
                8% chance for ${riskAmount * 20}
              </p>
            </div>

            <motion.div
              className="text-lg font-cyber text-red-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              No going back now...
            </motion.div>
          </div>
        )}

        {gamePhase === "result" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <motion.div
                className="text-8xl"
                animate={
                  result === "win"
                    ? { rotate: [0, 360], scale: [1, 1.5, 1] }
                    : { rotate: [0, 10, -10, 0] }
                }
                transition={{ duration: 1, repeat: 2 }}
              >
                {result === "win" ? "💎" : "💀"}
              </motion.div>

              <h3
                className={`text-3xl font-bold ${
                  result === "win" ? "text-yellow-400" : "text-red-400"
                }`}
              >
                {result === "win" ? "LEGENDARY WIN!" : "TOTAL DESTRUCTION!"}
              </h3>

              {result === "win" ? (
                <div className="space-y-2">
                  <p className="text-2xl text-yellow-400 font-bold">
                    🎉 JACKPOT! 🎉
                  </p>
                  <p className="text-xl text-green-400">
                    You beat the 8% odds!
                  </p>
                  <p className="text-2xl text-green-400 font-bold">
                    Won: ${(riskAmount * 20).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-300">
                    20x Multiplier Applied
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl text-red-400">
                    The house always wins...
                  </p>
                  <p className="text-lg text-red-300">
                    Lost: ${riskAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-400">
                    92% chance - as expected
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
