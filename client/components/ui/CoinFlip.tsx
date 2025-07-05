import { motion } from "framer-motion";

interface CoinFlipProps {
  isFlipping: boolean;
  result?: "heads" | "tails";
}

export default function CoinFlip({ isFlipping, result }: CoinFlipProps) {
  return (
    <motion.div
      className="relative w-24 h-24 mx-auto"
      animate={
        isFlipping
          ? {
              rotateY: [0, 180, 360, 540, 720, 900, 1080],
              scale: [1, 1.2, 1, 1.2, 1, 1.2, 1],
            }
          : {}
      }
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-6xl">
        {isFlipping ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            🪙
          </motion.span>
        ) : result === "heads" ? (
          "🪙"
        ) : result === "tails" ? (
          "🔶"
        ) : (
          "🪙"
        )}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-blue/20 blur-xl"
        animate={
          isFlipping
            ? {
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }
            : { scale: 1, opacity: 0.2 }
        }
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
