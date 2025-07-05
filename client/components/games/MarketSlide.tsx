import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MarketSlideProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function MarketSlide({
  betAmount,
  onGameComplete,
}: MarketSlideProps) {
  const [gamePhase, setGamePhase] = useState<"betting" | "sliding" | "result">(
    "betting",
  );
  const [prediction, setPrediction] = useState<"dump" | null>(null);
  const [startPrice] = useState(45000 + Math.random() * 10000); // BTC price
  const [currentPrice, setCurrentPrice] = useState(startPrice);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (gamePhase === "sliding") {
      let duration = 0;
      const maxDuration = 5000; // 5 seconds

      const interval = setInterval(() => {
        duration += 100;

        setCurrentPrice((prev) => {
          // Aggressive price movement with bias toward dumping
          const volatility = 0.003 + Math.random() * 0.005; // 0.3-0.8% moves
          const dumpBias = Math.random() > 0.65 ? 1 : -1; // 65% chance to dump
          const change = prev * volatility * dumpBias;
          return prev + change;
        });

        setTimeLeft(Math.max(0, 5 - duration / 1000));

        if (duration >= maxDuration) {
          clearInterval(interval);
          setFinalPrice(currentPrice);
          setGamePhase("result");

          setTimeout(() => {
            const priceChange =
              ((currentPrice - startPrice) / startPrice) * 100;
            const isDump = priceChange <= -5; // 5% drop = dump
            const isWin = prediction === "dump" && isDump;

            // Higher multiplier for bigger dumps
            const changeAbs = Math.abs(priceChange);
            const multiplier = changeAbs > 10 ? 4 : changeAbs > 7 ? 3 : 2.5;

            onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
          }, 2000);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [
    gamePhase,
    currentPrice,
    startPrice,
    prediction,
    betAmount,
    onGameComplete,
  ]);

  const makePrediction = () => {
    setPrediction("dump");
    setGamePhase("sliding");
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const getPriceChange = () => {
    if (!finalPrice) return 0;
    return ((finalPrice - startPrice) / startPrice) * 100;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-red-900/30 to-black/90 border-red-500/50">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-red-400">
          📉 Market Slide
        </h2>

        {gamePhase === "betting" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-red-300">Current BTC Price</p>
              <p className="text-3xl font-bold text-red-400">
                {formatPrice(startPrice)}
              </p>
            </div>

            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-300 mb-2">
                ⚠️ MARKET CRASH ALERT
              </h3>
              <p className="text-sm text-red-200">
                Will BTC dump 5%+ in the next 5 seconds?
              </p>
              <p className="text-xs text-red-400 mt-2">
                💀 High volatility expected!
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-lg text-red-300">
                The market is about to move. Will it be a bloodbath?
              </p>

              <Button
                onClick={makePrediction}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white h-16 text-xl font-bold"
                size="lg"
              >
                📉 BET ON THE DUMP
                <br />
                <span className="text-sm">5%+ drop in 5s</span>
              </Button>

              <p className="text-xs text-red-400">
                💰 Bigger dumps = higher multipliers (2.5x-4x)
              </p>
            </div>
          </div>
        )}

        {gamePhase === "sliding" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-red-300">Live BTC Price</p>
              <motion.p
                className="text-4xl font-bold"
                animate={{
                  color:
                    currentPrice < startPrice
                      ? ["#ef4444", "#dc2626", "#ef4444"]
                      : ["#22c55e", "#16a34a", "#22c55e"],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                {formatPrice(currentPrice)}
              </motion.p>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-red-500/30">
              <p className="text-sm text-red-300">Price Change</p>
              <p
                className={`text-2xl font-bold ${
                  currentPrice < startPrice ? "text-red-400" : "text-green-400"
                }`}
              >
                {currentPrice < startPrice ? "" : "+"}
                {(((currentPrice - startPrice) / startPrice) * 100).toFixed(2)}%
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-red-300">
                ⏰ {timeLeft.toFixed(1)}s left
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeLeft / 5) * 100}%` }}
                />
              </div>
            </div>

            <motion.div
              className="text-lg font-cyber text-red-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              Market is crashing...
            </motion.div>
          </div>
        )}

        {gamePhase === "result" && finalPrice && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-red-300">Final Price</p>
                <p className="text-3xl font-bold text-red-400">
                  {formatPrice(finalPrice)}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-4 border border-red-500/30">
                <p className="text-sm text-red-300">Total Price Change</p>
                <p
                  className={`text-3xl font-bold ${
                    getPriceChange() < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {getPriceChange() > 0 ? "+" : ""}
                  {getPriceChange().toFixed(2)}%
                </p>
              </div>

              <div className="text-6xl">
                {getPriceChange() <= -5 ? "💀" : "📈"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  getPriceChange() <= -5 ? "text-red-400" : "text-green-400"
                }`}
              >
                {getPriceChange() <= -5 ? "MARKET DUMPED!" : "PUMP INSTEAD!"}
              </h3>

              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <p className="text-lg mb-2 text-red-200">Market Analysis:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    📊 Started at:{" "}
                    <span className="font-bold">{formatPrice(startPrice)}</span>
                  </p>
                  <p>
                    📉 Ended at:{" "}
                    <span className="font-bold">{formatPrice(finalPrice)}</span>
                  </p>
                  <p>
                    🎯 Target:{" "}
                    <span className="font-bold text-red-400">-5% dump</span>
                  </p>
                  <p>
                    📈 Result:{" "}
                    <span
                      className={`font-bold ${
                        getPriceChange() <= -5
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {getPriceChange() <= -5 ? "DUMP" : "PUMP/STABLE"}
                    </span>
                  </p>
                </div>
              </div>

              {getPriceChange() <= -5 && (
                <div>
                  <p className="text-lg text-red-400">
                    {Math.abs(getPriceChange()) > 10
                      ? "4x"
                      : Math.abs(getPriceChange()) > 7
                        ? "3x"
                        : "2.5x"}{" "}
                    Crash Multiplier!
                  </p>
                  <p className="text-lg text-red-400">
                    Won: $
                    {(
                      betAmount *
                      (Math.abs(getPriceChange()) > 10
                        ? 4
                        : Math.abs(getPriceChange()) > 7
                          ? 3
                          : 2.5)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-red-300 mt-2">
                    🩸 You predicted the bloodbath!
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
