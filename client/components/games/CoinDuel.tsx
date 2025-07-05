import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CoinDuelProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function CoinDuel({ betAmount, onGameComplete }: CoinDuelProps) {
  const [gamePhase, setGamePhase] = useState<
    "ready" | "duel" | "reveal" | "result"
  >("ready");
  const [playerFlip, setPlayerFlip] = useState<"heads" | "tails" | null>(null);
  const [botFlip, setBotFlip] = useState<"heads" | "tails" | null>(null);
  const [playerCoin, setPlayerCoin] = useState<"heads" | "tails" | null>(null);
  const [botCoin, setBotCoin] = useState<"heads" | "tails" | null>(null);
  const [winner, setWinner] = useState<"player" | "bot" | "tie" | null>(null);

  const startDuel = () => {
    setGamePhase("duel");
    // Bot makes its choice immediately
    setBotFlip(Math.random() > 0.5 ? "heads" : "tails");
  };

  const makeChoice = (choice: "heads" | "tails") => {
    setPlayerFlip(choice);
    setGamePhase("reveal");

    // Start coin flip animation
    setTimeout(() => {
      // Generate coin results
      const playerResult = Math.random() > 0.5 ? "heads" : "tails";
      const botResult = Math.random() > 0.5 ? "heads" : "tails";

      setPlayerCoin(playerResult);
      setBotCoin(botResult);

      // Determine winner based on coin results
      let gameWinner: "player" | "bot" | "tie";
      if (playerResult === botResult) {
        gameWinner = "tie";
      } else {
        // Higher value wins (heads > tails for simplicity)
        gameWinner =
          playerResult === "heads" && botResult === "tails"
            ? "player"
            : botResult === "heads" && playerResult === "tails"
              ? "bot"
              : "tie";
      }

      setWinner(gameWinner);
      setGamePhase("result");

      setTimeout(() => {
        if (gameWinner === "player") {
          onGameComplete(true, betAmount * 1.9); // Slight edge for player
        } else if (gameWinner === "tie") {
          onGameComplete(true, betAmount); // Return bet on tie
        } else {
          onGameComplete(false);
        }
      }, 2000);
    }, 3000);
  };

  const getBotAvatar = () => {
    const avatars = ["🤖", "👾", "🎭", "🎯", "⚡"];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const [botAvatar] = useState(getBotAvatar());

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-blue">
          🤺 Coin Duel
        </h2>

        {gamePhase === "ready" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Face off against the AI in a coin flip duel!
            </p>

            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2">Duel Rules:</h3>
              <div className="text-sm space-y-1">
                <p>🪙 Both players flip coins</p>
                <p>👑 Higher result wins</p>
                <p>🤝 Ties return your bet</p>
                <p>🎯 1.9x payout for wins</p>
              </div>
            </div>

            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-sm font-bold">YOU</p>
              </div>
              <div className="text-2xl neon-red">VS</div>
              <div className="text-center">
                <div className="text-4xl mb-2">{botAvatar}</div>
                <p className="text-sm font-bold">AI</p>
              </div>
            </div>

            <Button
              onClick={startDuel}
              className="bg-gradient-to-r from-neon-blue to-neon-purple text-white"
              size="lg"
            >
              ⚔️ START DUEL
            </Button>
          </div>
        )}

        {gamePhase === "duel" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              The AI has made its choice. Choose your coin side!
            </p>

            <div className="flex justify-around items-center">
              <div className="text-center">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-sm font-bold text-blue-400">YOU</p>
                <p className="text-xs text-muted-foreground">
                  Choose your side
                </p>
              </div>
              <div className="text-2xl neon-red">VS</div>
              <div className="text-center">
                <div className="text-4xl mb-2">{botAvatar}</div>
                <p className="text-sm font-bold text-red-400">AI</p>
                <p className="text-xs text-green-400">Ready to flip!</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => makeChoice("heads")}
                className="bg-gradient-to-r from-neon-yellow to-yellow-400 text-black h-20 text-xl font-bold"
              >
                🪙 HEADS
              </Button>
              <Button
                onClick={() => makeChoice("tails")}
                className="bg-gradient-to-r from-neon-orange to-orange-400 text-white h-20 text-xl font-bold"
              >
                🔶 TAILS
              </Button>
            </div>
          </div>
        )}

        {gamePhase === "reveal" && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Coins are flipping...
            </p>

            <div className="flex justify-around items-center">
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-2"
                  animate={{ rotateY: [0, 180, 360, 540, 720] }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  🪙
                </motion.div>
                <p className="text-sm font-bold text-blue-400">YOU</p>
                <p className="text-xs">Called: {playerFlip?.toUpperCase()}</p>
              </div>

              <div className="text-2xl neon-yellow">🆚</div>

              <div className="text-center">
                <motion.div
                  className="text-6xl mb-2"
                  animate={{ rotateY: [0, -180, -360, -540, -720] }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  🪙
                </motion.div>
                <p className="text-sm font-bold text-red-400">AI</p>
                <p className="text-xs">Called: {botFlip?.toUpperCase()}</p>
              </div>
            </div>

            <motion.p
              className="text-lg font-cyber neon-yellow"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              Duel in progress...
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
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">
                    {playerCoin === "heads" ? "🪙" : "🔶"}
                  </div>
                  <p className="text-sm font-bold text-blue-400">YOU</p>
                  <p className="text-xs">{playerCoin?.toUpperCase()}</p>
                </div>

                <div className="text-center">
                  <div
                    className={`text-3xl ${
                      winner === "player"
                        ? "text-green-400"
                        : winner === "bot"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {winner === "player"
                      ? "🏆"
                      : winner === "bot"
                        ? "💀"
                        : "🤝"}
                  </div>
                  <p className="text-sm font-bold">
                    {winner === "player"
                      ? "YOU WIN!"
                      : winner === "bot"
                        ? "AI WINS!"
                        : "TIE!"}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-5xl mb-2">
                    {botCoin === "heads" ? "🪙" : "🔶"}
                  </div>
                  <p className="text-sm font-bold text-red-400">AI</p>
                  <p className="text-xs">{botCoin?.toUpperCase()}</p>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-lg mb-2">Duel Results:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    Your coin: <span className="font-bold">{playerCoin}</span>
                  </p>
                  <p>
                    AI coin: <span className="font-bold">{botCoin}</span>
                  </p>
                  <p>
                    Outcome:{" "}
                    <span
                      className={`font-bold ${
                        winner === "player"
                          ? "text-green-400"
                          : winner === "bot"
                            ? "text-red-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {winner === "player"
                        ? "Victory"
                        : winner === "bot"
                          ? "Defeat"
                          : "Draw"}
                    </span>
                  </p>
                </div>
              </div>

              {winner === "player" && (
                <div>
                  <p className="text-lg text-green-400">1.9x Multiplier!</p>
                  <p className="text-lg text-green-400">
                    Won: ${(betAmount * 1.9).toFixed(2)}
                  </p>
                </div>
              )}

              {winner === "tie" && (
                <div>
                  <p className="text-lg text-yellow-400">Bet Returned!</p>
                  <p className="text-lg text-yellow-400">
                    ${betAmount.toFixed(2)}
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
