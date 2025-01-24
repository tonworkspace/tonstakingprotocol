import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Task, upgradeItems } from './gameData';
import { SKINS } from './config/skins';

// Supabase initialization
const supabaseUrl = "https://ioxvnoufbpphhtyqpmyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHZub3VmYnBwaGh0eXFwbXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNTc4NDcsImV4cCI6MjA0MTczMzg0N30.p6hIjsmxQ1YK-n5pv6xh2XroHUUQ_gEctFebXVDTfVg";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export interface UpgradeLevels {
  [key: string]: {
    level: number;
    lastResetTime: number;
  };
}

export type WalletType = 'SOL' | 'TON' | 'EVM';

export type WalletData = {
  [key in WalletType]?: string;
};

export interface ScorpionMiner {
  photoUrl: string;
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  miningLevel: number;
  energy: number;
  maxEnergy: number;
  rewards: number;
  lastUpdated: number;
  tasks: Task[];
  tasksCompleted: number;
  totalScorpionsCaught: number;
  upgradeLevels: UpgradeLevels;
  last_login_date?: string;
  loginStreak?: number;
  isHolding: null;
  holdStartTime: number | null;
  comboTimeLimit: number;
  cooldownEndTime: number | null;
  ownedSkins: string[];
  activeSkin: string;
  wallets?: WalletData;
  stakedAmount: number; // Added stakedAmount property
}

// Helper function to convert dates to ISO format
const convertDatesToISO = (data: Partial<ScorpionMiner>): any => {
  const convertedData: any = { ...data };
  if (data.lastUpdated) {
    convertedData.lastUpdated = new Date(data.lastUpdated).toISOString();
  }
  if (data.cooldownEndTime) {
    convertedData.cooldownEndTime = new Date(data.cooldownEndTime).toISOString();
  }
  return convertedData;
};

// Helper function to convert ISO dates to timestamps
const convertISOToTimestamps = (data: any): Partial<ScorpionMiner> => {
  const convertedData: Partial<ScorpionMiner> = { ...data };
  if (data.lastUpdated) {
    convertedData.lastUpdated = new Date(data.lastUpdated).getTime();
  }
  if (data.cooldownEndTime) {
    convertedData.cooldownEndTime = new Date(data.cooldownEndTime).getTime();
  }
  return convertedData;
};

// Function to save player progress
export const savePlayerProgressToSupabase = async (id: string, data: Partial<ScorpionMiner>): Promise<{ success: boolean; error?: string }> => {
  try {
    const convertedData = convertDatesToISO(data);

    const { error } = await supabase
      .from('scorpion_miners')
      .upsert([{ id, ...convertedData }], { onConflict: 'id' });

    if (error) {
      console.error('Error saving player progress to Supabase:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Player progress saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error saving player progress to Supabase:', error);
    return { success: false, error: 'Unexpected error occurred while saving player progress.' };
  }
};

// Function to fetch all tasks
export const fetchAllTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('task_list')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchPlayerTasks = async (playerId: number): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('player_tasks')
      .select(`
        *,
        task:task_list(id, description, reward, required_level, platform, link, difficulty)
      `)
      .eq('player_id', playerId);

    if (error) {
      throw error;
    }

    if (!data) {
      console.warn('No data returned for player tasks');
      return [];
    }

    return data.reduce((acc: Task[], item) => {
      if (item.task) {
        acc.push({
          id: item.task.id,
          description: item.task.description,
          reward: item.task.reward,
          completed: item.completed,
          status: item.completed ? 'completed' : 'active',
          requiredLevel: item.task.required_level,
          platform: item.task.platform,
          link: item.task.link,
          difficulty: item.task.difficulty,
          progress: item.progress,
          cooldownEndTime: 0,
          isNew: false,
          updated_at: new Date().toISOString()
        });
      } else {
        console.warn(`Task data missing for player_task id: ${item.id}`);
      }
      return acc;
    }, []);
  } catch (error) {
    console.error('Error fetching player tasks:', error);
    throw error;
  }
};

