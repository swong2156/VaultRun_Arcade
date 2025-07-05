import { motion } from "framer-motion";
import { useTelegram } from "@/context/TelegramContext";

export default function TelegramLoadingScreen() {
  const { isInTelegram, user } = useTelegram();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col items-center justify-center p-4">
      {/* Telegram Logo Animation */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="text-8xl mb-4">📱</div>
      </motion.div>

      {/* VaultRun Logo */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-gaming font-black neon-green mb-2">
          ⚡ VaultRun ⚡
        </h1>
        <p className="text-xl text-neon-blue">Launching in Telegram...</p>
      </motion.div>

      {/* User Welcome */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-lg text-muted-foreground">
            Welcome back,{" "}
            <span className="text-neon-green font-bold">{user.first_name}</span>
            !
          </p>
          {isInTelegram && (
            <p className="text-sm text-neon-blue mt-2">
              🎮 Ready to play in Telegram
            </p>
          )}
        </motion.div>
      )}

      {/* Loading Animation */}
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="text-sm text-muted-foreground mt-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Initializing arcade...
      </motion.p>

      {/* Platform Info */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>🎰</span>
          <span>30 Games Available</span>
          <span>•</span>
          <span>📱</span>
          <span>Telegram Optimized</span>
        </div>
      </motion.div>
    </div>
  );
}
