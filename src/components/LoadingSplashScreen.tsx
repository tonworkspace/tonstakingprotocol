import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Sparkles, Shield, Sword, Compass, Star } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import ScorpionLogo from './ScorpionLogo';

interface Profile {
  avatar: string;
  username: string;
  firstName: string;
  lastName: string;
  telegramId: number;
  locale: 'en' | 'ru';
  token: string;
  params: { [key: string]: string };
  sessionId: string;
  currentGameStarted: number;
}

// Update the RoadmapItem interface to include all required properties
interface RoadmapItem {
    phase: string;
    title: string;
    items: string[];
    status: 'completed' | 'in-progress' | 'upcoming';
}

// Keep only the first declaration with proper typing
const roadmapData: RoadmapItem[] = [
  {
    phase: "Phase 1",
    title: "Foundation & Community",
    items: [
      "Launch Official Website & Whitepaper",
      "Social Media Channels Setup",
      "Community Building on Telegram",
      "Initial Team Formation & Advisors",
    ],
    status: "completed"
  },
  {
    phase: "Phase 2",
    title: "Token & Economics",
    items: [
      "Smart Contract Development & DYOR",
      "NFT Smart Contracts Implementation",
      "Token Generation Event",
      "Initial DEX Offering (IDO)",
      "CEX Listings Campaign"
    ],
    status: "in-progress"
  },
  {
    phase: "Phase 3",
    title: "Game Development",
    items: [
      "Core Game Mechanics Development",
      "Staking Mechanism Implementation",
      "Marketplace Development",
      "Game Asset Creation",
      "Closed Alpha Testing"
    ],
    status: "upcoming"
  },
  {
    phase: "Phase 4",
    title: "Platform Launch",
    items: [
      "Open Beta Testing",
      "Security Audits & Optimization",
      "Full Game Launch",
      "Mobile Version Development",
      "Cross-chain Integration"
    ],
    status: "upcoming"
  },
  {
    phase: "Phase 5",
    title: "Expansion",
    items: [
      "New Game Modes & Features",
      "Tournament System Implementation",
      "DAO Governance Launch",
      "Regional Tournaments",
      "Strategic Partnerships"
    ],
    status: "upcoming"
  }
];

// Enhanced loading tips with categories
const loadingTips = [
  { text: "The ancient scorpion tribes ruled these lands for millennia...", category: "Lore" },
  { text: "Upgrade your pincers for devastating critical strikes", category: "Combat" },
  { text: "Desert storms provide cover but drain your energy faster", category: "Survival" },
  { text: "Join a clan to access exclusive territory raids", category: "Multiplayer" },
  { text: "Rare golden scarabs can be traded for legendary gear", category: "Items" },
];

// Loading phases with custom icons and descriptions
const loadingPhases = [
  { name: "Initializing World", icon: Compass, color: "text-blue-400" },
  { name: "Loading Assets", icon: Shield, color: "text-purple-400" },
  { name: "Preparing Combat Systems", icon: Sword, color: "text-red-400" },
  { name: "Synchronizing Data", icon: Star, color: "text-yellow-400" },
];

