import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BankRunProps {
  betAmount: number;
  onGameComplete: (isWin: boolean, winAmount?: number) => void;
}

export default function BankRun({ betAmount, onGameComplete }: BankRunProps) {
  const [gamePhase, setGamePhase] = useState<
    "planning" | "heist" | "escape" | "result"
  >("planning");
  const [vaultProgress, setVaultProgress] = useState(0);
  const [alarmLevel, setAlarmLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [cashGrabbed, setCashGrabbed] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    if (gamePhase === "heist" && !gameEnded) {
      const heistTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(heistTimer);
            if (vaultProgress >= 100) {
              setGamePhase("escape");
              setTimeLeft(6); // 6 seconds to escape
            } else {
              // Time's up, caught by security
              setCaught(true);
              endGame();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Increase alarm level over time
      const alarmTimer = setInterval(() => {
        setAlarmLevel((prev) => Math.min(100, prev + 2 + Math.random() * 3));
      }, 500);

      return () => {
        clearInterval(heistTimer);
        clearInterval(alarmTimer);
      };
    } else if (gamePhase === "escape" && !gameEnded) {
      const escapeTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(escapeTimer);
            // Check if escaped successfully
            if (alarmLevel < 80) {
              endGame(); // Successful escape
            } else {
              setCaught(true);
              endGame(); // Caught during escape
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(escapeTimer);
    }
  }, [gamePhase, gameEnded, vaultProgress, alarmLevel]);

  const startHeist = () => {
    setGamePhase("heist");
    setVaultProgress(0);
    setAlarmLevel(0);
    setCashGrabbed(0);
    setGameEnded(false);
    setCaught(false);
    setTimeLeft(10);
  };

  const crackVault = () => {
    if (gameEnded) return;

    setVaultProgress((prev) => {
      const progress = prev + 15 + Math.random() * 10; // 15-25% per click
      if (progress >= 100) {
        setCashGrabbed(betAmount * (2 + Math.random() * 2)); // 2-4x cash grabbed
        return 100;
      }
      return progress;
    });

    // Each crack increases alarm
    setAlarmLevel((prev) => Math.min(100, prev + 8 + Math.random() * 7));
  };

  const reduceAlarm = () => {
    if (gameEnded || gamePhase !== "escape") return;

    setAlarmLevel((prev) => Math.max(0, prev - 20 - Math.random() * 10));
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    setGamePhase("result");

    setTimeout(() => {
      if (caught) {
        onGameComplete(false);
      } else {
        // Successful heist
        const escapeBonus = alarmLevel < 30 ? 1.5 : alarmLevel < 60 ? 1.2 : 1;
        const finalAmount = cashGrabbed * escapeBonus;
        onGameComplete(true, finalAmount);
      }
    }, 2000);
  };

  const getAlarmColor = () => {
    if (alarmLevel > 80) return "from-red-600 to-red-800";
    if (alarmLevel > 50) return "from-orange-500 to-orange-700";
    if (alarmLevel > 20) return "from-yellow-500 to-yellow-700";
    return "from-green-500 to-green-700";
  };

  const getAlarmStatus = () => {
    if (alarmLevel > 80)
      return { text: "🚨 HIGH ALERT!", color: "text-red-400" };
    if (alarmLevel > 50) return { text: "⚠️ ALERT", color: "text-orange-400" };
    if (alarmLevel > 20)
      return { text: "🟡 CAUTION", color: "text-yellow-400" };
    return { text: "🟢 SECURE", color: "text-green-400" };
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-600/50">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-gaming font-bold mb-6 text-gray-300">
          🏦 Bank Run
        </h2>

        {gamePhase === "planning" && (
          <div className="space-y-6">
            <motion.div
              className="text-6xl"
              animate={{ rotateY: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏦
            </motion.div>

            <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-300 mb-2">
                🎯 HEIST PLAN
              </h3>
              <div className="text-sm text-gray-400 space-y-1">
                <p>🔓 Crack the vault (100% progress)</p>
                <p>⏰ 10 seconds before guards arrive</p>
                <p>🚨 Keep alarm levels low</p>
                <p>🏃 Escape before getting caught</p>
              </div>
            </div>

            <p className="text-lg text-gray-300">
              Rob the bank and escape with the cash! But be quick...
            </p>

            <Button
              onClick={startHeist}
              className="bg-gradient-to-r from-gray-700 to-gray-900 text-white border border-gray-600"
              size="lg"
            >
              💼 START HEIST
            </Button>
          </div>
        )}

        {gamePhase === "heist" && (
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <span className="text-blue-400 font-bold">
                Vault: {Math.round(vaultProgress)}%
              </span>
              <span className={`font-bold ${getAlarmStatus().color}`}>
                {getAlarmStatus().text}
              </span>
              <span className="text-red-400 font-bold">Time: {timeLeft}s</span>
            </div>

            {/* Vault Progress */}
            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-300">
                🔓 Cracking Vault...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-700 h-6 rounded-full transition-all duration-300"
                  style={{ width: `${vaultProgress}%` }}
                />
              </div>
            </div>

            {/* Alarm Level */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Security Alert Level</p>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${getAlarmColor()} h-4 rounded-full transition-all duration-300`}
                  style={{ width: `${alarmLevel}%` }}
                />
              </div>
            </div>

            <Button
              onClick={crackVault}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white h-16 text-xl font-bold"
              size="lg"
            >
              🔓 CRACK VAULT
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                {vaultProgress >= 100
                  ? "💰 Vault cracked! Prepare to escape!"
                  : alarmLevel > 80
                    ? "🚨 DANGER! Security incoming!"
                    : "🔧 Keep cracking, but watch the alarms!"}
              </p>
            </div>
          </div>
        )}

        {gamePhase === "escape" && (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-3">
              <p className="text-lg font-bold text-green-400">
                💰 Cash Secured: ${cashGrabbed.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-300">
                🏃 ESCAPING... {timeLeft}s
              </p>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${getAlarmColor()} h-4 rounded-full transition-all duration-300`}
                  style={{ width: `${alarmLevel}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">
                Alarm Level: {Math.round(alarmLevel)}%
              </p>
            </div>

            <Button
              onClick={reduceAlarm}
              className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white h-16 text-xl font-bold"
              size="lg"
            >
              🤫 STAY QUIET
            </Button>

            <div className="text-center">
              <p
                className={`text-sm font-bold ${
                  alarmLevel < 30
                    ? "text-green-400"
                    : alarmLevel < 60
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {alarmLevel < 30
                  ? "🤫 Stealth mode engaged"
                  : alarmLevel < 60
                    ? "⚠️ Moderate risk"
                    : "🚨 High chance of capture!"}
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
              <div className="text-6xl">{caught ? "🚔" : "💰"}</div>

              <h3
                className={`text-2xl font-bold ${
                  caught ? "text-red-400" : "text-green-400"
                }`}
              >
                {caught ? "BUSTED!" : "CLEAN GETAWAY!"}
              </h3>

              <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4">
                <p className="text-lg mb-2 text-gray-300">Heist Report:</p>
                <div className="space-y-1 text-sm">
                  <p>
                    🔓 Vault Progress:{" "}
                    <span className="font-bold">
                      {Math.round(vaultProgress)}%
                    </span>
                  </p>
                  <p>
                    💰 Cash Grabbed:{" "}
                    <span className="font-bold text-green-400">
                      ${cashGrabbed.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    🚨 Final Alarm:{" "}
                    <span className="font-bold">{Math.round(alarmLevel)}%</span>
                  </p>
                  <p>
                    🏃 Outcome:{" "}
                    <span
                      className={`font-bold ${
                        caught ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {caught ? "Arrested" : "Escaped"}
                    </span>
                  </p>
                </div>
              </div>

              {!caught && (
                <div>
                  <p className="text-lg text-green-400">
                    Escape Bonus:{" "}
                    {alarmLevel < 30 ? "1.5x" : alarmLevel < 60 ? "1.2x" : "1x"}
                  </p>
                  <p className="text-lg text-green-400">
                    Total Haul: $
                    {(
                      cashGrabbed *
                      (alarmLevel < 30 ? 1.5 : alarmLevel < 60 ? 1.2 : 1)
                    ).toFixed(2)}
                  </p>
                  <p className="text-sm text-green-300">
                    {alarmLevel < 30
                      ? "🥷 Master Thief!"
                      : alarmLevel < 60
                        ? "🏃 Smooth Operator!"
                        : "💨 Close Call!"}
                  </p>
                </div>
              )}

              {caught && (
                <p className="text-sm text-red-400">
                  🚔 Maybe plan better next time...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
