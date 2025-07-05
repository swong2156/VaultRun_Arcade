import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SpyFlipProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function SpyFlip({ betAmount, onGameComplete }: SpyFlipProps) {
  const [gamePhase, setGamePhase] = useState<
    "briefing" | "analysis" | "selection" | "reveal"
  >("briefing");
  const [coins, setCoins] = useState<
    Array<{ id: number; isHonest: boolean; suspicion: number }>
  >([]);
  const [selectedCoin, setSelectedCoin] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    // Generate 5 coins, only 1 is honest
    const honestCoin = Math.floor(Math.random() * 5);
    const newCoins = Array.from({ length: 5 }, (_, index) => ({
      id: index,
      isHonest: index === honestCoin,
      suspicion: Math.random() * 100, // Random suspicion level for analysis
    }));
    setCoins(newCoins);
  }, []);

  useEffect(() => {
    if (gamePhase === "analysis" || gamePhase === "selection") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (gamePhase === "selection" && selectedCoin !== null) {
              revealResult();
            } else {
              // Time's up - auto lose (with small delay to prevent setState during render)
              setTimeout(() => onGameComplete(false), 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase, selectedCoin, onGameComplete]);

  const startAnalysis = () => {
    setGamePhase("analysis");
    setTimeLeft(8); // 8 seconds to analyze
  };

  const proceedToSelection = () => {
    setGamePhase("selection");
    setTimeLeft(10); // 10 seconds to select
  };

  const selectCoin = (coinId: number) => {
    setSelectedCoin(coinId);
  };

  const revealResult = () => {
    setGamePhase("reveal");
    setTimeout(() => {
      const selectedCoinData = coins.find((c) => c.id === selectedCoin);
      const isWin = selectedCoinData?.isHonest || false;
      onGameComplete(isWin, isWin ? betAmount * 7 : 0); // 7x for 1/5 odds + skill
    }, 2000);
  };

  const getSuspicionColor = (suspicion: number) => {
    if (suspicion < 30) return "text-green-400";
    if (suspicion < 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getSuspicionText = (suspicion: number) => {
    if (suspicion < 30) return "Low";
    if (suspicion < 60) return "Medium";
    return "High";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900/90 to-black/90 border-blue-500/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-blue-400">
          🕵️ Spy Flip
        </h2>

        {gamePhase === "briefing" && (
          <div className="space-y-6">
            <motion.div
              className="text-6xl"
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🕵️
            </motion.div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-left">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                🎯 MISSION BRIEFING
              </h3>
              <div className="text-sm text-blue-200 space-y-1">
                <p>• 5 coins have been intercepted</p>
                <p>• Only 1 coin is honest (fair)</p>
                <p>• 4 coins are rigged by the enemy</p>
                <p>• Use intel to identify the honest coin</p>
                <p>• You have limited time to analyze</p>
              </div>
            </div>

            <Button
              onClick={startAnalysis}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white"
              size="lg"
            >
              🔍 START ANALYSIS
            </Button>
          </div>
        )}

        {gamePhase === "analysis" && (
          <div className="space-y-6">
            <div className="bg-blue-900/20 rounded-lg p-3">
              <p className="text-lg text-blue-400 font-bold">
                ⏰ Analysis Time: {timeLeft}s
              </p>
            </div>

            <p className="text-lg text-blue-300">
              Study the intel on each coin...
            </p>

            <div className="grid grid-cols-5 gap-2">
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg p-3"
                >
                  <div className="text-2xl mb-2">🪙</div>
                  <div className="text-xs">
                    <p>Coin #{coin.id + 1}</p>
                    <p
                      className={`font-bold ${getSuspicionColor(coin.suspicion)}`}
                    >
                      {getSuspicionText(coin.suspicion)}
                    </p>
                    <p className="text-gray-400">
                      {coin.suspicion.toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400">
              Suspicion levels are based on intercepted intelligence
            </p>

            {timeLeft <= 3 && (
              <Button
                onClick={proceedToSelection}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white"
              >
                ⏰ PROCEED TO SELECTION
              </Button>
            )}
          </div>
        )}

        {gamePhase === "selection" && (
          <div className="space-y-6">
            <div className="bg-red-900/20 rounded-lg p-3">
              <p className="text-lg text-red-400 font-bold">
                ⚠️ Selection Time: {timeLeft}s
              </p>
            </div>

            <p className="text-lg text-blue-300">
              Choose the honest coin based on your analysis!
            </p>

            <div className="grid grid-cols-5 gap-2">
              {coins.map((coin) => (
                <motion.div
                  key={coin.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => selectCoin(coin.id)}
                    variant={selectedCoin === coin.id ? "default" : "outline"}
                    className={`aspect-square text-2xl ${
                      selectedCoin === coin.id
                        ? "ring-2 ring-blue-400 bg-blue-600"
                        : "border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    🪙
                  </Button>
                </motion.div>
              ))}
            </div>

            {selectedCoin !== null && (
              <div className="space-y-3">
                <p className="text-lg font-bold text-blue-400">
                  Selected: Coin #{selectedCoin + 1}
                </p>
                <Button
                  onClick={revealResult}
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white"
                  size="lg"
                >
                  🎯 CONFIRM SELECTION
                </Button>
              </div>
            )}
          </div>
        )}

        {gamePhase === "reveal" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              {/* Show all coins revealed */}
              <div className="grid grid-cols-5 gap-2">
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    className={`aspect-square flex flex-col items-center justify-center text-lg rounded-lg border-2 ${
                      coin.id === selectedCoin
                        ? "border-blue-400 bg-blue-600/20"
                        : "border-gray-600"
                    } ${
                      coin.isHonest
                        ? "bg-gradient-to-br from-green-400/20 to-green-600/20"
                        : "bg-gradient-to-br from-red-400/20 to-red-600/20"
                    }`}
                  >
                    <div className="text-2xl">
                      {coin.isHonest ? "✅" : "❌"}
                    </div>
                    <div className="text-xs">#{coin.id + 1}</div>
                  </div>
                ))}
              </div>

              <div className="text-6xl">
                {coins.find((c) => c.id === selectedCoin)?.isHonest
                  ? "🎉"
                  : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  coins.find((c) => c.id === selectedCoin)?.isHonest
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coins.find((c) => c.id === selectedCoin)?.isHonest
                  ? "MISSION SUCCESS!"
                  : "MISSION FAILED!"}
              </h3>

              <div className="text-center">
                <p className="text-lg">
                  You selected:{" "}
                  <span className="font-bold">Coin #{selectedCoin! + 1}</span>
                </p>
                <p className="text-lg">
                  Honest coin was:{" "}
                  <span className="font-bold text-green-400">
                    Coin #{coins.findIndex((c) => c.isHonest) + 1}
                  </span>
                </p>
              </div>

              {coins.find((c) => c.id === selectedCoin)?.isHonest && (
                <div>
                  <p className="text-lg text-green-400">7x Multiplier!</p>
                  <p className="text-lg text-green-400">
                    Won: ${(betAmount * 7).toFixed(2)}
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
