import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RockPaperScissorsProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

type Choice = "rock" | "paper" | "scissors";

export default function RockPaperScissors({
  betAmount,
  onGameComplete,
}: RockPaperScissorsProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [botChoice, setBotChoice] = useState<Choice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState<"win" | "lose" | "tie" | null>(null);

  const choices: { name: Choice; emoji: string; color: string }[] = [
    { name: "rock", emoji: "✊", color: "from-neon-red to-neon-orange" },
    { name: "paper", emoji: "✋", color: "from-neon-blue to-neon-purple" },
    { name: "scissors", emoji: "✌️", color: "from-neon-green to-neon-yellow" },
  ];

  const playGame = async (choice: Choice) => {
    setPlayerChoice(choice);
    setGameStarted(true);
    setIsPlaying(true);

    // Simulate thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const botChoices: Choice[] = ["rock", "paper", "scissors"];
    const botChoice = botChoices[Math.floor(Math.random() * 3)];
    setBotChoice(botChoice);

    // Determine winner
    let gameResult: "win" | "lose" | "tie";
    if (choice === botChoice) {
      gameResult = "tie";
    } else if (
      (choice === "rock" && botChoice === "scissors") ||
      (choice === "paper" && botChoice === "rock") ||
      (choice === "scissors" && botChoice === "paper")
    ) {
      gameResult = "win";
    } else {
      gameResult = "lose";
    }

    setResult(gameResult);
    setIsPlaying(false);

    setTimeout(() => {
      if (gameResult === "win") {
        onGameComplete(true, betAmount * 2);
      } else if (gameResult === "tie") {
        onGameComplete(true, betAmount); // Return bet on tie
      } else {
        onGameComplete(false);
      }
    }, 1500);
  };

  const getChoiceEmoji = (choice: Choice) => {
    return choices.find((c) => c.name === choice)?.emoji || "❓";
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card/90 to-card/60 border-primary/30">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 neon-purple">
          ✊✋✌️ Rock Paper Scissors
        </h2>

        {!gameStarted && (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">Choose your weapon!</p>

            <div className="grid grid-cols-1 gap-3">
              {choices.map((choice) => (
                <Button
                  key={choice.name}
                  onClick={() => playGame(choice.name)}
                  className={`bg-gradient-to-r ${choice.color} text-white hover:scale-105 transition-all`}
                  size="lg"
                >
                  <span className="text-2xl mr-2">{choice.emoji}</span>
                  {choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {gameStarted && (
          <div className="space-y-6">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">You</p>
                <motion.div
                  className="text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {getChoiceEmoji(playerChoice!)}
                </motion.div>
              </div>

              <div className="text-4xl neon-yellow">VS</div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Bot</p>
                <motion.div
                  className="text-6xl"
                  animate={
                    isPlaying
                      ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                  }}
                >
                  {isPlaying ? "🤖" : getChoiceEmoji(botChoice!)}
                </motion.div>
              </div>
            </div>

            {isPlaying && (
              <motion.p
                className="text-lg font-cyber neon-yellow"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Bot is thinking...
              </motion.p>
            )}

            {result && !isPlaying && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p
                  className={`text-3xl font-bold ${
                    result === "win"
                      ? "text-neon-green"
                      : result === "tie"
                        ? "text-neon-yellow"
                        : "text-neon-red"
                  }`}
                >
                  {result === "win"
                    ? "🎉 YOU WIN!"
                    : result === "tie"
                      ? "🤝 IT'S A TIE!"
                      : "😔 YOU LOSE"}
                </p>
                {result === "win" && (
                  <p className="text-lg text-neon-green mt-2">
                    Won: ${(betAmount * 2).toFixed(2)}
                  </p>
                )}
                {result === "tie" && (
                  <p className="text-lg text-neon-yellow mt-2">
                    Bet returned: ${betAmount.toFixed(2)}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
