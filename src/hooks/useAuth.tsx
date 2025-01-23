import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import {
  ScorpionMiner,
  getScorpionMinerData,
  createNewPlayer,
  handleDailyLogin,
  updateScorpionMinerData as updateMinerData,
  fetchPlayerTasks,
  refreshPlayerTasks,
  completePlayerTask
} from '@/playerSupabase';
import { Task, getLevel } from '@/gameData';

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  languageCode: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [playerData, setPlayerData] = useState<ScorpionMiner | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initData = useInitData();

  const initializePlayerData = useCallback(async (userData: AuthUser): Promise<ScorpionMiner> => {
    const newPlayerData: ScorpionMiner = {
      id: userData.id,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      balance: 0,
      miningLevel: 1,
      energy: 100,
      maxEnergy: 100,
      rewards: 0,
      lastUpdated: Date.now(),
      tasks: [],
      tasksCompleted: 0,
      totalScorpionsCaught: 0,
      upgradeLevels: {},
      loginStreak: 1,
      isHolding: null,
      holdStartTime: null,
      comboTimeLimit: 30,
      cooldownEndTime: null,
      photoUrl: '',
      ownedSkins: ['default'],
      activeSkin: 'default',
      stakedAmount: 0
    };

    const createdPlayer = await createNewPlayer(userData.id, newPlayerData);
    const initialTasks = await fetchPlayerTasks(userData.id);
    setTasks(initialTasks);

    return createdPlayer;
  }, []);

  const initializeAuth = useCallback(async () => {
    if (!initData?.user) {
      setError('Telegram user not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const telegramUser = initData.user;

      const userData: AuthUser = {
        id: Number(telegramUser.id),
        username: telegramUser.username || '',
        firstName: telegramUser.firstName,
        lastName: telegramUser.lastName || '',
        photoUrl: telegramUser.photoUrl || '',
        languageCode: telegramUser.languageCode || ''
      };

      setUser(userData);

      let minerData = await getScorpionMinerData(userData.id);
      if (!minerData) {
        minerData = await initializePlayerData(userData);
      } else {
        const { loginStreak, bonusReward } = await handleDailyLogin(userData.id);
        minerData = {
          ...minerData,
          loginStreak,
          balance: (minerData.balance || 0) + bonusReward
        };
        await refreshPlayerTasks(userData.id);
      }

      setPlayerData(minerData);

      const playerTasks = await fetchPlayerTasks(userData.id);
      setTasks(playerTasks);

    } catch (err) {
      console.error('Failed to initialize user authentication:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [initData, initializePlayerData]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const updatePlayerData = useCallback(async (updatedData: Partial<ScorpionMiner>) => {
    if (!playerData) {
      console.error("No player data available to update.");
      setError("Player data is missing, update failed.");
      return;
    }
  
    try {
      // Attempt to update the player data in Supabase
      await updateMinerData(playerData.id, updatedData);
  
      // Update local player data state with new data
      setPlayerData(prev => prev ? { ...prev, ...updatedData } : null);
  
      // Only fetch tasks if the tasks are part of the updatedData
      if (updatedData.tasks) {
        const updatedTasks = await fetchPlayerTasks(playerData.id);
        setTasks(updatedTasks);
      }
  
      console.log('Player data updated successfully');
  
    } catch (error) {
      console.error('Error updating player data:', error);
      setError('Failed to update player data');
    }
  }, [playerData]);

  const handleTaskComplete = useCallback(async (taskId: string) => {
    if (!playerData) return;

    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      try {
        const newBalance = playerData.balance + task.reward;
        const newLevelInfo = getLevel(newBalance);
        const updatedTasks = tasks.map((t) => 
          t.id === taskId ? { ...t, completed: true } : t
        );

        const updatedData: Partial<ScorpionMiner> = {
          balance: newBalance,
          miningLevel: newLevelInfo.level,
          tasksCompleted: (playerData.tasksCompleted || 0) + 1,
          tasks: updatedTasks
        };

        await updatePlayerData(updatedData);
        await completePlayerTask(playerData.id, taskId);

        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error completing task:', error);
        setError('Failed to complete task');
      }
    }
  }, [playerData, tasks, updatePlayerData]);

  const refreshTasks = useCallback(async () => {
    if (playerData) {
      try {
        await refreshPlayerTasks(playerData.id);
        const updatedTasks = await fetchPlayerTasks(playerData.id);
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Failed to refresh tasks:', error);
        setError('Failed to refresh tasks');
      }
    }
  }, [playerData]);

  const logout = useCallback(() => {
    setUser(null);
    setPlayerData(null);
    setTasks([]);
  }, []);

  const authContext = useMemo(() => ({
    user,
    playerData,
    tasks,
    isLoading,
    error,
    updatePlayerData,
    handleTaskComplete,
    refreshTasks,
    logout
  }), [user, playerData, tasks, isLoading, error, updatePlayerData, handleTaskComplete, refreshTasks, logout]);

  return authContext;
};

export default useAuth;