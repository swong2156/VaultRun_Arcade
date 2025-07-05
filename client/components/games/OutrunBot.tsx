import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OutrunBotProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function OutrunBot({
  betAmount,
  onGameComplete,
}: OutrunBotProps) {
  const [gamePhase, setGamePhase] = useState<"ready" | "racing" | "result">(
    "ready",
  );
  const [playerPosition, setPlayerPosition] = useState(0);
  const [botPosition, setBotPosition] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [taps, setTaps] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (gamePhase === "racing" && !gameEnded) {
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Bot moves automatically with some randomness
      const botTimer = setInterval(() => {
        setBotPosition((prev) => {
          const botSpeed = 2 + Math.random() * 1; // Bot speed varies 2-3 per interval
          return prev + botSpeed;
        });
      }, 200);

      return () => {
        clearInterval(gameTimer);
        clearInterval(botTimer);
      };
    }
  }, [gamePhase, gameEnded]);

  const startRace = () => {
    setGamePhase("racing");
    setPlayerPosition(0);
    setBotPosition(0);
    setTaps(0);
    setGameEnded(false);
    setTimeLeft(8);
  };

  const tapToRun = () => {
    if (gameEnded) return;

    setTaps((prev) => prev + 1);
    setPlayerPosition((prev) => prev + 3); // Player moves 3 units per tap
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    setTimeout(() => {
      const isWin = playerPosition > botPosition;
      let multiplier = 0;

      if (isWin) {
        const leadMargin = playerPosition - botPosition;
        if (leadMargin > 30)
          multiplier = 4; // Dominant win
        else if (leadMargin > 15)
          multiplier = 3; // Clear win
        else multiplier = 2; // Close win
      }

      onGameComplete(isWin, isWin ? betAmount * multiplier : 0);
    }, 1500);
  };

  const getPlayerProgress = () => {
    return Math.min((playerPosition / 200) * 100, 100);
  };

  const getBotProgress = () => {
    return Math.min((botPosition / 200) * 100, 100);
  };

  const getLeader = () => {
    if (playerPosition > botPosition) return "player";
    if (botPosition > playerPosition) return "bot";
    return "tie";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-orange">
          🧍 Outrun Bot
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Tap as fast as you can to outrun the AI bot!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Race Rules:</h3>
              <div className="text-sm space-y-1">
                <p>🏃 Tap to move forward</p>
                <p>🤖 Beat the bot to the finish</p>
                <p>⏰ 8 seconds to race</p>
                <p>🏆 Bigger lead = higher multiplier</p>
              </div>
            </div>

            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🏃</div>
                <p className="text-sm font-bold text-blue-400">YOU</p>
              </div>
              <div className="text-2xl neon-yellow">VS</div>
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <p className="text-sm font-bold text-red-400">BOT</p>
              </div>
            </div>

            <Button
              onClick={startRace}
              className="bg-gradient-to-r from-neon-orange to-neon-red text-white"
              size="lg"
            >
              🏁 START RACE
            </Button>
          </div>
        )}

        {gamePhase === "racing" && (
          <div className="space-y-6">
            {/* Race Stats */}
            <div className="flex justify-between text-sm">
              <span className="text-neon-blue font-bold">Taps: {taps}</span>
              <span
                className={`font-bold ${
                  getLeader() === "player"
                    ? "text-neon-green"
                    : getLeader() === "bot"
                      ? "text-neon-red"
                      : "text-neon-yellow"
                }`}
              >
                {getLeader() === "player"
                  ? "🏆 LEADING"
                  : getLeader() === "bot"
                    ? "🚨 BEHIND"
                    : "🤝 TIED"}
              </span>
              <span className="text-neon-red font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Race Track */}
            <div className="space-y-4">
              {/* Player Track */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 font-bold text-sm">YOU</span>
                  <div className="text-xs text-muted-foreground">
                    {playerPosition.toFixed(0)}m
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-blue-400 h-6 rounded-full transition-all duration-200"
                    style={{ width: `${getPlayerProgress()}%` }}
                  />
                  <div
                    className="absolute top-1 text-xl"
                    style={{ left: `${Math.min(getPlayerProgress(), 85)}%` }}
                  >
                    🏃
                  </div>
                  <div className="absolute right-2 top-1 text-lg">🏁</div>
                </div>
              </div>

              {/* Bot Track */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-400 font-bold text-sm">BOT</span>
                  <div className="text-xs text-muted-foreground">
                    {botPosition.toFixed(0)}m
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-neon-red to-red-400 h-6 rounded-full transition-all duration-200"
                    style={{ width: `${getBotProgress()}%` }}
                  />
                  <div
                    className="absolute top-1 text-xl"
                    style={{ left: `${Math.min(getBotProgress(), 85)}%` }}
                  >
                    🤖
                  </div>
                  <div className="absolute right-2 top-1 text-lg">🏁</div>
                </div>
              </div>
            </div>

            {/* Tap Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={tapToRun}
                className="w-full bg-gradient-to-r from-neon-green to-neon-blue text-white h-16 text-xl font-bold"
                size="lg"
              >
                💨 TAP TO RUN!
              </Button>
            </motion.div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {playerPosition > botPosition
                  ? "🏆 You're winning! Keep going!"
                  : "🚨 Bot is ahead! Tap faster!"}
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
                {playerPosition > botPosition ? "🏆" : "🤖"}
              </div>

              <h3
                className={`text-2xl font-bold ${
                  playerPosition > botPosition
                    ? "text-neon-green"
                    : "text-neon-red"
                }`}
              >
                {playerPosition > botPosition
                  ? "YOU WIN THE RACE!"
                  : "BOT WINS!"}
              </h3>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Race Results:</p>
                <div className="space-y-1">
                  <p>
                    🏃 Your Distance:{" "}
                    <span className="font-bold text-blue-400">
                      {playerPosition.toFixed(0)}m
                    </span>
                  </p>
                  <p>
                    🤖 Bot Distance:{" "}
                    <span className="font-bold text-red-400">
                      {botPosition.toFixed(0)}m
                    </span>
                  </p>
                  <p>
                    📊 Total Taps: <span className="font-bold">{taps}</span>
                  </p>
                  <p>
                    🏁 Lead Margin:{" "}
                    <span className="font-bold">
                      {Math.abs(playerPosition - botPosition).toFixed(0)}m
                    </span>
                  </p>
                </div>
              </div>

              {playerPosition > botPosition && (
                <div>
                  <p className="text-lg text-neon-green">
                    {playerPosition - botPosition > 30
                      ? "4x"
                      : playerPosition - botPosition > 15
                        ? "3x"
                        : "2x"}{" "}
                    Victory Multiplier!
                  </p>
                  <p className="text-lg text-neon-green">
                    Won: $
                    {(
                      betAmount *
                      (playerPosition - botPosition > 30
                        ? 4
                        : playerPosition - botPosition > 15
                          ? 3
                          : 2)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-300">
                    {playerPosition - botPosition > 30
                      ? "🚀 Speed Demon!"
                      : playerPosition - botPosition > 15
                        ? "🏃 Fast Runner!"
                        : "👍 Close Race!"}
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
