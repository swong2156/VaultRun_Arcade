import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionMarketProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function PredictionMarket({
  betAmount,
  onGameComplete,
}: PredictionMarketProps) {
  const [prediction, setPrediction] = useState<"up" | "down" | null>(null);
  const [timeLeft, setTimeLeft] = useState(8); // 8 seconds to decide
  const [gamePhase, setGamePhase] = useState<"betting" | "running" | "result">(
    "betting",
  );
  const [startPrice] = useState(42000 + Math.random() * 8000); // BTC price
  const [currentPrice, setCurrentPrice] = useState(startPrice);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([startPrice]);

  useEffect(() => {
    if (gamePhase === "betting") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (prediction) {
              startPriceMovement();
            } else {
              // Time's up without prediction - lose
              onGameComplete(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gamePhase, prediction, onGameComplete]);

  useEffect(() => {
    if (gamePhase === "running") {
      let duration = 0;
      const maxDuration = 3000; // 3 seconds of price movement

      const interval = setInterval(() => {
        duration += 100;

        setCurrentPrice((prev) => {
          // More volatile price movement
          const volatility = 0.002 + Math.random() * 0.003; // 0.2-0.5% moves
          const direction = Math.random() > 0.5 ? 1 : -1;
          const change = prev * volatility * direction;
          const newPrice = prev + change;

          setPriceHistory((history) => [...history.slice(-20), newPrice]);
          return newPrice;
        });

        if (duration >= maxDuration) {
          clearInterval(interval);
          setGamePhase("result");
          setFinalPrice(currentPrice);

          // Determine result
          setTimeout(() => {
            const priceChange =
              ((currentPrice - startPrice) / startPrice) * 100;
            const isUp = priceChange > 0;
            const isWin =
              (prediction === "up" && isUp) || (prediction === "down" && !isUp);

            // Higher multiplier for larger correct predictions
            const changeAbs = Math.abs(priceChange);
            const multiplier = changeAbs > 2 ? 4 : changeAbs > 1 ? 3 : 2;

            onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
          }, 1500);
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

  const makePrediction = (direction: "up" | "down") => {
    setPrediction(direction);
  };

  const startPriceMovement = () => {
    setGamePhase("running");
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const getPriceChange = () => {
    if (!finalPrice) return 0;
    return ((finalPrice - startPrice) / startPrice) * 100;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-blue">
          ⚖️ BTC Prediction
        </h2>

        {gamePhase === "betting" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current BTC Price</p>
              <p className="text-2xl font-bold text-neon-orange">
                {formatPrice(startPrice)}
              </p>
            </div>

            <p className="text-lg text-muted-foreground">
              Will BTC go UP or DOWN in the next 3 seconds?
            </p>

            <div className="bg-muted/20 rounded-lg p-2">
              <Progress value={((8 - timeLeft) / 8) * 100} className="h-2" />
              <p className="text-sm text-neon-red mt-1">
                ⏰ {timeLeft}s to decide!
              </p>
            </div>

            {prediction && (
              <div className="text-lg font-bold text-neon-green">
                Your prediction: {prediction.toUpperCase()} 📈
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => makePrediction("up")}
                disabled={prediction !== null}
                className={`bg-gradient-to-r from-neon-green to-green-400 text-white ${
                  prediction === "up" ? "ring-2 ring-neon-green" : ""
                }`}
                size="lg"
              >
                📈 UP
              </Button>
              <Button
                onClick={() => makePrediction("down")}
                disabled={prediction !== null}
                className={`bg-gradient-to-r from-neon-red to-red-400 text-white ${
                  prediction === "down" ? "ring-2 ring-neon-red" : ""
                }`}
                size="lg"
              >
                📉 DOWN
              </Button>
            </div>
          </div>
        )}

        {gamePhase === "running" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Live BTC Price</p>
              <motion.p
                className="text-3xl font-bold text-neon-orange"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {formatPrice(currentPrice)}
              </motion.p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Your Prediction</p>
              <p
                className={`text-xl font-bold ${
                  prediction === "up" ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {prediction === "up" ? "📈 UP" : "📉 DOWN"}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Starting: {formatPrice(startPrice)}</p>
              <p>
                Change:{" "}
                <span
                  className={
                    currentPrice > startPrice
                      ? "text-neon-green"
                      : "text-neon-red"
                  }
                >
                  {(((currentPrice - startPrice) / startPrice) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </p>
            </div>

            <motion.div
              className="text-lg font-cyber neon-yellow"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              Market is moving...
            </motion.div>
          </div>
        )}

        {gamePhase === "result" && finalPrice && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-4">
              <div className="text-6xl">
                {(prediction === "up" && finalPrice > startPrice) ||
                (prediction === "down" && finalPrice < startPrice)
                  ? "🎉"
                  : "😔"}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Final Price</p>
                <p className="text-2xl font-bold text-neon-orange">
                  {formatPrice(finalPrice)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Price Change</p>
                <p
                  className={`text-xl font-bold ${
                    getPriceChange() > 0 ? "text-neon-green" : "text-neon-red"
                  }`}
                >
                  {getPriceChange() > 0 ? "+" : ""}
                  {getPriceChange().toFixed(2)}%
                </p>
              </div>

              <h3
                className={`text-2xl font-bold ${
                  (prediction === "up" && finalPrice > startPrice) ||
                  (prediction === "down" && finalPrice < startPrice)
                    ? "text-neon-green"
                    : "text-neon-red"
                }`}
              >
                {(prediction === "up" && finalPrice > startPrice) ||
                (prediction === "down" && finalPrice < startPrice)
                  ? "CORRECT!"
                  : "WRONG!"}
              </h3>

              {((prediction === "up" && finalPrice > startPrice) ||
                (prediction === "down" && finalPrice < startPrice)) && (
                <div>
                  <p className="text-lg text-neon-green">
                    Multiplier:{" "}
                    {Math.abs(getPriceChange()) > 2
                      ? "4x"
                      : Math.abs(getPriceChange()) > 1
                        ? "3x"
                        : "2x"}
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (Math.abs(getPriceChange()) > 2
                        ? 4
                        : Math.abs(getPriceChange()) > 1
                          ? 3
                          : 2)
                    ).toFixed(2)}
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
