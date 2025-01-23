import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, Snackbar, Button } from '@telegram-apps/telegram-ui';import { FaCoins, } from 'react-icons/fa';
import { initUtils } from '@telegram-apps/sdk-react';
import {
  ScorpionMiner,
  // UpgradeLevels,
  getScorpionMinerData,
  fetchPlayerTasks,
  createNewPlayer,
  completePlayerTask,
  updateScorpionMinerData,
  getReferralsByPlayer,
  handleDailyLogin,
  // buyUpgrade,
  checkAndResetUpgrades,
  // getActiveSpecialEvents,
  resetPlayerTasks,
} from '@/playerSupabase';
import InviteComponent from '@/components/InviteComponent';
import QuestComponent from '@/components/QuestComponent';
import { getLevel, Task, LevelInfo } from '@/gameData';
import useAuth from '@/hooks/useAuth';
import LoadingSplashScreen from '@/components/LoadingSplashScreen';
import LeaderBoardComponent from '@/components/LeaderBoardComponent';
import { RiMessage3Line } from 'react-icons/ri';
import { AiOutlineHome } from 'react-icons/ai';
import { BiNetworkChart } from 'react-icons/bi';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ErrorPage from '@/components/ErrorPage';
import AirdropComponent from '@/components/AirdropComponent';
import { OnchainWrapper } from '@/components/OnchainWrapper';
import { useTonConnectUI, useTonConnectModal } from '@tonconnect/ui-react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

type InfoCard = {
  id: number;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
};

const infoCards: InfoCard[] = [
  {
    id: 1,
    icon: '📚',
    title: 'How does it work?',
    description: 'Learn the basics of staking and earn passive income',
    bgColor: 'from-blue-500/10 to-purple-500/10'
  },
  {
    id: 2,
    icon: '📰',
    title: 'Latest Updates',
    description: 'Stay informed about new features and improvements',
    bgColor: 'from-green-500/10 to-emerald-500/10'
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Staking Strategy',
    description: 'Optimize your earnings with proven strategies',
    bgColor: 'from-orange-500/10 to-red-500/10'
  },
  {
    id: 4,
    icon: '🔒',
    title: 'Security Guide',
    description: 'Best practices to keep your assets safe',
    bgColor: 'from-pink-500/10 to-rose-500/10'
  }
];

export const IndexPage: React.FC = () => {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<ScorpionMiner | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [isHolding, setIsHolding] = useState(false);
  // const [rewards, setRewards] = useState(0);
  // const [energy, setEnergy] = useState(100);
  // const [cooldown, setCooldown] = useState(false);
  // const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  // const [maxEnergy, setMaxEnergy] = useState(100);
  // const [comboTimeLimit, setComboTimeLimit] = useState(30);
  // const [doubleRewardsTimeout, setDoubleRewardsTimeout] = useState<number | null>(null);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>(getLevel(0));
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarDescription, setSnackbarDescription] = useState('');
  const [linkClicked, setLinkClicked] = useState<{ [key: string]: boolean }>({});
  const [taskVerified] = useState<{ [key: string]: boolean }>({});
  const [tasksCompleted, setTasksCompleted] = useState(0);
  // const [totalScorpionsCaught, setTotalScorpionsCaught] = useState(0);
  const [referrals, setReferrals] = useState<Array<{ id: string | number; username: string }>>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  // const [, setDoubleRewardsActive] = useState<boolean>(false);
  const [, setIsSaving] = useState(false);
  // const [upgradeLevels, setUpgradeLevels] = useState<UpgradeLevels>({});
  // const [specialEvents, setSpecialEvents] = useState<any[]>([]);
  // const [showWizard, setShowWizard] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);
  // const [stakingRewards, setStakingRewards] = useState(0);
  // const [stakingAPY, setStakingAPY] = useState(5); // 5% APY as an example
  // const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [currentCard, setCurrentCard] = useState(0);

  const snackbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const COOLDOWN_TIME = 3 * 60 * 60;
  const SNACKBAR_DURATION = 4000;

  const showSnackbar = useCallback((message: string, description: string) => {
    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }
    setSnackbarMessage(message);
    setSnackbarDescription(description);
    setSnackbarVisible(true);
    snackbarTimeoutRef.current = setTimeout(() => {
      setSnackbarVisible(false);
    }, SNACKBAR_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (snackbarTimeoutRef.current) {
        clearTimeout(snackbarTimeoutRef.current);
      }
    };
  }, []);


  const initializePlayerData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let minerData = await getScorpionMinerData(user.id);
      if (!minerData) {
        minerData = await createNewPlayer(user.id, {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }

      if (minerData) {
        setPlayerData(minerData);
        const playerTasks = await fetchPlayerTasks(user.id);
        setTasks(playerTasks);
        setBalance(minerData.balance || 0);
        setLevelInfo(getLevel(minerData.balance || 0));
        // setEnergy(minerData.energy || 100);
        // setRewards(minerData.rewards || 0);
        setTasksCompleted(minerData.tasksCompleted || 0);
        // setTotalScorpionsCaught(minerData.totalScorpionsCaught || 0);
        // setUpgradeLevels(minerData.upgradeLevels || {});
        // setMaxEnergy(minerData.maxEnergy || 100);
        // setComboTimeLimit(minerData.comboTimeLimit || 30);

        // if (minerData.cooldownEndTime && minerData.cooldownEndTime > Date.now()) {
        //   const remainingTime = Math.floor((minerData.cooldownEndTime - Date.now()) / 1000);
        //   // setCooldownTimeRemaining(remainingTime);
        //   // setCooldown(true);
        // }

        setReferralLink(`https://t.me/scorpion_world_bot?start=${user.id}`);

        const { loginStreak, bonusReward } = await handleDailyLogin(user.id);
        if (bonusReward > 0) {
          showSnackbar('Daily Login Bonus!', `You've logged in for ${loginStreak} days in a row and earned ${bonusReward} scorpions!`);
        }

        // const events = await getActiveSpecialEvents();
        // setSpecialEvents(events);

        await checkAndResetUpgrades(user.id);
      } else {
        throw new Error('Failed to initialize player data');
      }
    } catch (err) {
      console.error('Failed to initialize player data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [user, showSnackbar]);

  useEffect(() => {
    initializePlayerData();
  }, [initializePlayerData]);

  const saveGameState = useCallback(async (updatedData: Partial<ScorpionMiner>) => {
    if (!playerData) return;

    setIsSaving(true);
    try {
      const dataToSave = {
        ...updatedData,
        upgradeLevels: updatedData.upgradeLevels || playerData.upgradeLevels,
      };
      await updateScorpionMinerData(playerData.id, dataToSave);
      setPlayerData(prevData => ({ ...prevData!, ...dataToSave }));
      console.log('Game state saved successfully:', dataToSave);
    } catch (error) {
      console.error('Error saving game state:', error);
      showSnackbar('Error', 'Failed to save game progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [playerData, showSnackbar]);

  // const handleMining = useCallback((newRewards: number, newEnergy: number) => {
  //   setRewards(prev => prev + newRewards);
  //   setEnergy(newEnergy);
  //   setTotalScorpionsCaught(prev => prev + newRewards);

  //   saveGameState({
  //     rewards: rewards + newRewards,
  //     energy: newEnergy,
  //     totalScorpionsCaught: totalScorpionsCaught + newRewards
  //   });
  // }, [rewards, totalScorpionsCaught, saveGameState]);

  // const handleHarvest = useCallback(async () => {
  //   if (!playerData || isSaving) return;

  //   const newBalance = balance + rewards;
  //   const newLevelInfo = getLevel(newBalance);

  //   const updatedData: Partial<ScorpionMiner> = {
  //     balance: newBalance,
  //     rewards: 0,
  //     miningLevel: newLevelInfo.level,
  //     totalScorpionsCaught: totalScorpionsCaught + rewards,
  //     energy: 0,
  //     cooldownEndTime: Date.now() + COOLDOWN_TIME * 1000,
  //     lastUpdated: Date.now(),
  //   };

  //   setBalance(newBalance);
  //   setRewards(0);
  //   setLevelInfo(newLevelInfo);
  //   setCooldown(true);
  //   setCooldownTimeRemaining(COOLDOWN_TIME);
  //   setEnergy(0);
  //   setTotalScorpionsCaught(prev => prev + rewards);

  //   await saveGameState(updatedData);

  //   showSnackbar('Harvest successful!', `You earned ${rewards} scorpions!`);
  // }, [playerData, balance, rewards, totalScorpionsCaught, COOLDOWN_TIME, saveGameState, showSnackbar, isSaving]);

  const handleTaskComplete = useCallback(async (taskId: string) => {
    if (!playerData) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      if (levelInfo.level >= (task.requiredLevel ?? 0)) {
        setLoadingTaskId(taskId);
        try {
          const newBalance = balance + task.reward;
          const newLevelInfo = getLevel(newBalance);
          const updatedTasks = tasks.map((t) => 
            t.id === taskId ? { ...t, completed: true } : t
          );

          setBalance(newBalance);
          setLevelInfo(newLevelInfo);
          setTasks(updatedTasks);
          setTasksCompleted((prev) => prev + 1);

          const updatedData: Partial<ScorpionMiner> = {
            balance: newBalance,
            miningLevel: newLevelInfo.level,
            tasksCompleted: tasksCompleted + 1,
          };

          await saveGameState(updatedData);
          await completePlayerTask(playerData.id, taskId);

          showSnackbar('Task Completed', `You earned ${task.reward} Scorpions!`);
        } catch (error) {
          console.error('Error updating task completion:', error);
          showSnackbar('Error', 'Failed to complete task. Please try again.');
        } finally {
          setLoadingTaskId(null);
        }
      } else {
        showSnackbar('Level Too Low', `You need to reach level ${task.requiredLevel} to claim this task reward.`);
      }
    }
  }, [playerData, tasks, levelInfo.level, balance, tasksCompleted, saveGameState, showSnackbar]);

  // const handleBuyUpgrade = useCallback(async (upgradeId: string, baseCost: number) => {
  //   if (!playerData) return;

  //   const upgrade = upgradeItems.find(item => item.id === upgradeId);
  //   if (!upgrade) return;

  //   const currentUpgrade = upgradeLevels[upgradeId] || { level: 0, lastResetTime: 0 };
  //   const cost = baseCost * (currentUpgrade.level + 1);

  //   if (balance >= cost && currentUpgrade.level < upgrade.maxLevel) {
  //     try {
  //       await buyUpgrade(playerData.id, upgradeId, cost);

  //       const newBalance = balance - cost;
  //       const newUpgradeLevels = {
  //         ...upgradeLevels,
  //         [upgradeId]: {
  //           level: currentUpgrade.level + 1,
  //           lastResetTime: Date.now(),
  //         },
  //       };

  //       setBalance(newBalance);
  //       setUpgradeLevels(newUpgradeLevels);

  //       let updatedData: Partial<ScorpionMiner> = {
  //         balance: newBalance,
  //         upgradeLevels: newUpgradeLevels,
  //       };

  //       switch (upgradeId) {
  //         case '1':
  //           const newMaxEnergy = maxEnergy + 10;
  //           setMaxEnergy(newMaxEnergy);
  //           updatedData.maxEnergy = newMaxEnergy;
  //           showSnackbar('Energy Boost purchased!', `Max energy increased to ${newMaxEnergy}`);
  //           break;
  //         case '2':
  //           setCooldownTimeRemaining((prevCooldown) => Math.max(0, prevCooldown - 600));
  //           showSnackbar('Cooldown Reduction purchased!', 'Cooldown reduced by 10 minutes.');
  //           break;
  //         case '3':
  //           setDoubleRewardsActive(true);
  //           if (doubleRewardsTimeout) clearTimeout(doubleRewardsTimeout);
  //           const timeoutId = window.setTimeout(() => {
  //             setDoubleRewardsActive(false);
  //           }, 3600000);
  //           setDoubleRewardsTimeout(timeoutId);
  //           showSnackbar('Double Rewards purchased!', 'Earn double scorpions for 1 hour.');
  //           break;
  //         case '4':
  //           const newComboTimeLimit = comboTimeLimit + 5;
  //           setComboTimeLimit(newComboTimeLimit);
  //           updatedData.comboTimeLimit = newComboTimeLimit;
  //           showSnackbar('Combo Time Extension purchased!', `Combo time limit increased to ${newComboTimeLimit} seconds.`);
  //           break;
  //         case '5':
  //           setEnergy(maxEnergy);
  //           setCooldown(false);
  //           setCooldownTimeRemaining(0);
  //           showSnackbar('Instant Energy Refill purchased!', 'Energy fully restored, and cooldown disabled.');
  //           break;
  //       }

  //       await saveGameState(updatedData);
  //     } catch (error) {
  //       console.error('Error buying upgrade:', error);
  //       showSnackbar('Error', 'Failed to purchase upgrade. Please try again.');
  //     }
  //   } else if (currentUpgrade.level >= upgrade.maxLevel) {
  //     showSnackbar('Upgrade Maxed', 'This upgrade has reached its maximum level.');
  //   } else {
  //     showSnackbar('Insufficient scorpions!', 'Not enough scorpions to purchase this upgrade.');
  //   }
  // }, [playerData, balance, upgradeLevels, maxEnergy, comboTimeLimit, showSnackbar, saveGameState, doubleRewardsTimeout]);

  const fetchReferralData = useCallback(async () => {
    if (!user) return;

    setLoadingReferrals(true);
    try {
      const referralsData = await getReferralsByPlayer(user.id);
      const formattedReferrals = referralsData.map((referral) => ({
        id: referral.referred_id,
        username: referral.referred_username || 'Anonymous User',
      }));
      setReferralCount(formattedReferrals.length);
      setReferrals(formattedReferrals);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      setReferrals([]);
    } finally {
      setLoadingReferrals(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  const handleLinkClick = useCallback((taskId: string) => {
    setLinkClicked(prev => ({ ...prev, [taskId]: true }));
    showSnackbar('Link clicked', 'You have clicked the task link, now proceed to claim the reward.');
  }, [showSnackbar]);

  const handleInviteFriend = useCallback(() => {
    const utils = initUtils();

    if (user && user.id) {
      const inviteLink = `https://t.me/scorpion_world_bot?start=${user.id}`;
      const shareText = `Catch scorpions, earn rewards, and compete with friends in Scorpion World! 🌍🦂 Join me in this exciting Telegram mini app adventure and start earning now! 🔥 Click the link and let's play together!`;
      const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      utils.openTelegramLink(fullUrl);
    } else {
      console.error('User ID is missing. Cannot generate referral link.');
    }
  }, [user]);

  const refreshGameData = useCallback(async () => {
    if (!user || !playerData) return;

    try {
      const updatedPlayerData = await getScorpionMinerData(user.id);
      if (updatedPlayerData) {
        setPlayerData(updatedPlayerData);
        setBalance(updatedPlayerData.balance);
        setLevelInfo(getLevel(updatedPlayerData.balance));
        // setEnergy(updatedPlayerData.energy);
        // setRewards(updatedPlayerData.rewards);
        setTasksCompleted(updatedPlayerData.tasksCompleted);
        // setTotalScorpionsCaught(updatedPlayerData.totalScorpionsCaught);
        // setUpgradeLevels(updatedPlayerData.upgradeLevels || {});
        // setMaxEnergy(updatedPlayerData.maxEnergy);
        // setComboTimeLimit(updatedPlayerData.comboTimeLimit);
      }

      const updatedTasks = await fetchPlayerTasks(user.id);
      setTasks(updatedTasks);

      // const events = await getActiveSpecialEvents();
      // setSpecialEvents(events);

      await checkAndResetUpgrades(user.id);

    } catch (error) {
      console.error('Error refreshing game data:', error);
      showSnackbar('Error', 'Failed to refresh game data. Please try again.');
    }
  }, [user, playerData, showSnackbar]);

  useEffect(() => {
    const intervalId = setInterval(refreshGameData, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, [refreshGameData]);

  // useEffect(() => {
  //   if (playerData && playerData.upgradeLevels) {
  //     setUpgradeLevels(playerData.upgradeLevels);
  //   }
  // }, [playerData]);

  useEffect(() => {
    if (authError || error) {
      console.error('An error occurred:', authError || error);
      // Reload the page after a short delay to allow any pending operations to complete
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds delay
    }
  }, [authError, error]);

  const [tonConnectUI] = useTonConnectUI();
  const { open: openWalletModal } = useTonConnectModal();
  const [isConnecting, setIsConnecting] = useState(false);
  const connectedAddressString = tonConnectUI.wallet?.account.address;

  const handleOpenWalletModal = async () => {
    setIsConnecting(true);
    try {
      await openWalletModal();
    } finally {
      setIsConnecting(false);
    }
  };


  const handleResetTasks = useCallback(async () => {
    if (!playerData) return;
    
    setIsLoading(true);
    try {
      // Reset tasks in database
      await resetPlayerTasks(playerData.id);
      
      // Fetch fresh tasks
      const freshTasks = await fetchPlayerTasks(playerData.id);
      
      // Update local state
      setTasks(freshTasks);
      setLinkClicked({});
      
      showSnackbar('Tasks Reset', 'All tasks have been reset successfully!');
    } catch (error) {
      console.error('Error resetting tasks:', error);
      showSnackbar('Error', 'Failed to reset tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [playerData, showSnackbar]);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % infoCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + infoCards.length) % infoCards.length);
  };

  if (isAuthLoading || isLoading) {
    return <LoadingSplashScreen onComplete={() => {}} />;
  }

  if (authError || error) {
    return <ErrorPage message={(authError || error) ?? 'Unknown error'} />;
  }

  if (!user || !playerData) {
    return <div>No user data available</div>;
  }

  function setActiveTab(id: string): void {
    setCurrentTab(id);
  }

  return (
    <ErrorBoundary fallback={<ErrorPage message="Something went wrong. Please try again later." />}>
      <div className="flex flex-col min-h-screen bg-[#0A0A0F] text-white antialiased">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-lg z-50 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0066FF] via-purple-600 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-gradient"></div>
              <div className="relative">
                <img 
                  src={user?.photoUrl || "https://xelene.me/telegram.gif"} 
                  alt="" 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-black"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">@{user?.username || 'Anonymous'}</span>
              <span className="text-sm text-gray-400">{user?.firstName || 'Anonymous'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenWalletModal}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-full transition-all duration-300"
            >
              <span className="text-white">⚡</span>
              {connectedAddressString ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
        <List>
        {currentTab === 'home' && (
          <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-300">Balance</span>
                  <div className="flex items-center gap-2">
                    <FaCoins className="text-blue-400 text-lg" />
                    <span className="font-medium text-white">
                      {balance.toLocaleString('en-US', { maximumFractionDigits: 0 })} TONIT
                    </span>
                  </div>
                </div>
              </div>
            {/* Staking Input Card */}
            <div className="bg-gray-100/5 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between bg-gray-100/10 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    <FaCoins />
                  </span>
                  <input
                    type="number"
                    placeholder="Enter TON amount"
                    className="bg-transparent outline-none w-full text-white"
                    value={stakedAmount}
                    onChange={(e) => setStakedAmount(Number(e.target.value))}
                  />
                </div>
                <button 
                  className="text-blue-400 font-medium"
                  onClick={() => setStakedAmount(balance)}
                >
                  MAX
                </button>
              </div>

              {/* Quick Guide and APY */}
              <div className="flex justify-between items-center text-sm">
                <div className="space-y-1">
                  <span className="text-gray-400">Quick Guide</span>
                  <button className="block text-blue-400">About staking ›</button>
                </div>
                <div className="text-right">
                  <span className="text-gray-400">APY</span>
                  <p className="text-white font-medium">3.8%</p>
                </div>
              </div>

              {/* Connect Wallet Button */}
              <button
                onClick={handleOpenWalletModal}
                disabled={isConnecting}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <span className="text-white">⚡</span>
                CONNECT WALLET
              </button>
            </div>

            {/* Stats Cards */}
            <div className="space-y-3">
              <div className="bg-gray-100/5 rounded-xl p-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="text-gray-400">Total staked</span>
                  <span className="text-white font-medium">{stakedAmount.toFixed(2)} TON</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 py-3">
                  <span className="text-gray-400">Exchange rate</span>
                  <span className="text-white font-medium">1 TON = $2.31</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-gray-400">Pool address</span>
                  <span className="text-white font-medium truncate ml-2">EQC...x7Y</span>
                </div>
              </div>
            </div>

            {/* Enhanced Info Cards Carousel */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Featured Guides</h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevCard}
                    className="p-2 rounded-full bg-gray-100/5 hover:bg-gray-100/10 transition-colors"
                  >
                    <IoChevronBackOutline className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextCard}
                    className="p-2 rounded-full bg-gray-100/5 hover:bg-gray-100/10 transition-colors"
                  >
                    <IoChevronForwardOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex gap-4"
                  animate={{ x: `-${currentCard * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {infoCards.map((card) => (
                    <div
                      key={card.id}
                      className="min-w-full"
                    >
                      <div className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-6 border border-white/5`}>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-black/20 backdrop-blur-sm rounded-lg">
                            <span className="text-2xl">{card.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                            <p className="text-sm text-gray-300">{card.description}</p>
                            <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors">
                              Learn More →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {infoCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCard(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentCard === index 
                        ? 'bg-blue-400 w-4' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
              {currentTab === 'quest' && (
                <QuestComponent
                  tasks={tasks}
                  levelInfo={levelInfo}
                  handleTaskComplete={handleTaskComplete}
                  isSnackbarVisible={isSnackbarVisible}
                  setSnackbarVisible={setSnackbarVisible}
                  snackbarMessage={snackbarMessage}
                  snackbarDescription={snackbarDescription}
                  loadingTaskId={loadingTaskId}
                  linkClicked={linkClicked}
                  taskVerified={taskVerified}
                  handleLinkClick={handleLinkClick}
                  showSnackbar={showSnackbar}
                  verificationAttempts={0}
                  isVerifying={{}}
                  resetTasks={handleResetTasks}
                />
              )}
              {currentTab === 'network' && (
                <InviteComponent
                  referralCount={referralCount}
                  referralLink={referralLink}
                  handleInviteFriend={handleInviteFriend}
                  loadingReferrals={loadingReferrals}
                  referrals={referrals}
                />
              )}
               {currentTab === 'gmp' && (
                <LeaderBoardComponent
                />
              )}
               {currentTab === 'token' && (
                <AirdropComponent
                />
              )}
              {currentTab === 'onchain' && (
                <OnchainWrapper />
              )}
            </List>
      </div>
      {isSnackbarVisible && (
        <Snackbar
          onClose={() => {
            setSnackbarVisible(false);
            if (snackbarTimeoutRef.current) {
              clearTimeout(snackbarTimeoutRef.current);
            }
          }}
          duration={SNACKBAR_DURATION}
          description={snackbarDescription}
          after={
            <Button 
              size="s" 
              onClick={() => {
                setSnackbarVisible(false);
                if (snackbarTimeoutRef.current) {
                  clearTimeout(snackbarTimeoutRef.current);
                }
              }}
            >
              Close
            </Button>
          }
          className="snackbar-top"
        >
          {snackbarMessage}
        </Snackbar>
      )}
       {/* Bottom Navigation */}
       <div className="fixed bottom-0 left-0 right-0 bg-[#1A1B1E]/90 backdrop-blur-xl border-t border-white/5 safe-area-pb z-50">
        <div className="max-w-lg mx-auto px-2 md:px-4">
          <div className="grid grid-cols-5 items-center">
            {[
              { id: 'home', text: 'Home', Icon: AiOutlineHome },
              { id: 'network', text: 'Network', Icon: BiNetworkChart },
              { id: 'gmp', text: 'GMP', Icon: FaCoins },
              { id: 'quest', text: 'Quest', Icon: RiMessage3Line },
              { id: 'token', text: 'Token', Icon: FaCoins }
            ].map(({ id, text, Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center py-3 md:py-4 w-full transition-all duration-300 relative group ${currentTab === id ? 'text-blue-400' : 'text-white/40 hover:text-white/60'}`}>
                <Icon size={18} className={`${currentTab === id ? 'transform scale-110 transition-transform duration-300' : 'group-hover:scale-110 transition-transform duration-300'}`} />
                <span className="text-[10px] md:text-xs font-medium mt-1 tracking-wide truncate max-w-[64px] text-center">{text}</span>
                {currentTab === id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-blue-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      </ErrorBoundary>
    );
};

export default IndexPage;