// Function to complete a task for a player
export const completePlayerTask = async (playerId: number, taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('player_tasks')
      .update({ completed: true })
      .eq('player_id', playerId)
      .eq('task_id', taskId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error completing player task:', error);
    return false;
  }
};

export const getScorpionMinerData = async (userId: string | number): Promise<ScorpionMiner | null> => {
  try {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (data) {
      const playerTasks = await fetchPlayerTasks(id);
      const convertedData = convertISOToTimestamps(data) as ScorpionMiner;
      convertedData.tasks = playerTasks;

      // Check and reset upgrades if necessary
      if (convertedData.upgradeLevels) {
        const currentTime = Date.now();
        const updatedUpgradeLevels: UpgradeLevels = {};
        let upgradesReset = false;

        for (const [upgradeId, upgradeData] of Object.entries(convertedData.upgradeLevels)) {
          const upgrade = upgradeItems.find(item => item.id === upgradeId);
          if (upgrade) {
            const timeSinceReset = currentTime - upgradeData.lastResetTime;
            if (timeSinceReset >= upgrade.resetHours * 60 * 60 * 1000) {
              updatedUpgradeLevels[upgradeId] = { level: 0, lastResetTime: currentTime };
              upgradesReset = true;
            } else {
              updatedUpgradeLevels[upgradeId] = upgradeData;
            }
          }
        }

        if (upgradesReset) {
          convertedData.upgradeLevels = updatedUpgradeLevels;
          await updateScorpionMinerData(id, { upgradeLevels: updatedUpgradeLevels });
        }
      }

      return convertedData;
    }

    return null;
  } catch (error) {
    console.error('Error fetching scorpion miner data:', error);
    throw error;
  }
};

export const populatePlayerTasks = async (playerId: number): Promise<void> => {
  try {
    const { data: tasks, error: fetchError } = await supabase
      .from('task_list')
      .select('id');

    if (fetchError) throw fetchError;

    if (!tasks || tasks.length === 0) {
      console.warn('No tasks found in task_list');
      return;
    }

    const playerTasks = tasks.map(task => ({
      player_id: playerId,
      task_id: task.id,
      completed: false,
      progress: null
    }));

    const { error: insertError } = await supabase
      .from('player_tasks')
      .insert(playerTasks);

    if (insertError) throw insertError;

    console.log(`Successfully populated tasks for player ${playerId}`);
  } catch (error) {
    console.error('Error populating player tasks:', error);
    throw error;
  }
};

// Function to update player data
export const updateScorpionMinerData = async (id: number, updates: Partial<ScorpionMiner>): Promise<void> => {
  try {
    const { tasks, upgradeLevels, ...otherUpdates } = updates;
    
    if (upgradeLevels) {
      // Ensure the lastResetTime is set for any upgraded items
      const currentTime = Date.now();
      for (const [upgradeId, upgradeData] of Object.entries(upgradeLevels)) {
        if (!upgradeData.lastResetTime) {
          upgradeLevels[upgradeId] = {
            ...upgradeData,
            lastResetTime: currentTime,
          };
        }
      }
    }

    const response = await savePlayerProgressToSupabase(id.toString(), { ...otherUpdates, upgradeLevels });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update player data');
    }

    if (tasks) {
      for (const task of tasks) {
        await completePlayerTask(id, task.id);
      }
    }
  } catch (error) {
    console.error('Error updating scorpion miner data:', error);
    throw error;
  }
};

export const createNewPlayer = async (userId: number, initialData: Partial<ScorpionMiner>): Promise<ScorpionMiner> => {
  const newPlayer: ScorpionMiner = {
    id: userId,
    photoUrl: '',
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
    holdStartTime: null,
    comboTimeLimit: 30,
    isHolding: null,
    cooldownEndTime: null,
    ownedSkins: ['default'],
    activeSkin: 'default',
    stakedAmount: 0, // Add this line to provide a default value
    ...initialData
  };

  try {
    const response = await savePlayerProgressToSupabase(userId.toString(), newPlayer);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create new player');
    }

    await populatePlayerTasks(userId);

    return newPlayer;
  } catch (error) {
    console.error('Error creating new player:', error);
    throw error;
  }
};