// Add this component within the same file or create a separate component
const RoadmapSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-12 px-4"
    >
      <div className="relative">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
            Development Roadmap
          </h2>
          <p className="text-gray-400 mt-2">Our journey to building Scorpion World</p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 transform -translate-y-1/2" />

          {roadmapData.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 + 0.5 }}
              className="relative"
            >
              {/* Phase Card */}
              <div className={`
                relative p-6 rounded-xl backdrop-blur-sm border
                ${phase.status === 'completed' ? 'bg-orange-500/10 border-orange-500/50' :
                  phase.status === 'in-progress' ? 'bg-orange-500/5 border-orange-500/30' :
                    'bg-gray-900/50 border-gray-700/50'}
              `}>
                {/* Phase Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-orange-400">
                    {phase.phase}
                  </span>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      phase.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'}
                  `}>
                    {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                  </span>
                </div>

                {/* Phase Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {phase.title}
                </h3>

                {/* Phase Items */}
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + itemIndex * 0.1 + 0.7 }}
                      className="flex items-center text-sm text-gray-400"
                    >
                      <span className={`
                        w-1.5 h-1.5 rounded-full mr-2
                        ${phase.status === 'completed' ? 'bg-green-400' :
                          phase.status === 'in-progress' ? 'bg-orange-400' :
                            'bg-gray-400'}
                      `} />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                {/* Progress Indicator */}
                {phase.status === 'in-progress' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500/20 rounded-b-xl overflow-hidden"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-orange-500"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSplashScreen: React.FC = () => {
  const { error, refreshTasks } = useAuth();
  const [loadingStage, setLoadingStage] = useState('Initializing');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [showTip, setShowTip] = useState(true);

  // Listen for user profile response
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      try {
        const playdeck = data?.playdeck;
        if (!playdeck?.value) return;

        if (playdeck.method === 'getUserProfile') {
          setUserProfile(playdeck.value);
          setLoadingProgress(prev => Math.min(prev + 20, 100));
        }
      } catch (err) {
        console.error('Error handling message:', err);
        // Use a more generic error check
        const errorMessage = err && typeof err === 'object' && 'message' in err 
          ? err.message 
          : 'Unknown error occurred';
        setLoadingStage(`Error: ${errorMessage}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const loadStages = async () => {
      try {
        const parent = window.parent;
        
        // Start loading and request user profile
        parent.postMessage({ playdeck: { method: 'loading' } }, '*');
        parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');

        // Stage 1: Profile Loading (0-20%)
        setLoadingStage('Loading profile');
        for (let i = 0; i <= 20; i += 5) {
          setLoadingProgress(i);
          parent.postMessage({ playdeck: { method: 'loading', value: i } }, '*');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Stage 2: Authentication (21-50%)
        setLoadingStage('Authenticating');
        for (let i = 21; i <= 50; i += 5) {
          setLoadingProgress(i);
          parent.postMessage({ playdeck: { method: 'loading', value: i } }, '*');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Stage 3: Refresh Tasks (51-65%)
        setLoadingStage('Refreshing tasks');
        if (refreshTasks) {
          await refreshTasks();
        }
        for (let i = 51; i <= 65; i += 5) {
          setLoadingProgress(i);
          parent.postMessage({ playdeck: { method: 'loading', value: i } }, '*');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Stage 4: Game Data (66-80%)
        if (userProfile) {
          setLoadingStage('Loading game data');
          for (let i = 66; i <= 80; i += 5) {
            setLoadingProgress(i);
            parent.postMessage({ playdeck: { method: 'loading', value: i } }, '*');
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        // Final Stage (81-100%)
        setLoadingStage('Preparing game');
        for (let i = 81; i <= 100; i += 5) {
          setLoadingProgress(i);
          parent.postMessage({ playdeck: { method: 'loading', value: i } }, '*');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (err) {
        console.error('Error in loading stages:', err);
        const errorMessage = err && typeof err === 'object' && 'message' in err 
          ? err.message 
          : 'Failed to load game';
        setLoadingStage(`Error: ${errorMessage}`);
      }
    };

    loadStages();
  }, [userProfile, refreshTasks]);

  // Update loading phases based on progress
  useEffect(() => {
    setActivePhase(Math.floor(loadingProgress / 25));
  }, [loadingProgress]);

  // Rotate tips with fade effect
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setShowTip(false);
      setTimeout(() => {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
        setShowTip(true);
      }, 500);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-200 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center z-10"
        >
          <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Reload Required</h1>
          <p className="text-center max-w-md">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Consistent noise overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Glowing orbs in corners */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Game Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 md:mb-12 relative text-center"
        >
          <div className="flex flex-col items-center">
            <ScorpionLogo />
            <h1 className="mt-4 text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
              SCORPION WORLD
            </h1>
          </div>
          <motion.div
            className="absolute -inset-4 opacity-50"
            animate={{
              filter: ["blur(4px)", "blur(8px)", "blur(4px)"],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-orange-500 absolute top-0 right-0" />
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-orange-500 absolute bottom-0 left-0" />
          </motion.div>
        </motion.div>

        {/* Loading Progress Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md md:max-w-3xl bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6 shadow-xl"
        >
          {/* Loading Phases */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
            {loadingPhases.map((phase, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-2 md:p-4 rounded-lg ${
                  index <= activePhase ? 'bg-gray-800/50' : 'bg-gray-900/30'
                }`}
                animate={{
                  scale: index === activePhase ? 1.05 : 1,
                  opacity: index <= activePhase ? 1 : 0.5,
                }}
              >
                <phase.icon className={`w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 ${phase.color}`} />
                <span className="text-xs md:text-sm text-gray-400">{phase.name}</span>
                {index <= activePhase && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1 h-1 bg-orange-500 rounded-full mt-1 md:mt-2"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Progress Bar */}
          <div className="relative h-3 md:h-4 bg-gray-900/50 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"
              initial={{ x: '-100%' }}
              animate={{ x: `${loadingProgress - 100}%` }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-500, 500] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Loading Status */}
          <div className="mt-3 md:mt-4 flex justify-between items-center text-gray-400">
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-2 text-orange-500" />
              </motion.div>
              <span className="text-sm md:text-base">{loadingStage}</span>
            </div>
            <span className="text-orange-500 font-bold text-sm md:text-base">{loadingProgress}%</span>
          </div>

          {/* Loading Tips */}
          <AnimatePresence mode="wait">
            {showTip && (
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 md:mt-8 text-center"
              >
                <span className="text-orange-500 text-xs md:text-sm font-semibold">
                  {loadingTips[currentTip].category}
                </span>
                <p className="text-gray-400 mt-1 text-xs md:text-sm">{loadingTips[currentTip].text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Profile Section - Only show when profile is loaded */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 md:mt-8 flex items-center space-x-3 md:space-x-4"
          >
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full ring-2 ring-orange-500/50"
            />
            <div>
              <h3 className="text-white font-medium text-sm md:text-base">{userProfile.firstName}</h3>
              <p className="text-gray-400 text-xs md:text-sm">@{userProfile.username}</p>
            </div>
          </motion.div>
        )}

        {/* Add Roadmap Section */}
        <RoadmapSection />
      </div>
    </div>
  );
};

export default LoadingSplashScreen;