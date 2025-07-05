import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceSpinProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function VoiceSpin({
  betAmount,
  onGameComplete,
}: VoiceSpinProps) {
  const [gamePhase, setGamePhase] = useState<
    "ready" | "listening" | "spinning" | "result"
  >("ready");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [spinResult, setSpinResult] = useState<"heads" | "tails" | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (gamePhase === "listening") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (maxVolume > 30) {
              spinCoin();
            } else {
              // Not loud enough
              setGameEnded(true);
              setGamePhase("result");
              setTimeout(() => onGameComplete(false), 1500);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate volume detection
      const volumeTimer = setInterval(() => {
        const randomVolume = Math.random() * 100; // Random volume simulation
        setVolumeLevel(randomVolume);
        setMaxVolume((prev) => Math.max(prev, randomVolume));
      }, 100);

      return () => {
        clearInterval(timer);
        clearInterval(volumeTimer);
      };
    }
  }, [gamePhase, maxVolume, onGameComplete]);

  const startListening = () => {
    setGamePhase("listening");
    setVolumeLevel(0);
    setMaxVolume(0);
    setGameEnded(false);
    setTimeLeft(5);
  };

  const simulateYell = () => {
    // Simulate a loud yell
    const yellVolume = 70 + Math.random() * 30; // 70-100 volume
    setVolumeLevel(yellVolume);
    setMaxVolume((prev) => Math.max(prev, yellVolume));
  };

  const spinCoin = () => {
    setGamePhase("spinning");

    setTimeout(() => {
      const result = Math.random() > 0.5 ? "heads" : "tails";
      setSpinResult(result);
      setGamePhase("result");

      setTimeout(() => {
        // Win is based on volume level achieved
        const volumeBonus = maxVolume > 80 ? 3 : maxVolume > 60 ? 2.5 : 2;
        const isWin = Math.random() < 0.55; // 55% base win rate
        onGameComplete(isWin, isWin ? betAmount * volumeBonus : 0);
      }, 2000);
    }, 3000);
  };

  const getVolumeColor = () => {
    if (volumeLevel > 80) return "from-red-500 to-red-700";
    if (volumeLevel > 60) return "from-orange-500 to-orange-700";
    if (volumeLevel > 30) return "from-yellow-500 to-yellow-700";
    return "from-green-500 to-green-700";
  };

  const getVolumeEmoji = () => {
    if (volumeLevel > 80) return "📢";
    if (volumeLevel > 60) return "🔊";
    if (volumeLevel > 30) return "🔉";
    return "🔈";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-yellow">
          🎤 Voice Spin
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Yell into your device to spin the coin! The louder, the better!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Voice Rules:</h3>
              <div className="text-sm space-y-1">
                <p>🎤 5 seconds to make noise</p>
                <p>📢 Volume &gt; 30% to spin</p>
                <p>🔊 Louder = better multiplier</p>
                <p>💰 80%+ volume: 3x multiplier</p>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎤
              </motion.div>

              <p className="text-sm text-muted-foreground">
                Note: This is a simulated microphone. Click "Test Yell" to
                simulate loud volume!
              </p>
            </div>

            <Button
              onClick={startListening}
              className="bg-gradient-to-r from-neon-yellow to-neon-orange text-black font-bold"
              size="lg"
            >
              🎤 START LISTENING
            </Button>
          </div>
        )}

        {gamePhase === "listening" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg font-bold text-neon-yellow">
                🎤 YELL NOW! {timeLeft}s left
              </p>

              {/* Volume Meter */}
              <div className="space-y-2">
                <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getVolumeColor()} transition-all duration-100`}
                    style={{ width: `${volumeLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Silent</span>
                  <span>LOUD!</span>
                </div>
              </div>

              {/* Current Volume Display */}
              <div className="text-center">
                <div className="text-4xl mb-2">{getVolumeEmoji()}</div>
                <p className="text-lg font-bold">
                  Current: {Math.round(volumeLevel)}%
                </p>
                <p className="text-sm text-neon-green">
                  Max: {Math.round(maxVolume)}%
                </p>
              </div>

              {/* Simulate Yell Button */}
              <Button
                onClick={simulateYell}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white"
                size="lg"
              >
                📢 TEST YELL (Simulate)
              </Button>

              <div className="text-center">
                <p
                  className={`text-sm font-bold ${
                    maxVolume > 30 ? "text-neon-green" : "text-neon-red"
                  }`}
                >
                  {maxVolume > 30
                    ? "🎉 Loud enough to spin!"
                    : "🔇 Need more volume!"}
                </p>
              </div>
            </div>
          </div>
        )}

        {gamePhase === "spinning" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your yell power:{" "}
              <span className="font-bold">{Math.round(maxVolume)}%</span>
            </p>

            <motion.div
              className="text-8xl"
              animate={{
                rotateY: [0, 180, 360, 540, 720],
                scale: [1, 1.2, 1, 1.2, 1],
              }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              🪙
            </motion.div>

            <motion.p
              className="text-xl font-cyber neon-yellow"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              Your voice spins the coin...
            </motion.p>
          </div>
        )}

        {gamePhase === "result" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {spinResult === "heads" ? "🪙" : "🔶"}
                </div>
                <p className="text-xl mb-2">
                  Coin landed:{" "}
                  <span className="font-bold text-neon-orange">
                    {spinResult?.toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Voice Analysis:</p>
                <div className="space-y-1">
                  <p>
                    🎤 Max Volume:{" "}
                    <span className="font-bold">{Math.round(maxVolume)}%</span>
                  </p>
                  <p>
                    📊 Voice Power:{" "}
                    <span
                      className={`font-bold ${
                        maxVolume > 80
                          ? "text-red-400"
                          : maxVolume > 60
                            ? "text-orange-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {maxVolume > 80
                        ? "ROARING!"
                        : maxVolume > 60
                          ? "LOUD!"
                          : "AUDIBLE"}
                    </span>
                  </p>
                  <p>
                    🎲 Coin Result:{" "}
                    <span className="font-bold text-neon-orange">
                      {spinResult}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-6xl">
                {Math.random() < 0.55 ? "🎉" : "😔"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  Math.random() < 0.55 ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {Math.random() < 0.55 ? "VOCAL VICTORY!" : "VOICE FAILED!"}
              </h3>

              {Math.random() < 0.55 && (
                <div>
                  <p className="text-lg text-neon-green">
                    {maxVolume > 80 ? "3x" : maxVolume > 60 ? "2.5x" : "2x"}{" "}
                    Voice Multiplier!
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (maxVolume > 80 ? 3 : maxVolume > 60 ? 2.5 : 2)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-300">
                    {maxVolume > 80
                      ? "📢 Legendary Lungs!"
                      : maxVolume > 60
                        ? "🔊 Strong Voice!"
                        : "🎤 Good Volume!"}
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
