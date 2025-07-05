import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState("Connecting to Chain...");
  const [showLogo, setShowLogo] = useState(false);

  const loadingTexts = [
    "Connecting to Chain...",
    "Loading Vault...",
    "Spinning the Wheel...",
    "Decrypting your vault...",
    "Initializing Games...",
  ];

  useEffect(() => {
    // Show logo after 500ms
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 500);

    // Cycle through loading texts
    let textIndex = 0;
    const textTimer = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length;
      setCurrentText(loadingTexts[textIndex]);
    }, 800);

    // Navigate to dashboard after 4 seconds
    const navTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearInterval(textTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center overflow-hidden relative">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Floating coins */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: 0,
            }}
            animate={{
              y: -100,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {i % 4 === 0
              ? "🪙"
              : i % 4 === 1
                ? "💰"
                : i % 4 === 2
                  ? "⚡"
                  : "💎"}
          </motion.div>
        ))}
      </div>

      <div className="text-center z-10 relative">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={showLogo ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-gaming font-black neon-green"
            animate={{
              textShadow: [
                "0 0 10px hsl(var(--neon-green))",
                "0 0 30px hsl(var(--neon-green))",
                "0 0 10px hsl(var(--neon-green))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ VaultRun ⚡
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-bold text-neon-blue mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            The Ultimate Crypto Game Arcade
          </motion.p>
        </motion.div>

        {/* Loading text */}
        <motion.div
          key={currentText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground font-cyber"
        >
          {currentText}
        </motion.div>

        {/* Animated loading bar */}
        <motion.div
          className="w-64 h-2 bg-muted rounded-full mx-auto mt-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 2 }}
          />
        </motion.div>

        {/* Spinning vault door */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            className="text-6xl mx-auto w-20 h-20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🔒
          </motion.div>
        </motion.div>
      </div>

      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
        }}
      />
    </div>
  );
}
