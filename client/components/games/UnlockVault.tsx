import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UnlockVaultProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function UnlockVault({
  betAmount,
  onGameComplete,
}: UnlockVaultProps) {
  const [selectedVault, setSelectedVault] = useState<number | null>(null);
  const [winningVault] = useState(Math.floor(Math.random() * 5)); // 1 in 5 chance
  const [gameStarted, setGameStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12); // 12 seconds to choose

  const vaultEmojis = ["💎", "💰", "🏆", "👑", "💍"];
  const emptyEmojis = ["📦", "🗃️", "📦", "🗃️", "📦"];

  useEffect(() => {
    if (gameStarted && !revealed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time's up - auto lose
            setRevealed(true);
            setTimeout(() => onGameComplete(false), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, revealed, onGameComplete]);

  const selectVault = (vaultIndex: number) => {
    if (revealed) return;

    setSelectedVault(vaultIndex);
    setGameStarted(true);
  };

  const openVault = async () => {
    if (selectedVault === null) return;

    setRevealed(true);

    // Add suspense delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isWin = selectedVault === winningVault;
    onGameComplete(isWin, isWin ? betAmount * 4.5 : 0); // 4.5x for 1/5 odds
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-yellow">
          🔒 Unlock the Vault
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              One vault contains treasure! Choose wisely...
            </p>
            <p className="text-sm text-neon-orange">
              ⏰ You have {timeLeft}s to choose and open!
            </p>

            {/* Vault Grid */}
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((vaultIndex) => (
                <motion.div
                  key={vaultIndex}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => selectVault(vaultIndex)}
                    variant="outline"
                    className={`aspect-square text-3xl border-primary/20 hover:border-primary ${
                      selectedVault === vaultIndex
                        ? "ring-2 ring-primary bg-primary/20"
                        : ""
                    }`}
                  >
                    🔒
                  </Button>
                </motion.div>
              ))}
            </div>

            {selectedVault !== null && (
              <div className="space-y-4">
                <p className="text-lg font-bold text-neon-blue">
                  Selected vault #{selectedVault + 1}
                </p>
                <Button
                  onClick={openVault}
                  className="bg-gradient-to-r from-neon-yellow to-neon-orange text-black font-bold"
                  size="lg"
                >
                  🗝️ Open Vault
                </Button>
              </div>
            )}
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            {!revealed && (
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-lg text-neon-red font-bold">
                    ⏰ {timeLeft}s remaining!
                  </p>
                </div>

                <p className="text-lg">
                  Opening vault #{selectedVault! + 1}...
                </p>

                <motion.div
                  className="text-6xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🔓
                </motion.div>

                <motion.p
                  className="text-lg font-cyber neon-yellow"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  Unlocking vault...
                </motion.p>
              </div>
            )}

            {revealed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="space-y-4">
                  {/* Show all vaults revealed */}
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((vaultIndex) => (
                      <div
                        key={vaultIndex}
                        className={`aspect-square flex items-center justify-center text-3xl rounded-lg border-2 ${
                          vaultIndex === selectedVault
                            ? "border-primary bg-primary/20"
                            : "border-muted"
                        } ${
                          vaultIndex === winningVault
                            ? "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20"
                            : ""
                        }`}
                      >
                        {vaultIndex === winningVault
                          ? vaultEmojis[vaultIndex]
                          : emptyEmojis[vaultIndex]}
                      </div>
                    ))}
                  </div>

                  <div className="text-6xl">
                    {selectedVault === winningVault ? "🎉" : "😔"}
                  </div>

                  <h3
                    className={`text-2xl font-bold ${
                      selectedVault === winningVault
                        ? "text-neon-green"
                        : "text-neon-red"
                    }`}
                  >
                    {selectedVault === winningVault
                      ? "TREASURE FOUND!"
                      : "EMPTY VAULT!"}
                  </h3>

                  <div className="text-center">
                    <p className="text-lg">
                      You opened:{" "}
                      <span className="font-bold">
                        Vault #{selectedVault! + 1}
                      </span>
                    </p>
                    <p className="text-lg">
                      Treasure was in:{" "}
                      <span className="font-bold text-neon-yellow">
                        Vault #{winningVault + 1}
                      </span>
                    </p>
                  </div>

                  {selectedVault === winningVault && (
                    <div>
                      <p className="text-lg text-neon-green">
                        4.5x Multiplier!
                      </p>
                      <p className="text-lg text-neon-green">
                        Won: ${(betAmount * 4.5).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
