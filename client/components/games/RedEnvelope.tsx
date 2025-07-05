import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RedEnvelopeProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function RedEnvelope({
  betAmount,
  onGameComplete,
}: RedEnvelopeProps) {
  const [selectedEnvelope, setSelectedEnvelope] = useState<number | null>(null);
  const [envelopes] = useState(() => {
    // Generate 5 envelopes with different prizes
    const prizes = [0, 0, betAmount * 1.5, betAmount * 3, betAmount * 5]; // 2 empty, 3 with prizes
    return prizes.sort(() => Math.random() - 0.5); // Shuffle
  });
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [envelopeAnimations, setEnvelopeAnimations] = useState<boolean[]>(
    new Array(5).fill(false),
  );

  useEffect(() => {
    if (!revealed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (selectedEnvelope !== null) {
              openEnvelope();
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
  }, [revealed, selectedEnvelope, onGameComplete]);

  useEffect(() => {
    // Start envelope floating animations
    const intervals = envelopes.map((_, index) => {
      return setInterval(
        () => {
          setEnvelopeAnimations((prev) =>
            prev.map((_, i) => (i === index ? !prev[i] : prev[i])),
          );
        },
        1000 + index * 200,
      ); // Staggered animations
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const selectEnvelope = (index: number) => {
    if (revealed) return;
    setSelectedEnvelope(index);
  };

  const openEnvelope = () => {
    setRevealed(true);
    setTimeout(() => {
      const prize = selectedEnvelope !== null ? envelopes[selectedEnvelope] : 0;
      const isWin = prize > 0;
      onGameComplete(isWin, prize);
    }, 2000);
  };

  const getEnvelopeContent = (index: number) => {
    if (!revealed) return "🧧";
    const prize = envelopes[index];
    if (prize === 0) return "📦"; // Empty
    if (prize === betAmount * 1.5) return "💰"; // Small prize
    if (prize === betAmount * 3) return "���"; // Medium prize
    return "👑"; // Big prize
  };

  const getEnvelopeColor = (index: number) => {
    if (!revealed) {
      return selectedEnvelope === index
        ? "border-red-400 bg-red-400/20 ring-2 ring-red-400"
        : "border-red-600 hover:border-red-400";
    }

    if (index === selectedEnvelope) {
      return envelopes[index] > 0
        ? "border-yellow-400 bg-yellow-400/20"
        : "border-gray-600 bg-gray-600/20";
    }

    return envelopes[index] > 0
      ? "border-green-400 bg-green-400/10"
      : "border-gray-600";
  };

  const getPrizeText = (prize: number) => {
    if (prize === 0) return "Empty";
    if (prize === betAmount * 1.5) return "Small Luck";
    if (prize === betAmount * 3) return "Good Fortune";
    return "Great Wealth";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-red-900/30 to-yellow-900/30 border-red-500/50">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-red-400">
          🧧 Red Envelope
        </h2>

        {!revealed && (
          <div className="space-y-6">
            <p className="text-lg text-red-200">
              Choose a red envelope for your New Year fortune!
            </p>

            <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
              <p className="text-lg text-red-400 font-bold">
                ⏰ {timeLeft}s to choose!
              </p>
              <p className="text-sm text-red-300">
                🍀 Good luck brings great rewards
              </p>
            </div>

            {/* Red Envelopes */}
            <div className="grid grid-cols-5 gap-3">
              {envelopes.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: envelopeAnimations[index] ? [-5, 5, -5] : [0],
                    rotate: envelopeAnimations[index] ? [-2, 2, -2] : [0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <div
                    onClick={() => selectEnvelope(index)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${getEnvelopeColor(
                      index,
                    )}`}
                  >
                    <div className="text-3xl mb-1">🧧</div>
                    <div className="text-xs font-bold text-red-200">
                      #{index + 1}
                    </div>
                    {selectedEnvelope === index && (
                      <div className="text-xs text-red-400 mt-1">SELECTED</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedEnvelope !== null && (
              <div className="space-y-3">
                <p className="text-lg font-bold text-red-300">
                  Selected: Envelope #{selectedEnvelope + 1}
                </p>
                <Button
                  onClick={openEnvelope}
                  className="bg-gradient-to-r from-red-600 to-yellow-600 text-white"
                  size="lg"
                >
                  🎁 OPEN ENVELOPE
                </Button>
              </div>
            )}

            <div className="text-sm text-red-300/70">
              <p>
                💰 Small Luck: 1.5x • 💎 Good Fortune: 3x • 👑 Great Wealth: 5x
              </p>
            </div>
          </div>
        )}

        {revealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              {/* Show all envelopes revealed */}
              <div className="grid grid-cols-5 gap-3">
                {envelopes.map((prize, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${getEnvelopeColor(
                      index,
                    )}`}
                  >
                    <div className="text-3xl mb-1">
                      {getEnvelopeContent(index)}
                    </div>
                    <div className="text-xs font-bold">#{index + 1}</div>
                    {index === selectedEnvelope && (
                      <div className="text-xs text-blue-400 mt-1">
                        YOUR PICK
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1, repeat: 3 }}
                className="text-6xl"
              >
                {selectedEnvelope !== null && envelopes[selectedEnvelope] > 0
                  ? "🎉"
                  : "😔"}
              </motion.div>

              <h3
                className={`text-2xl font-bold ${
                  selectedEnvelope !== null && envelopes[selectedEnvelope] > 0
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {selectedEnvelope !== null && envelopes[selectedEnvelope] > 0
                  ? "LUCKY FORTUNE!"
                  : "BETTER LUCK NEXT TIME!"}
              </h3>

              <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                <p className="text-lg mb-2 text-red-200">Fortune Reading:</p>
                <div className="space-y-1">
                  <p className="text-red-200">
                    You opened:{" "}
                    <span className="font-bold">
                      Envelope #{selectedEnvelope! + 1}
                    </span>
                  </p>
                  <p className="text-red-200">
                    Contents:{" "}
                    <span className="font-bold text-yellow-300">
                      {getPrizeText(
                        selectedEnvelope !== null
                          ? envelopes[selectedEnvelope]
                          : 0,
                      )}
                    </span>
                  </p>
                </div>
              </div>

              {selectedEnvelope !== null && envelopes[selectedEnvelope] > 0 && (
                <div>
                  <p className="text-lg text-yellow-400">
                    {envelopes[selectedEnvelope] === betAmount * 1.5
                      ? "1.5x"
                      : envelopes[selectedEnvelope] === betAmount * 3
                        ? "3x"
                        : "5x"}{" "}
                    Fortune Multiplier!
                  </p>
                  <p className="text-lg text-yellow-400">
                    Won: ${envelopes[selectedEnvelope].toFixed(2)}
                  </p>
                  <p className="text-sm text-yellow-300 mt-2">
                    🏮 May your fortune continue to grow! 🏮
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
