import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Title, Button, Snackbar } from '@telegram-apps/telegram-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, CalendarIcon, CheckCircle, RefreshCw, HandIcon, StarIcon, CrownIcon, Palette, AlertTriangle, LockIcon, Star, TrendingUp, Zap } from 'lucide-react';
import StatsModal from './StatsModal';
import { Task, LevelInfo } from '@/gameData';
import { SKINS } from '../config/skins';
import { purchaseSkin } from '@/services/skinService';
import { saveWalletAddress, getWalletAddresses, WalletType } from '@/playerSupabase';
import { WalletSection } from './WalletSection';


interface HoldComponentProps {
  user: {
    id: number;
    photoUrl?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  levelInfo: LevelInfo;
  balance: number;
  rewards: number;
  energy: number;
  maxEnergy: number;
  cooldown: boolean;
  cooldownTimeRemaining: number;
  isHolding: boolean;
  setIsHolding: React.Dispatch<React.SetStateAction<boolean>>;
  setRewards: React.Dispatch<React.SetStateAction<number>>;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setCooldown: React.Dispatch<React.SetStateAction<boolean>>;
  setCooldownTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  handleBuyUpgrade: (upgradeId: string, baseCost: number) => Promise<void>;
  handleMining: (newRewards: number, newEnergy: number) => void;
  handleHarvest: () => Promise<void>;
  showSnackbar: (message: string, description: string) => void;
  levels: { name: string; minBalance: number; maxBalance: number; level: number }[];
  getLevel: (balance: number) => LevelInfo;
  setLevelInfo: React.Dispatch<React.SetStateAction<LevelInfo>>;
  comboTimeLimit: number;
  tasksCompleted: number;
  totalScorpionsCaught: number;
  setTotalScorpionsCaught: React.Dispatch<React.SetStateAction<number>>;
  currentEvent: { id: string; name: string; description: string; startTime: Date; endTime: Date } | null;
  upgradeLevels: { [key: string]: { level: number; lastResetTime: number } };
  tasks: Task[];
  isSnackbarVisible: boolean;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  snackbarMessage: string;
  snackbarDescription: string;
  cooldownTime: number; // Add this prop
  playerData: any;
  saveGameState: (data: any) => Promise<void>;
}

const ENERGY_REGENERATION_RATE = 1; // 1% per second
const ENERGY_REGENERATION_INTERVAL = 1000; // 1 second

// Add a constant for the level bonus multiplier
const LEVEL_BONUS_MULTIPLIER = 0.1; // 10% per level

// Then update the level bonus calculation
const getLevelBonus = (level: number) => {
  return 1 + (level * LEVEL_BONUS_MULTIPLIER);
};

import { SkinStore } from './SkinStore';
import { suistakeLogo } from '@/images';

const AchievementsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  levels: { name: string; minBalance: number; maxBalance: number; level: number }[];
  currentLevel: number;
}> = ({ isOpen, onClose, levels, currentLevel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-orange-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CrownIcon size={24} className="text-yellow-500" />
              All Achievements
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {levels.map((level) => (
              <motion.div
                key={level.level}
                className={`bg-gray-700/50 p-4 rounded-lg border ${
                  level.level <= currentLevel
                    ? 'border-green-500/50'
                    : 'border-orange-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      level.level <= currentLevel
                        ? 'bg-green-500/20'
                        : 'bg-gray-600/20'
                    }`}>
                      <span className={`text-lg font-bold ${
                        level.level <= currentLevel
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}>{level.level}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{level.name}</h4>
                      <p className="text-sm text-gray-400">
                        Required: {level.minBalance.toLocaleString()} 🦂
                      </p>
                    </div>
                  </div>
                  {level.level <= currentLevel && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


const HoldComponent: React.FC<HoldComponentProps> = ({
  user,
  levelInfo,
  balance,
  rewards,
  energy,
  maxEnergy,
  cooldown,
  cooldownTimeRemaining,
  isHolding,
  setIsHolding,
  setEnergy,
  setCooldown,
  setCooldownTimeRemaining,
  handleMining,
  handleHarvest,
  showSnackbar,
  levels,
  getLevel,
  setLevelInfo,
  tasksCompleted,
  totalScorpionsCaught,
  currentEvent,
  upgradeLevels: upgradeLevelsProp,
  isSnackbarVisible,
  setSnackbarVisible,
  snackbarMessage,
  snackbarDescription,
  saveGameState,
  cooldownTime,
  playerData
}) => {
  const [activeSkin, setActiveSkin] = useState(() => {
    return playerData?.activeSkin || 'default';
  });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [autoCatchInterval, setAutoCatchInterval] = useState<NodeJS.Timeout | null>(null);
  const autoCatcherLevel = (upgradeLevelsProp?.['8'] || { level: 0 }).level;

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const regenerationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const doubleRewardsActive = (upgradeLevelsProp?.['3'] || { level: 0 }).level > 0;

  const startHold = useCallback(() => {
    if (!cooldown && energy > 0) {
      setIsHolding(true);
    } else if (energy <= 0 && !cooldown) {
      const cooldownEndTime = Date.now() + (cooldownTime * 1000);
      setCooldown(true);
      setCooldownTimeRemaining(cooldownTime);
      
      saveGameState({
        energy: 0,
        cooldownEndTime: cooldownEndTime,
        lastUpdated: Date.now()
      });
    }
  }, [cooldown, energy, setIsHolding, setCooldown, setCooldownTimeRemaining, saveGameState, cooldownTime]);

  const stopHold = useCallback(() => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    // Only call harvest if there are rewards to collect
    if (rewards > 0) {
      handleHarvest();
    }
  }, [setIsHolding, handleHarvest, rewards]);

  const startEnergyRegeneration = useCallback(() => {
    if (regenerationIntervalRef.current) {
      clearInterval(regenerationIntervalRef.current);
    }

    regenerationIntervalRef.current = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + ENERGY_REGENERATION_RATE, maxEnergy);
        if (newEnergy === maxEnergy) {
          if (regenerationIntervalRef.current) {
            clearInterval(regenerationIntervalRef.current);
          }
        }
        return newEnergy;
      });
    }, ENERGY_REGENERATION_INTERVAL);
  }, [maxEnergy, setEnergy]);

  const handleAutoCatch = useCallback(() => {
    if (autoCatcherLevel === 0) return;
    
    if (energy >= 2 && !cooldown) {
      const baseReward = Math.floor(autoCatcherLevel * 2);
      const randomBonus = Math.floor(Math.random() * autoCatcherLevel);
      const totalReward = Math.floor(baseReward + randomBonus);
      
      const newEnergy = Math.max(0, energy - 2);
      
      handleMining(Math.floor(totalReward), Math.floor(newEnergy));
      
      if (newEnergy <= 0) {
        setCooldown(true);
        setCooldownTimeRemaining(cooldownTime);
        saveGameState({
          energy: Math.floor(newEnergy),
          cooldownEndTime: Math.floor(Date.now() + (cooldownTime * 1000)),
          lastUpdated: Math.floor(Date.now())
        });
      }
    }
  }, [autoCatcherLevel, energy, cooldown, handleMining, setCooldown, setCooldownTimeRemaining, saveGameState, cooldownTime]);

  useEffect(() => {
    if (autoCatcherLevel > 0) {
      if (autoCatchInterval) {
        clearInterval(autoCatchInterval);
      }
      
      const interval = setInterval(handleAutoCatch, 1000);
      setAutoCatchInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoCatcherLevel, handleAutoCatch]);

  useEffect(() => {
    if (isHolding && energy > 0) {
      let catchSpeed = 1000;
      let catchCount = 0;
  
      const performCatch = () => {
        if (energy <= 0) {
          stopHold();
          const cooldownEndTime = Date.now() + (cooldownTime * 1000);
          setCooldown(true);
          setCooldownTimeRemaining(cooldownTime);
          
          saveGameState({
            energy: 0,
            cooldownEndTime: cooldownEndTime,
            lastUpdated: Date.now()
          });
          return;
        }

        // Get active skin configuration
        const activeSkinConfig = SKINS.find(s => s.id === activeSkin);
        const skinMultiplier = activeSkinConfig?.rewardMultiplier || 1;

        const randomEnergyDrop = Math.floor(Math.random() * 2) + 1;
        const baseRewardMultiplier = doubleRewardsActive ? 4 : 2;
        
        const levelBonus = 1 + (levelInfo.level * 0.1);
        const comboBonus = 1 + (Math.min(catchCount, 20) * 0.05);
        
        // Add skin multiplier to calculation
        const newRewards = Math.floor(
          randomEnergyDrop * 
          baseRewardMultiplier * 
          levelBonus * 
          comboBonus * 
          skinMultiplier
        );
        
        const newEnergy = Math.max(0, energy - randomEnergyDrop);
        
        handleMining(newRewards, newEnergy);
  
        catchCount++;
        if (catchCount % 3 === 0 && catchSpeed > 400) {
          catchSpeed = Math.max(400, catchSpeed - 150);
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = setInterval(performCatch, catchSpeed);
          }
        }

        if (newEnergy <= 0) {
          stopHold();
          const cooldownEndTime = Date.now() + (cooldownTime * 1000);
          setCooldown(true);
          setCooldownTimeRemaining(cooldownTime);
          
          saveGameState({
            energy: 0,
            cooldownEndTime: cooldownEndTime,
            lastUpdated: Date.now()
          });
          
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
        }
      };
  
      const initialDelay = setTimeout(() => {
        performCatch();
        if (!holdIntervalRef.current && energy > 0) {
          holdIntervalRef.current = setInterval(performCatch, catchSpeed);
        }
      }, 500);
  
      return () => {
        clearTimeout(initialDelay);
        if (holdIntervalRef.current) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
      };
    }
  }, [isHolding, energy, doubleRewardsActive, handleMining, stopHold, setCooldown, setCooldownTimeRemaining, saveGameState, cooldownTime, levelInfo.level, activeSkin]);

  useEffect(() => {
    if (cooldown) {
      const cooldownTimer = setInterval(() => {
        setCooldownTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(cooldownTimer);
            setCooldown(false);
            startEnergyRegeneration();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(cooldownTimer);
    }
  }, [cooldown, setCooldown, setCooldownTimeRemaining, startEnergyRegeneration]);

  useEffect(() => {
    if (!cooldown && energy < maxEnergy) {
      startEnergyRegeneration();
    }

    return () => {
      if (regenerationIntervalRef.current) {
        clearInterval(regenerationIntervalRef.current);
      }
    };
  }, [cooldown, energy, maxEnergy, startEnergyRegeneration]);

  useEffect(() => {
    const newLevelInfo = getLevel(balance);
    if (newLevelInfo.level > levelInfo.level) {
      setShowLevelUp(true);
      showSnackbar('Level Up!', `You are now ${newLevelInfo.name}`);
      setTimeout(() => setShowLevelUp(false), 5000);
      setLevelInfo(newLevelInfo);
    }
  }, [balance, getLevel, levelInfo.level, setLevelInfo, showSnackbar]);

  useEffect(() => {
    if (isHolding) {
      const interval = setInterval(() => {
        setParticles((currentParticles) => [
          ...currentParticles,
          { id: Math.random(), x: Math.random() * 250, y: Math.random() * 250 },
        ]);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isHolding]);

  useEffect(() => {
    if (particles.length > 20) {
      setParticles((currentParticles) => currentParticles.slice(1));
    }
  }, [particles]);

  const formatCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const BalanceDisplay: React.FC<{ balance: number }> = ({ balance }) => (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-4xl font-bold text-[#fff]">
        {formatNumber(balance)}
      </p>
    </motion.div>
  );

  // Add status display
  const renderAutoCatcherStatus = () => {
    if (autoCatcherLevel === 0) return null;

    const perSecond = autoCatcherLevel * 1.5;
    const perMinute = perSecond * 60;

    return (
      <div className="mt-4 bg-gray-800 p-4 rounded-lg border-l-4 border-[#f48d2f]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandIcon className="text-[#f48d2f] animate-pulse" size={20} />
            <span className="text-white font-medium">Auto Catcher Active</span>
          </div>
          <div className="text-sm bg-[#f48d2f] px-2 py-1 rounded-full text-white">
            Level {autoCatcherLevel}
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-300 flex items-center justify-between">
            <span>Catch Rate:</span>
            <span className="text-[#f48d2f] font-medium">{perSecond.toFixed(1)}/sec</span>
          </p>
          <p className="text-sm text-gray-300 flex items-center justify-between">
            <span>Projected:</span>
            <span className="text-[#f48d2f] font-medium">{perMinute.toFixed(0)}/min</span>
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-between">
            <span>Energy Cost:</span>
            <span>2 per catch</span>
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    // Check if auto-catcher upgrade is active
    const autoCatcherLevel = upgradeLevelsProp?.autoCatcher?.level || 0;
    
    if (autoCatcherLevel > 0) {
      intervalId = setInterval(() => {
        // Auto catch logic here
        if (!cooldown && energy > 0) {
          handleMining(rewards, energy);
        }
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [upgradeLevelsProp?.autoCatcher?.level, cooldown, energy, handleMining, rewards]);

  // Add these to your state variables
  const [ownedSkins, setOwnedSkins] = useState<string[]>(() => {
    // Initialize with player's owned skins from props or default
    return playerData?.ownedSkins || ['default'];
  });

  // Add purchase handler
  const handlePurchaseSkin = async (skinId: string) => {
    try {
      const skin = SKINS.find(s => s.id === skinId);
      if (!skin) return;
      
      await purchaseSkin(user.id, skinId, skin.price);
      setOwnedSkins(prev => [...prev, skinId]);
      await saveGameState({
        ...playerData,
        ownedSkins: [...ownedSkins, skinId]
      });
      showSnackbar('Skin Purchased!', `You now own the ${skin.name}`);
    } catch (error) {
      console.error('Error purchasing skin:', error);
      showSnackbar('Purchase Failed', 'Failed to purchase skin');
    }
  };

  // Add select handler
  const handleSelectSkin = async (skinId: string) => {
    try {
      await setActiveSkin(skinId);
      setActiveSkin(skinId);
      await saveGameState({
        ...playerData,
        activeSkin: skinId
      });
      const skin = SKINS.find(s => s.id === skinId);
      showSnackbar('Skin Selected!', `Now using ${skin?.name}`);
    } catch (error) {
      console.error('Error selecting skin:', error);
      showSnackbar('Selection Failed', 'Failed to select skin');
    }
  };

  // Modify the scorpion image to use the active skin
  const activeSkinConfig = SKINS.find(s => s.id === activeSkin);

  const [showSkinStore, setShowSkinStore] = useState(false);

  const [showAchievements, setShowAchievements] = useState(false);

  // Add this near the Game Helper Text section to show active multipliers
  const renderMultipliers = () => {
    const activeSkinConfig = SKINS.find(s => s.id === activeSkin);
    
    return (
      <motion.div 
        className="text-center mt-2 mb-4 sm:px-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-3 sm:p-4 border-2 border-orange-500/20 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
          <h3 className="text-gray-400 text-xs sm:text-sm mb-4 flex items-center justify-center gap-1 sm:gap-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
            Active Multipliers
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
          </h3>
          
          {/* Professional Grid Layout */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 auto-rows-fr">
            {/* Skin Bonus Card */}
            {activeSkinConfig && activeSkinConfig.rewardMultiplier > 1 && (
              <motion.div 
                className="relative col-span-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 px-2 sm:px-4 py-3 rounded-xl border border-yellow-500/20">
                  <div className="mb-1">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-yellow-400 uppercase tracking-wide mb-1">Skin Bonus</span>
                  <span className="text-lg sm:text-2xl font-bold text-yellow-500">
                    {activeSkinConfig.rewardMultiplier}x
                  </span>
                  <motion.div 
                    className="absolute inset-0 border-2 border-yellow-500/50 rounded-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Double Rewards Card */}
            {doubleRewardsActive && (
              <motion.div 
                className="relative col-span-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-blue-600/10 px-2 sm:px-4 py-3 rounded-xl border border-blue-500/20">
                  <div className="mb-1">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-blue-400 uppercase tracking-wide mb-1">Rewards</span>
                  <span className="text-lg sm:text-2xl font-bold text-blue-500">
                    {doubleRewardsActive ? '2x' : '1x'}
                  </span>
                  <motion.div 
                    className="absolute inset-0 border-2 border-blue-500/50 rounded-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Level Bonus Card */}
            <motion.div 
              className="relative col-span-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-500/10 to-green-600/10 px-2 sm:px-4 py-3 rounded-xl border border-green-500/20">
                <div className="mb-1">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-green-400 uppercase tracking-wide mb-1">Level Bonus</span>
                <span className="text-lg sm:text-2xl font-bold text-green-500">
                  {getLevelBonus(levelInfo.level).toFixed(1)}x
                </span>
                <motion.div 
                  className="absolute inset-0 border-2 border-green-500/50 rounded-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Total Multiplier Card */}
            <motion.div 
              className="relative col-span-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-600/10 px-2 sm:px-4 py-3 rounded-xl border border-orange-500/20">
                <div className="mb-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-orange-400 uppercase tracking-wide mb-1">Total Boost</span>
                <span className="text-lg sm:text-2xl font-bold text-orange-500">
                  {(
                    (activeSkinConfig?.rewardMultiplier || 1) *
                    (doubleRewardsActive ? 2 : 1) *
                    getLevelBonus(levelInfo.level)
                  ).toFixed(1)}x
                </span>
                <motion.div 
                  className="absolute inset-0 border-2 border-orange-500/50 rounded-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>

          {/* Optional: Add tooltip information */}
          <div className="mt-3 text-[10px] sm:text-xs text-gray-400">
            Hover over multipliers for more details
          </div>
        </div>
      </motion.div>
    );
  };

  // Add this state
  const [wallets, setWallets] = useState<{ [key in WalletType]?: string }>({});

  // Add this useEffect to load wallet addresses
  useEffect(() => {
    const loadWallets = async () => {
      if (!user) return;
      
      try {
        const savedWallets = await getWalletAddresses(user.id);
        setWallets(savedWallets);
      } catch (error) {
        console.error('Error loading wallets:', error);
        showSnackbar('Error', 'Failed to load wallet addresses');
      }
    };

    loadWallets();
  }, [user?.id]);

  // Update the handleSaveWallet function
  const handleSaveWallet = async (type: WalletType, address: string) => {
    try {
      await saveWalletAddress(user!.id, type, address);
      setWallets(prev => ({
        ...prev,
        [type]: address
      }));
      showSnackbar('Success', `${type} wallet address saved successfully!`);
    } catch (error) {
      console.error('Error saving wallet:', error);
      showSnackbar('Error', 'Failed to save wallet address');
      throw error;
    }
  };

  return (
    <div className="relative p-custom">
     
      <div className="flex justify-center mt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Title caps level="1" weight="1" className="text-5xl text-white">
            <BalanceDisplay balance={balance} />
          </Title>
          <p className="text-lg text-[#f48d2f]">
            Catching <strong>{rewards} scorpions</strong>
            {autoCatcherLevel > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2 inline-flex items-center text-sm bg-[#f48d2f]/20 px-2 py-1 rounded-full"
              >
                <HandIcon size={14} className="mr-1" />
                +{(autoCatcherLevel * 1.5).toFixed(1)}/s
              </motion.span>
            )}
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center mt-2">
        <div className="text-center">
          <div className="flex flex-col gap-4">
            <StatsModal
              userId={user.id.toString()}
              balance={balance}
              levelInfo={levelInfo}
              energy={energy}
              tasksCompleted={tasksCompleted}
              totalScorpionsCaught={totalScorpionsCaught}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
      <motion.div
      className={`relative w-[250px] h-[250px] rounded-full border-8 border-[#f48d2f] flex items-center justify-center cursor-pointer ${
        cooldown || energy <= 0 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onMouseDown={!cooldown && energy > 0 ? startHold : undefined}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={!cooldown && energy > 0 ? startHold : undefined}
      onTouchEnd={stopHold}
      onContextMenu={(e) => e.preventDefault()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
          <motion.img
            src={activeSkinConfig?.image || suistakeLogo }
            alt="Scorpion"
            className="w-48 h-48 object-cover no-select"
            animate={isHolding ? {
              scale: activeSkinConfig?.animation?.scale || [1, 1.1, 1],
              rotate: activeSkinConfig?.animation?.rotate || [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: activeSkinConfig?.animation?.duration || 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={activeSkinConfig?.animation?.glow ? {
              filter: `drop-shadow(0 0 10px ${activeSkinConfig.animation.glow})`
            } : {}}
          />
          <AnimatePresence>
            {isHolding && (
              <motion.div
                className="absolute inset-0 bg-[#f48d2f] opacity-30 rounded-full flex justify-center items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.3 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
              >
                <p className="text-white text-2xl font-bold">{rewards} Scorpions</p>
              </motion.div>
            )}
            {isHolding && particles.map((particle) => (
              <Particle key={particle.id} x={particle.x} y={particle.y} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

       {/* Modified status display section */}
       <div className="flex justify-between items-center mt-4">
        <div className={`px-4 py-1 rounded-full font-bold ${cooldown ? 'bg-red-500' : 'bg-[#f48d2f]'} text-white`}>
          {cooldown ? (
            <span className="flex items-center">
              <RefreshCw size={14} className="mr-2 animate-spin" />
              {formatCountdown(cooldownTimeRemaining)}
            </span>
          ) : (
            <span>{Math.floor(energy)}%</span>
          )}
        </div>
        <span className="text-[#f48d2f] font-semibold">
          {cooldown ? (
            <span className="text-sm"> <motion.button
          className="bg-[#f48d2f] hover:bg-[#e67e22] text-white p-2 rounded-full shadow-lg transition-all duration-300"
            onClick={() => setShowSkinStore(true)}
          >
            <div className="flex items-center justify-center gap-2">
              <Palette className="w-4 h-4 animate-pulse" />
              <span className="font-semibold whitespace-nowrap">Skin Store</span>
            </div>
          </motion.button>
          
          {showSkinStore && (
            <SkinStore
              playerId={user.id}
              balance={balance}
              ownedSkins={ownedSkins}
              activeSkin={activeSkin}
              onPurchase={handlePurchaseSkin}
              onSelect={handleSelectSkin}
              onClose={() => setShowSkinStore(false)}
            />
          )}</span>
          ) : (
            <span className="text-sm"> <motion.button
            className="bg-[#f48d2f] hover:bg-[#e67e22] text-white p-2 rounded-full shadow-lg transition-all duration-300"
              onClick={() => setShowSkinStore(true)}
            >
              <div className="flex items-center justify-center gap-2">
                <Palette className="w-4 h-4 animate-pulse" />
                <span className="font-semibold whitespace-nowrap">Skin Store</span>
              </div>
            </motion.button>
          
          {showSkinStore && (
            <SkinStore
              playerId={user.id}
              balance={balance}
              ownedSkins={ownedSkins}
              activeSkin={activeSkin}
              onPurchase={handlePurchaseSkin}
              onSelect={handleSelectSkin}
              onClose={() => setShowSkinStore(false)}
            />
          )}</span>
          )}
        </span>
      </div>

      {/* Modified energy/cooldown progress bar */}
      <div className="relative w-full h-6 bg-gray-700 rounded-full shadow-md overflow-hidden mb-2 mt-2">
        {cooldown ? (
          <motion.div
            className="absolute top-0 left-0 h-full bg-red-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(cooldownTimeRemaining / 300) * 100}%` }}
            transition={{ type: 'linear' }}
          />
        ) : (
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(energy / maxEnergy) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-md">
            {cooldown ? 'Cooldown' : `${Math.floor(energy)}%`}
          </span>
        </div>
      </div>
      {/* Game Helper Text */}
      <motion.div 
        className="text-center mt-2 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-orange-700/50">
          {cooldown ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw size={14} className="text-red-400 animate-spin" />
              <p className="text-gray-300 text-sm font-medium">
                <span className="text-red-400 font-bold">Overheated!</span> Taking a break to cool down...
              </p>
            </div>
          ) : energy <= 20 ? (
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              <p className="text-yellow-300 text-sm font-medium">
                Low energy ({Math.floor(energy)}%). Release to regenerate.
              </p>
            </div>
          ) : isHolding ? (
            <div className="flex items-center justify-center space-x-2 bg-black/30 px-4 py-2 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Zap size={14} className="text-green-400 animate-pulse" />
              <p className="text-green-300 text-sm font-medium tracking-wider uppercase">
                CATCHING SCORPION<span className="animate-pulse">⚡</span>
              </p>
            </div>
          ) : (
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 bg-[#f48d2f]/10 px-4 py-2 rounded-lg border border-[#f48d2f]/20">
                <HandIcon size={14} className="text-[#f48d2f] animate-bounce" />
                <p className="text-gray-300 text-sm font-medium">
                  <span className="text-[#f48d2f] font-bold">Click and hold</span> the scorpion to start mining
                  {autoCatcherLevel > 0 && (
                    <span className="inline-flex items-center ml-2 px-2 py-0.5 bg-[#f48d2f]/10 rounded-full border border-[#f48d2f]/20">
                      <span className="w-1.5 h-1.5 bg-[#f48d2f] rounded-full animate-pulse mr-1.5" />
                      <span className="text-[#f48d2f] font-medium">Auto-Catcher Lv.{autoCatcherLevel}</span>
                      <span className="text-gray-400 ml-1.5 text-xs">
                        ({(autoCatcherLevel * 1.5).toFixed(1)}/s)
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {currentEvent && (
        <div className="mt-4 bg-blue-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <CalendarIcon size={18} className="mr-2" />
            {currentEvent.name}
          </h3>
          <p>{currentEvent.description}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-xl"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="text-center space-y-3">
                <TrophyIcon className="w-12 h-12 mx-auto text-white animate-bounce" />
                <h2 className="text-3xl font-bold">Level Up!</h2>
                <p className="text-xl">You are now</p>
                <p className="text-2xl font-bold">{levelInfo.name}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Milestones & Achievements Section */}
      <div className="mt-4 space-y-4">
        {/* Progress Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-orange-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-white font-bold">Current Level</h4>
                <p className="text-sm text-gray-400">Rank Progress</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{levelInfo.level}</p>
              <p className="text-sm text-yellow-500">{levelInfo.name}</p>
            </div>
          </div>
          {/* XP Progress Bar */}
          <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((balance - levelInfo.minBalance) / (levelInfo.maxBalance - levelInfo.minBalance)) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{balance.toLocaleString()} 🦂</span>
            <span className="text-xs text-gray-400">{levelInfo.maxBalance.toLocaleString()} 🦂</span>
          </div>
        </div>
       
        {renderMultipliers()}

        {/* Upcoming Milestones */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-orange-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrophyIcon size={20} className="text-[#f48d2f]" />
              Next Milestones
            </h3>
            <span className="text-sm text-gray-400">
              {levels.filter(level => level.level > levelInfo.level).length} remaining
            </span>
          </div>

          <div className="space-y-3">
            {levels.filter(level => level.level > levelInfo.level).slice(0, 3).length > 0 ? (
              levels.filter(level => level.level > levelInfo.level).slice(0, 3).map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-gray-700/50 p-4 rounded-lg border border-orange-600/50 hover:border-[#f48d2f]/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f48d2f]/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#f48d2f]">{level.level}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{level.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-[#f48d2f]">
                            {level.minBalance.toLocaleString()} 🦂
                          </span>
                          <span className="text-xs text-gray-400">
                            ({(level.minBalance - balance).toLocaleString()} more)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <motion.div
                        className="w-2 h-2 bg-[#f48d2f] rounded-full absolute -top-1 -right-1"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <LockIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 relative w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f48d2f] to-yellow-500"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: `${(balance / level.minBalance) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-500/30"
              >
                <div className="text-center space-y-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <CrownIcon className="w-12 h-12 text-yellow-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-yellow-500">Maximum Level Achieved!</h3>
                  <p className="text-gray-400">You've mastered all available ranks</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 font-medium">Ultimate Scorpion Master</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-orange-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CrownIcon size={20} className="text-yellow-500" />
              Recent Achievements
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowAchievements(true)}
            >
              View All
            </motion.button>
          </div>

          <div className="space-y-3">
            {levels.filter(level => level.level <= levelInfo.level).slice(-3).reverse().map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/50 p-4 rounded-lg border border-orange-600/50 hover:border-green-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-500">{level.level}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{level.name}</h4>
                      <p className="text-sm text-gray-400">Level {level.level} Achieved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {isSnackbarVisible && (
        <Snackbar
          onClose={() => setSnackbarVisible(false)}
          duration={4000}
          description={snackbarDescription}
          after={<Button size="s" onClick={() => setSnackbarVisible(false)}>Close</Button>}
          className="snackbar-top"
        >
          <div>
            {snackbarMessage}
          </div>
        </Snackbar>
      )}
      {renderAutoCatcherStatus()}
      
      <AnimatePresence>
        {showAchievements && (
          <AchievementsModal
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
            levels={levels}
            currentLevel={levelInfo.level}
          />
        )}
      </AnimatePresence>
    
      <WalletSection
        wallets={wallets}
        onSave={handleSaveWallet}
        showSnackbar={showSnackbar}
        className="mt-4"
      />
    </div>
  );
};

const Particle: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <motion.div
    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
    initial={{ x, y, opacity: 1 }}
    animate={{
      x: x + (Math.random() - 0.5) * 100,
      y: y - 100 - Math.random() * 50,
      opacity: 0,
    }}
    transition={{ duration: 0.5 }}
  />
);

export default HoldComponent;