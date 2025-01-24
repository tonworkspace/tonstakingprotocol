import React, { useState } from 'react';
import { ChevronRight, Star, Trophy, HandIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { premiumScorpion } from '@/images';

interface WizardStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface GuestWizardProps {
  onComplete: () => void;
}

const GuestWizard: React.FC<GuestWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const wizardSteps: WizardStep[] = [
    {
      title: "Welcome to Scorpion World",
      description: "Embark on an exciting journey where you'll catch scorpions, earn rewards, and compete with players worldwide.",
      icon: (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Star className="w-12 h-12 text-amber-400" />
        </motion.div>
      ),
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "Catch & Earn",
      description: "Master the art of scorpion catching! Hold longer to catch more scorpions and unlock special combo rewards.",
      icon: (
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity 
          }}
        >
          <motion.img 
            src={premiumScorpion}
            className="w-12 h-12"
            style={{ filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" }}
          />
        </motion.div>
      ),
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Level Up",
      description: "Complete quests, invite friends, and catch rare scorpions to level up. Each level unlocks new features and multipliers!",
      icon: (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotateY: [0, 360]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity
          }}
        >
          <Trophy className="w-12 h-12 text-purple-400" />
        </motion.div>
      ),
      color: "from-purple-500 to-blue-600"
    },
    {
      title: "Ready to Start",
      description: "Your adventure awaits! Start catching scorpions and become the ultimate Scorpion Master.",
      icon: (
        <motion.div
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}
        >
          <HandIcon className="w-12 h-12 text-emerald-400" />
        </motion.div>
      ),
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('wizardCompleted', 'true');
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Enhanced Glassmorphism Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -inset-[10px] opacity-40"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            background: `
              radial-gradient(circle at top left, ${wizardSteps[currentStep].color.split(' ')[0].replace('from-', 'rgb')}0.4) 0%, transparent 50%),
              radial-gradient(circle at bottom right, ${wizardSteps[currentStep].color.split(' ')[1].replace('to-', 'rgb')}0.4) 0%, transparent 50%)
            `,
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full
              ${i % 3 === 0 ? 'bg-orange-500/30' : i % 3 === 1 ? 'bg-purple-500/30' : 'bg-white/30'}`}
            animate={{
              y: [-20, window.innerHeight + 20],
              x: Math.random() * window.innerWidth,
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative w-[95%] max-w-md mx-auto p-6 sm:p-8 
            bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 
            shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.15)]
            transition-all duration-500"
        >
          {/* Hexagonal Grid Background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-10">
            <div className="absolute w-full h-full" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.1' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          {/* Enhanced Icon Container */}
          <div className="relative mb-6 sm:mb-8">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br ${wizardSteps[currentStep].color} p-3 sm:p-4
              shadow-lg transform hover:scale-105 transition-transform duration-300
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl`}>
              <div className="w-full h-full flex items-center justify-center">
                {wizardSteps[currentStep].icon}
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent 
              rounded-full blur-md opacity-50 animate-pulse" />
          </div>

          {/* Enhanced Typography */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 
            bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            {wizardSteps[currentStep].title}
          </h2>
          
          <p className="text-sm sm:text-base text-gray-300 text-center mb-6 sm:mb-8 leading-relaxed
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {wizardSteps[currentStep].description}
          </p>

          {/* Enhanced Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between relative z-10">
            <div className="flex gap-2">
              {wizardSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-6 sm:w-8 bg-gradient-to-r from-orange-500 to-amber-600' 
                      : 'w-1.5 sm:w-2 bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              className="relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full 
                font-medium text-white flex items-center justify-center gap-2 shadow-lg 
                hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer
                border border-orange-400/20 hover:border-orange-400/40"
            >
              {currentStep === wizardSteps.length - 1 ? "Let's Go!" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Enhanced Skip Button */}
          {currentStep < wizardSteps.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                localStorage.setItem('wizardCompleted', 'true');
                onComplete();
              }}
              className="relative z-10 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200 
                text-center w-full hover:bg-white/5 py-2 rounded-lg border border-gray-700/30 hover:border-gray-700/50 cursor-pointer"
            >
              Skip Tutorial
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuestWizard; 