export const getReferralsByPlayer = async (referrerId: number): Promise<{ referred_id: number; referred_username: string }[]> => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("referred_id, referred_username")
      .eq("referrer_id", referrerId);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching referrals from Supabase:", error);
    return [];
  }
};

export const handleDailyLogin = async (playerId: number): Promise<{ loginStreak: number, bonusReward: number }> => {
  try {
    const player = await getScorpionMinerData(playerId.toString());
    if (!player) throw new Error('Player not found');

    const today = new Date().toISOString().split('T')[0];
    let loginStreak = player.loginStreak || 0;
    let bonusReward = 0;

    if (player.last_login_date !== today) {
      loginStreak += 1;
      bonusReward = loginStreak * 10; // 10 scorpions per day of streak

      const updates: Partial<ScorpionMiner> = {
        last_login_date: today,
        loginStreak,
        balance: player.balance + bonusReward,
      };

      await updateScorpionMinerData(playerId, updates);
    }

    return { loginStreak, bonusReward };
  } catch (error) {
    console.error('Error handling daily login:', error);
    throw error;
  }
};

export const getAllPlayers = async (): Promise<ScorpionMiner[]> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('*')
      .order('balance', { ascending: false });

    if (error) throw error;

    return data.map(player => convertISOToTimestamps(player) as ScorpionMiner);
  } catch (error) {
    console.error('Error fetching all players:', error);
    throw error;
  }
};

