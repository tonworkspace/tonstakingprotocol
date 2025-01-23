import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { suistakeLogo } from "../images";
import { Loader2, Sparkles } from 'lucide-react';

// Loading phases configuration
const loadingPhases = [
  { title: "Initializing", color: "text-blue-400" },
  { title: "Loading Assets", color: "text-green-400" },
  { title: "Syncing Data", color: "text-purple-400" },
  { title: "Finalizing", color: "text-orange-400" }
];

// Loading tips
const loadingTips = [
  "Stake TON to earn daily rewards",
  "Higher stakes earn better rewards",
  "Compound your earnings for maximum gains",
  "Check your rewards accumulation in real-time"
];

const LoadingSplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  // Progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Update phase based on progress
  useEffect(() => {
    setCurrentPhase(Math.floor(progress / 25));
  }, [progress]);

  // Rotate tips
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(tipTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2F] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <motion.div className="text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img src={suistakeLogo} alt="Logo" className="w-24 h-24 mx-auto" />
          <h1 className="mt-4 text-4xl font-bold text-white">TON Stake It</h1>
        </motion.div>

        {/* Phases */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {loadingPhases.map((phase, index) => (
            <motion.div
              key={index}
              className={`p-2 rounded-lg text-center ${
                index <= currentPhase ? phase.color : 'text-gray-600'
              }`}
              animate={{
                opacity: index <= currentPhase ? 1 : 0.5,
                scale: index === currentPhase ? 1.05 : 1,
              }}
            >
              <div className="text-xs">{phase.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600"
            style={{ width: `${progress}%` }}
            initial={{ width: '0%' }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Loading Status */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Loading...</span>
          </div>
          <span className="text-orange-500 font-medium">{progress}%</span>
        </div>

        {/* Tips */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-gray-400 text-sm"
          >
            <Sparkles className="w-4 h-4 inline mr-2 text-orange-400" />
            {loadingTips[currentTip]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoadingSplashScreen;