import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { List, Tabbar, Snackbar, Button } from '@telegram-apps/telegram-ui';
import { Gi3dMeeple, GiScrollUnfurled } from 'react-icons/gi';
import { FaUserFriends, FaHome } from 'react-icons/fa';
import { initUtils } from '@telegram-apps/sdk-react';
import {
  ScorpionMiner,
  UpgradeLevels,
  getScorpionMinerData,
  fetchPlayerTasks,
  createNewPlayer,
  completePlayerTask,
  updateScorpionMinerData,
  getReferralsByPlayer,
  handleDailyLogin,
  buyUpgrade,
  checkAndResetUpgrades,
  getActiveSpecialEvents,
} from '@/playerSupabase';
import HoldComponent from '@/components/HoldComponent';
import InviteComponent from '@/components/InviteComponent';
import QuestComponent from '@/components/QuestComponent';
import { upgradeItems, levels, getLevel, Task, LevelInfo } from '@/gameData';
import useAuth from '@/hooks/useAuth';
import LoadingSplashScreen from '@/components/LoadingSplashScreen';
import LeaderBoardComponent from '@/components/LeaderBoardComponent';
import { Trophy } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import ErrorPage from '@/components/ErrorPage';
import AirdropComponent from '@/components/AirdropComponent';
import { OnchainWrapper } from '@/components/OnchainWrapper';
import GuestWizard from '@/components/GuestWizard';

const tabs = [
  { id: 'mine', text: 'Home', Icon: FaHome },
  { id: 'quest', text: 'Quest', Icon: GiScrollUnfurled },
  { id: 'leaderboard', text: 'Rank', Icon: Trophy },
  { id: 'invite', text: 'Invite', Icon: FaUserFriends },
  { id: 'airdrop', text: 'Airdrop', Icon: Gi3dMeeple },
  // { id: 'onchain', text: 'TON', Icon: GiChaingun },
];

export const IndexPage: React.FC = () => {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<ScorpionMiner | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [comboTimeLimit, setComboTimeLimit] = useState(30);
  const [doubleRewardsTimeout, setDoubleRewardsTimeout] = useState<number | null>(null);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>(getLevel(0));
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarDescription, setSnackbarDescription] = useState('');
  const [linkClicked, setLinkClicked] = useState<{ [key: string]: boolean }>({});
  const [taskVerified] = useState<{ [key: string]: boolean }>({});
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalScorpionsCaught, setTotalScorpionsCaught] = useState(0);
  const [referrals, setReferrals] = useState<Array<{ id: string | number; username: string }>>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [, setDoubleRewardsActive] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [upgradeLevels, setUpgradeLevels] = useState<UpgradeLevels>({});
  const [specialEvents, setSpecialEvents] = useState<any[]>([]);
  const [showWizard, setShowWizard] = useState(false);

  const snackbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const COOLDOWN_TIME = 3 * 60 * 60;
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

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    const lastTutorialDate = localStorage.getItem('lastTutorialDate');
    const currentDate = new Date().toDateString();

    if (!hasSeenTutorial || (lastTutorialDate && lastTutorialDate !== currentDate)) {
      setShowWizard(true);
      localStorage.setItem('hasSeenTutorial', 'true');
      localStorage.setItem('lastTutorialDate', currentDate);
    }
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
        setEnergy(minerData.energy || 100);
        setRewards(minerData.rewards || 0);
        setTasksCompleted(minerData.tasksCompleted || 0);
        setTotalScorpionsCaught(minerData.totalScorpionsCaught || 0);
        setUpgradeLevels(minerData.upgradeLevels || {});
        setMaxEnergy(minerData.maxEnergy || 100);
        setComboTimeLimit(minerData.comboTimeLimit || 30);
  
        if (minerData.cooldownEndTime && minerData.cooldownEndTime > Date.now()) {
          const remainingTime = Math.floor((minerData.cooldownEndTime - Date.now()) / 1000);
          setCooldownTimeRemaining(remainingTime);
          setCooldown(true);
        }
  
        setReferralLink(`https://t.me/scorpion_world_bot?start=${user.id}`);
  
        const { loginStreak, bonusReward } = await handleDailyLogin(user.id);
        if (bonusReward > 0) {
          showSnackbar('Daily Login Bonus!', `You've logged in for ${loginStreak} days in a row and earned ${bonusReward} scorpions!`);
        }
  
        const events = await getActiveSpecialEvents();
        setSpecialEvents(events);
  
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

  const handleMining = useCallback((newRewards: number, newEnergy: number) => {
    setRewards(prev => prev + newRewards);
    setEnergy(newEnergy);
    setTotalScorpionsCaught(prev => prev + newRewards);

    saveGameState({
      rewards: rewards + newRewards,
      energy: newEnergy,
      totalScorpionsCaught: totalScorpionsCaught + newRewards
    });
  }, [rewards, totalScorpionsCaught, saveGameState]);

  const handleHarvest = useCallback(async () => {
    if (!playerData || isSaving) return;

    const newBalance = balance + rewards;
    const newLevelInfo = getLevel(newBalance);

    const updatedData: Partial<ScorpionMiner> = {
      balance: newBalance,
      rewards: 0,
      miningLevel: newLevelInfo.level,
      totalScorpionsCaught: totalScorpionsCaught + rewards,
      energy: 0,
      cooldownEndTime: Date.now() + COOLDOWN_TIME * 1000,
      lastUpdated: Date.now(),
    };

    setBalance(newBalance);
    setRewards(0);
    setLevelInfo(newLevelInfo);
    setCooldown(true);
    setCooldownTimeRemaining(COOLDOWN_TIME);
    setEnergy(0);
    setTotalScorpionsCaught(prev => prev + rewards);

    await saveGameState(updatedData);

    showSnackbar('Harvest successful!', `You earned ${rewards} scorpions!`);
  }, [playerData, balance, rewards, totalScorpionsCaught, COOLDOWN_TIME, saveGameState, showSnackbar, isSaving]);

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

  const handleBuyUpgrade = useCallback(async (upgradeId: string, baseCost: number) => {
    if (!playerData) return;

    const upgrade = upgradeItems.find(item => item.id === upgradeId);
    if (!upgrade) return;

    const currentUpgrade = upgradeLevels[upgradeId] || { level: 0, lastResetTime: 0 };
    const cost = baseCost * (currentUpgrade.level + 1);

    if (balance >= cost && currentUpgrade.level < upgrade.maxLevel) {
      try {
        await buyUpgrade(playerData.id, upgradeId, cost);

        const newBalance = balance - cost;
        const newUpgradeLevels = {
          ...upgradeLevels,
          [upgradeId]: {
            level: currentUpgrade.level + 1,
            lastResetTime: Date.now(),
          },
        };

        setBalance(newBalance);
        setUpgradeLevels(newUpgradeLevels);

        let updatedData: Partial<ScorpionMiner> = {
          balance: newBalance,
          upgradeLevels: newUpgradeLevels,
        };

        switch (upgradeId) {
          case '1':
            const newMaxEnergy = maxEnergy + 10;
            setMaxEnergy(newMaxEnergy);
            updatedData.maxEnergy = newMaxEnergy;
            showSnackbar('Energy Boost purchased!', `Max energy increased to ${newMaxEnergy}`);
            break;
          case '2':
            setCooldownTimeRemaining((prevCooldown) => Math.max(0, prevCooldown - 600));
            showSnackbar('Cooldown Reduction purchased!', 'Cooldown reduced by 10 minutes.');
            break;
          case '3':
            setDoubleRewardsActive(true);
            if (doubleRewardsTimeout) clearTimeout(doubleRewardsTimeout);
            const timeoutId = window.setTimeout(() => {
              setDoubleRewardsActive(false);
            }, 3600000);
            setDoubleRewardsTimeout(timeoutId);
            showSnackbar('Double Rewards purchased!', 'Earn double scorpions for 1 hour.');
            break;
          case '4':
            const newComboTimeLimit = comboTimeLimit + 5;
            setComboTimeLimit(newComboTimeLimit);
            updatedData.comboTimeLimit = newComboTimeLimit;
            showSnackbar('Combo Time Extension purchased!', `Combo time limit increased to ${newComboTimeLimit} seconds.`);
            break;
          case '5':
            setEnergy(maxEnergy);
            setCooldown(false);
            setCooldownTimeRemaining(0);
            showSnackbar('Instant Energy Refill purchased!', 'Energy fully restored, and cooldown disabled.');
            break;
        }

        await saveGameState(updatedData);
      } catch (error) {
        console.error('Error buying upgrade:', error);
        showSnackbar('Error', 'Failed to purchase upgrade. Please try again.');
      }
    } else if (currentUpgrade.level >= upgrade.maxLevel) {
      showSnackbar('Upgrade Maxed', 'This upgrade has reached its maximum level.');
    } else {
      showSnackbar('Insufficient scorpions!', 'Not enough scorpions to purchase this upgrade.');
    }
  }, [playerData, balance, upgradeLevels, maxEnergy, comboTimeLimit, showSnackbar, saveGameState, doubleRewardsTimeout]);

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
        setEnergy(updatedPlayerData.energy);
        setRewards(updatedPlayerData.rewards);
        setTasksCompleted(updatedPlayerData.tasksCompleted);
        setTotalScorpionsCaught(updatedPlayerData.totalScorpionsCaught);
        setUpgradeLevels(updatedPlayerData.upgradeLevels || {});
        setMaxEnergy(updatedPlayerData.maxEnergy);
        setComboTimeLimit(updatedPlayerData.comboTimeLimit);
      }

      const updatedTasks = await fetchPlayerTasks(user.id);
      setTasks(updatedTasks);

      const events = await getActiveSpecialEvents();
      setSpecialEvents(events);

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

  useEffect(() => {
    if (playerData && playerData.upgradeLevels) {
      setUpgradeLevels(playerData.upgradeLevels);
    }
  }, [playerData]);

  useEffect(() => {
    if (authError || error) {
      console.error('An error occurred:', authError || error);
      // Reload the page after a short delay to allow any pending operations to complete
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds delay
    }
  }, [authError, error]);

  if (isAuthLoading || isLoading) {
    return <LoadingSplashScreen />;
  }

  if (authError || error) {
    return <div>Error: {authError || error}</div>;
  }

  if (!user || !playerData) {
    return <div>No user data available</div>;
  }

  return (
    <ErrorBoundary fallback={<ErrorPage message="Something went wrong. Please try again later." />}>
      {isLoading ? (
        <LoadingSplashScreen />
      ) : (
        <>
          {showWizard && (
            <GuestWizard 
              onComplete={() => {
                setShowWizard(false);
                showSnackbar(
                  'Welcome to Scorpion World!', 
                  'Start your journey by catching your first scorpion!'
                );
              }} 
            />
          )}
          <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4 py-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-700 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-600 opacity-20 rounded-full blur-2xl"></div>
            <List>
              {currentTab === 'mine' && (
                <HoldComponent
                user={user}
                levelInfo={levelInfo}
                balance={balance}
                rewards={rewards}
                energy={energy}
                maxEnergy={maxEnergy}
                cooldown={cooldown}
                cooldownTimeRemaining={cooldownTimeRemaining}
                isHolding={isHolding}
                setIsHolding={setIsHolding}
                setRewards={setRewards}
                setEnergy={setEnergy}
                setBalance={setBalance}
                setCooldown={setCooldown}
                setCooldownTimeRemaining={setCooldownTimeRemaining}
                upgradeItems={upgradeItems}
                upgradeLevels={upgradeLevels || {}}
                handleBuyUpgrade={handleBuyUpgrade}
                handleMining={handleMining}
                handleHarvest={handleHarvest}
                tasks={tasks}
                isSnackbarVisible={isSnackbarVisible}
                setSnackbarVisible={setSnackbarVisible}
                snackbarMessage={snackbarMessage}
                snackbarDescription={snackbarDescription}
                showSnackbar={showSnackbar}
                levels={levels}
                getLevel={getLevel}
                setLevelInfo={setLevelInfo}
                comboTimeLimit={comboTimeLimit}
                tasksCompleted={tasksCompleted}
                totalScorpionsCaught={totalScorpionsCaught}
                setTotalScorpionsCaught={setTotalScorpionsCaught}
                currentEvent={specialEvents.length > 0 ? specialEvents[0] : null}
                playerData={playerData}
                saveGameState={saveGameState}
                cooldownTime={COOLDOWN_TIME} // Add this prop
              />
              )}
              {currentTab === 'quest' && (
                <QuestComponent
                  balance={balance}
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
                  resetTasks={() => {
                    // Implement your reset logic here
                    // For example:
                    // resetAllTasks();
                  }}
                />
              )}
              {currentTab === 'invite' && (
                <InviteComponent
                  referralCount={referralCount}
                  referralLink={referralLink}
                  handleInviteFriend={handleInviteFriend}
                  loadingReferrals={loadingReferrals}
                  referrals={referrals}
                />
              )}
               {currentTab === 'leaderboard' && (
                <LeaderBoardComponent
                />
              )}
               {currentTab === 'airdrop' && (
                <AirdropComponent
                />
              )}
              {currentTab === 'onchain' && (
                <OnchainWrapper />
              )}
            </List>
          </div>
        </>
      )}
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
      <Tabbar>
        {tabs.map(({ id, text, Icon }) => (
          <Tabbar.Item
            key={id}
            text={text}
            selected={id === currentTab}
            onClick={() => setCurrentTab(id)}
          >
            <Icon size={24} className="text-white" />
          </Tabbar.Item>
        ))}
      </Tabbar>
    </ErrorBoundary>
  );
};

export default IndexPage;