export const deletePlayer = async (playerId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('scorpion_miners')
      .delete()
      .eq('id', playerId);

    if (error) throw error;

    console.log(`Player ${playerId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

export const refreshPlayerTasks = async (playerId: number): Promise<void> => {
  try {
    const { data: tasks, error: fetchError } = await supabase
      .from('task_list')
      .select('id');

    if (fetchError) throw fetchError;

    if (!tasks || tasks.length === 0) {
      console.warn('No tasks found in task_list');
      return;
    }

    const { data: existingTasks, error: existingTasksError } = await supabase
      .from('player_tasks')
      .select('task_id')
      .eq('player_id', playerId);

    if (existingTasksError) throw existingTasksError;

    const existingTaskIds = new Set(existingTasks?.map(task => task.task_id));
    const newTasks = tasks.filter(task => !existingTaskIds.has(task.id));

    const playerTasks = newTasks.map(task => ({
      player_id: playerId,
      task_id: task.id,
      completed: false,
      progress: null
    }));

    if (playerTasks.length > 0) {
      const { error: insertError } = await supabase
        .from('player_tasks')
        .insert(playerTasks);

      if (insertError) throw insertError;
    }

    console.log(`Successfully refreshed tasks for player ${playerId}`);
  } catch (error) {
    console.error('Error refreshing player tasks:', error);
    throw error;
  }
};

export const updateCooldownTimer = async (playerId: number, cooldownEndTime: number | null): Promise<void> => {
  try {
    await updateScorpionMinerData(playerId, { cooldownEndTime });
  } catch (error) {
    console.error('Error updating cooldown timer:', error);
    throw error;
  }
};

export const updatePlayerEnergy = async (playerId: number, newEnergy: number): Promise<void> => {
  try {
    await updateScorpionMinerData(playerId, { energy: newEnergy });
  } catch (error) {
    console.error('Error updating player energy:', error);
    throw error;
  }
};

export const getPlayerRank = async (playerId: number): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('id, balance')
      .order('balance', { ascending: false });

    if (error) throw error;

    const playerIndex = data.findIndex(player => player.id === playerId);
    return playerIndex + 1; // Adding 1 because array index is zero-based
  } catch (error) {
    console.error('Error getting player rank:', error);
    throw error;
  }
};

export const updateUpgradeLevels = async (playerId: number, upgradeLevels: UpgradeLevels): Promise<void> => {
  try {
    await updateScorpionMinerData(playerId, { upgradeLevels });
  } catch (error) {
    console.error('Error updating upgrade levels:', error);
    throw error;
  }
};

export const getLeaderboard = async (limit: number = 10): Promise<Partial<ScorpionMiner>[]> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('id, username, balance, miningLevel')
      .order('balance', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

export const updateMiningLevel = async (playerId: number, newLevel: number): Promise<void> => {
  try {
    await updateScorpionMinerData(playerId, { miningLevel: newLevel });
  } catch (error) {
    console.error('Error updating mining level:', error);
    throw error;
  }
};

export const resetDailyTasks = async (playerId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('player_tasks')
      .update({ completed: false, progress: null })
      .eq('player_id', playerId)
      .eq('task_type', 'daily');

    if (error) throw error;

    console.log(`Daily tasks reset for player ${playerId}`);
  } catch (error) {
    console.error('Error resetting daily tasks:', error);
    throw error;
  }
};

export const getActiveSpecialEvents = async (): Promise<any[]> => {
  try {
    const currentTime = new Date().toISOString();
    const { data, error } = await supabase
      .from('special_events')
      .select('*')
      .lte('start_time', currentTime)
      .gte('end_time', currentTime);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching active special events:', error);
    throw error;
  }
};

export const buyUpgrade = async (playerId: number, upgradeId: string, cost: number): Promise<void> => {
  try {
    const player = await getScorpionMinerData(playerId);
    if (!player) throw new Error('Player not found');

    if (player.balance < cost) throw new Error('Insufficient balance');

    const upgradeLevels = player.upgradeLevels || {};
    const currentUpgrade = upgradeLevels[upgradeId] || { level: 0, lastResetTime: 0 };
    const newUpgradeLevel = currentUpgrade.level + 1;

    const updatedUpgradeLevels = {
      ...upgradeLevels,
      [upgradeId]: { level: newUpgradeLevel, lastResetTime: Date.now() }
    };

    await updateScorpionMinerData(playerId, {
      balance: player.balance - cost,
      upgradeLevels: updatedUpgradeLevels
    });

    console.log(`Player ${playerId} bought upgrade ${upgradeId} at level ${newUpgradeLevel}`);
  } catch (error) {
    console.error('Error buying upgrade:', error);
    throw error;
  }
};

export const checkAndResetUpgrades = async (playerId: number): Promise<void> => {
  try {
    const player = await getScorpionMinerData(playerId);
    if (!player) {
      console.warn('Player not found when checking upgrades');
      return;
    }

    const currentTime = Date.now();
    let upgradesReset = false;
    const updatedUpgradeLevels: UpgradeLevels = {};

    // Check if upgradeLevels exists and is not empty
    if (player.upgradeLevels && Object.keys(player.upgradeLevels).length > 0) {
      for (const [upgradeId, upgradeData] of Object.entries(player.upgradeLevels)) {
        const upgrade = upgradeItems.find(item => item.id === upgradeId);
        if (upgrade) {
          const timeSinceReset = currentTime - upgradeData.lastResetTime;
          if (timeSinceReset >= upgrade.resetHours * 60 * 60 * 1000) {
            updatedUpgradeLevels[upgradeId] = { level: 0, lastResetTime: currentTime };
            upgradesReset = true;
          } else {
            updatedUpgradeLevels[upgradeId] = upgradeData;
          }
        }
      }

      if (upgradesReset) {
        await updateScorpionMinerData(playerId, { upgradeLevels: updatedUpgradeLevels });
        console.log(`Upgrades reset for player ${playerId}`);
      }
    } else {
      console.log(`No upgrades to reset for player ${playerId}`);
    }
  } catch (error) {
    console.error('Error checking and resetting upgrades:', error);
  }
};

export const getTotalPlayers = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('scorpion_miners')
      .select('*', { count: 'exact' });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting total players count:', error);
    return 0;
  }
};

export const updateUserSession = async (userId: string) => {
  await supabase
    .from('user_sessions')
    .upsert({ 
      user_id: userId,
      last_seen: new Date().toISOString()
    });
};

export const getAllReferrals = async () => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all referrals:", error);
    return [];
  }
};

export const getReferralLeaderboard = async (limit = 100) => { // Changed default to 100
  try {
    const referrals = await getAllReferrals();
    const counts = referrals.reduce((acc: { [key: string]: number }, curr) => {
      if (curr.referrer_username) {
        acc[curr.referrer_username] = (acc[curr.referrer_username] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([username, referral_count]) => ({ username, referral_count }))
      .sort((a, b) => b.referral_count - a.referral_count)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting referral leaderboard:", error);
    return [];
  }
};

// Function to purchase a skin
export const purchaseSkin = async (playerId: number, skinId: string, cost: number): Promise<void> => {
  try {
    const player = await getScorpionMinerData(playerId);
    if (!player) throw new Error('Player not found');
    if (player.balance < cost) throw new Error('Insufficient balance');

    const ownedSkins = player.ownedSkins || ['default'];
    if (ownedSkins.includes(skinId)) throw new Error('Skin already owned');

    await updateScorpionMinerData(playerId, {
      balance: player.balance - cost,
      ownedSkins: [...ownedSkins, skinId]
    });

    console.log(`Player ${playerId} purchased skin ${skinId}`);
  } catch (error) {
    console.error('Error purchasing skin:', error);
    throw error;
  }
};

// Function to select active skin
export const setActiveSkin = async (playerId: number, skinId: string): Promise<void> => {
  try {
    // Validate skin ID against known valid skins
    const validSkins = ['default', ...SKINS.map(skin => skin.id)];
    if (!validSkins.includes(skinId)) {
      throw new Error(`Invalid skin ID: ${skinId}`);
    }

    // Get current player data first
    const player = await getScorpionMinerData(playerId.toString());
    if (!player) throw new Error('Player not found');

    // Verify player owns the skin
    if (!player.ownedSkins.includes(skinId)) {
      throw new Error('Player does not own this skin');
    }

    // Update only the activeSkin field
    const { error } = await supabase
      .from('scorpion_miners')
      .update({ activeSkin: skinId })
      .eq('id', playerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error setting active skin:', error);
    throw error;
  }
};

export const saveWalletAddress = async (
  playerId: number, 
  type: WalletType, 
  address: string
): Promise<void> => {
  try {
    const player = await getScorpionMinerData(playerId);
    if (!player) throw new Error('Player not found');

    const updatedWallets = {
      ...(player.wallets || {}),
      [type]: address
    };

    // Save to Supabase
    await updateScorpionMinerData(playerId, {
      wallets: updatedWallets
    });

    // Save to localStorage
    localStorage.setItem(`wallet_${playerId}`, JSON.stringify(updatedWallets));

    console.log(`Wallet address saved for player ${playerId}, type: ${type}`);
  } catch (error) {
    console.error('Error saving wallet address:', error);
    throw error;
  }
};

export const getWalletAddresses = async (playerId: number): Promise<WalletData> => {
  try {
    // Try to get from localStorage first
    const localData = localStorage.getItem(`wallet_${playerId}`);
    if (localData) {
      return JSON.parse(localData);
    }

    // If not in localStorage, get from Supabase
    const player = await getScorpionMinerData(playerId);
    if (!player) throw new Error('Player not found');

    const wallets = player.wallets || {};
    
    // Save to localStorage for future use
    localStorage.setItem(`wallet_${playerId}`, JSON.stringify(wallets));

    return wallets;
  } catch (error) {
    console.error('Error getting wallet addresses:', error);
    return {};
  }
};

export const resetPlayerTasks = async () => {
  try {
    const { data: player } = await supabase.auth.getUser();
    if (!player.user) return;

    const { error } = await supabase
      .from('player_tasks')
      .delete()
      .eq('player_id', player.user.id);

    if (error) {
      console.error('Error resetting player tasks:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in resetPlayerTasks:', error);
    throw error;
  }
};