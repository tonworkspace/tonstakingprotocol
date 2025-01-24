import { openDB, DBSchema } from 'idb';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase initialization
const supabaseUrl = "https://ioxvnoufbpphhtyqpmyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHZub3VmYnBwaGh0eXFwbXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNTc4NDcsImV4cCI6MjA0MTczMzg0N30.p6hIjsmxQ1YK-n5pv6xh2XroHUUQ_gEctFebXVDTfVg";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// IndexedDB schema
interface ScorpionMinerDB extends DBSchema {
  scorpionMiners: {
    key: number;
    value: ScorpionMiner;
  };
  tasks: {
    key: number;
    value: any;
  };
}

const dbPromise = openDB<ScorpionMinerDB>('ScorpionMinerDB', 2, {
  upgrade(db) {
    db.createObjectStore('scorpionMiners', { keyPath: 'id' });
    db.createObjectStore('tasks', { keyPath: 'id' });
  },
});

// ScorpionMiner interface
export interface ScorpionMiner {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  isBot?: boolean;
  isPremium?: boolean;
  languageCode?: string;
  balance: number;
  miningLevel: number;
  energy: number;
  rewards: number;
  lastHarvestTime?: number;
  lastExhaustedTime?: number;
  lastEnergyDepletionTime?: number;
  cooldownEndTime?: number;
  referrerId?: number;
  referredPlayers?: number[];
  tasks?: any[];
  lastLoginDate?: string;
  loginStreak?: number;
  lastUpdated: number;
}


// Helper function to convert Date objects to ISO strings for Supabase
const convertDatesToISO = (miner: ScorpionMiner): any => ({
  ...miner,
  lastHarvestTime: miner.lastHarvestTime ? new Date(miner.lastHarvestTime).toISOString() : null,
  lastExhaustedTime: miner.lastExhaustedTime ? new Date(miner.lastExhaustedTime).toISOString() : null,
  lastEnergyDepletionTime: miner.lastEnergyDepletionTime ? new Date(miner.lastEnergyDepletionTime).toISOString() : null,
  cooldownEndTime: miner.cooldownEndTime ? new Date(miner.cooldownEndTime).toISOString() : null,
  lastUpdated: new Date(miner.lastUpdated).toISOString(),
});

// Helper function to convert ISO strings to Date objects for local storage
const convertISOToDates = (miner: any): ScorpionMiner => ({
  ...miner,
  lastHarvestTime: miner.lastHarvestTime ? new Date(miner.lastHarvestTime).getTime() : undefined,
  lastExhaustedTime: miner.lastExhaustedTime ? new Date(miner.lastExhaustedTime).getTime() : undefined,
  lastEnergyDepletionTime: miner.lastEnergyDepletionTime ? new Date(miner.lastEnergyDepletionTime).getTime() : undefined,
  cooldownEndTime: miner.cooldownEndTime ? new Date(miner.cooldownEndTime).getTime() : undefined,
});

// Referral management functions
// Add a referral between referrer and referred player
export const addReferral = async (referrerId: number, referredId: number, referrerUsername: string, referredUsername: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrerId,
        referrer_username: referrerUsername,
        referred_id: referredId,
        referred_username: referredUsername,
      });

    if (error) {
      throw new Error(error.message);
    }
    console.log(`Referral saved: ${referrerUsername} referred ${referredUsername}`);
  } catch (error) {
    console.error("Error saving referral:", error);
  }
};

// Get referrals made by a specific player (from Supabase)
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

// Player creation and update functions
export const createOrUpdatePlayer = async (
  player: ScorpionMiner,
  referrerId?: number,
  referrerUsername?: string
): Promise<void> => {
  const db = await dbPromise;
  const now = Date.now();

  // Update local IndexedDB
  const newPlayerData: ScorpionMiner = {
    ...player,
    lastUpdated: now,
    referrerId: referrerId || player.referrerId || undefined,
  };

  await db.put("scorpionMiners", newPlayerData);

  try {
    // Sync to Supabase
    const { error } = await supabase
      .from("scorpion_miners")
      .upsert([convertDatesToISO(newPlayerData)], { onConflict: "id" });
    if (error) throw new Error(error.message);

    console.log("Player data synced successfully");

    // If a referrer exists, add the referral information
    if (referrerId && referrerUsername) {
      await addReferral(referrerId, player.id, referrerUsername, player.username || "");
    }
  } catch (error) {
    console.error("Error syncing player data to Supabase:", error);
  }
};

// Save and sync ScorpionMiner data to Supabase and IndexedDB
export const saveAndSyncScorpionMinerData = async (scorpionMiner: ScorpionMiner): Promise<void> => {
  const db = await dbPromise;

  // Update local IndexedDB
  await db.put('scorpionMiners', {
    ...scorpionMiner,
    lastUpdated: Date.now(),
  });

  // Sync to Supabase
  try {
    const { error } = await supabase
      .from('scorpion_miners')
      .upsert([convertDatesToISO(scorpionMiner)], { onConflict: 'id' });
    if (error) throw new Error(error.message);
    console.log('Data synced successfully');
  } catch (error) {
    console.error('Error syncing data to Supabase:', error);
  }
};

// Update and sync player data
export const updateAndSyncScorpionMinerData = async (id: number, updates: Partial<ScorpionMiner>): Promise<void> => {
  const db = await dbPromise;

  // Fetch existing data
  const existingData = await db.get('scorpionMiners', id);

  // Prepare updated data
  const updatedData: ScorpionMiner = {
    ...(existingData || { id, balance: 0, miningLevel: 1, energy: 100, rewards: 0 }),
    ...updates,
    lastUpdated: Date.now(),
  };

  // Update local IndexedDB
  await db.put('scorpionMiners', updatedData);

  // Sync to Supabase
  await saveAndSyncScorpionMinerData(updatedData);
};

export const savePlayerProgressToSupabase = async (userId: number, scorpionMiner: ScorpionMiner): Promise<void> => {
  try {
    // Create a complete ScorpionMiner object with the userId if it's missing
    const minerDataForSupabase = convertDatesToISO({ ...scorpionMiner, id: userId });

    // Save directly to Supabase
    const { error } = await supabase
      .from('scorpion_miners')
      .upsert([minerDataForSupabase], { onConflict: 'id' });

    if (error) {
      throw new Error(error.message);
    }

    console.log('Player progress saved directly to Supabase');
  } catch (error) {
    console.error('Error saving player progress to Supabase:', error);
  }
};


// Sync local data to Supabase
export const syncDataToSupabase = async (): Promise<void> => {
  const db = await dbPromise;
  const minerStore = db.transaction('scorpionMiners', 'readonly').objectStore('scorpionMiners');
  const miners = await minerStore.getAll();

  if (miners.length > 0) {
    const batchMiners = miners.map(convertDatesToISO);

    try {
      const { error } = await supabase.from('scorpion_miners').upsert(batchMiners, { onConflict: 'id' });
      if (error) throw new Error(error.message);
      console.log('Miners synced to Supabase successfully');
    } catch (error) {
      console.error('Error syncing miner data:', error);
    }
  }
};

// Sync data from Supabase to local IndexedDB
export const syncDataFromSupabase = async (): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction(['scorpionMiners', 'tasks'], 'readwrite');
  const minerStore = tx.objectStore('scorpionMiners');
  const taskStore = tx.objectStore('tasks');

  try {
    // Fetch all miners from Supabase
    const { data: miners, error } = await supabase.from('scorpion_miners').select('*');
    if (error) throw new Error(error.message);

    for (const miner of miners) {
      const localMiner = await minerStore.get(miner.id);
      if (!localMiner || miner.lastUpdated > localMiner.lastUpdated) {
        await minerStore.put(convertISOToDates(miner));
      }
    }

    // Fetch all tasks from Supabase and sync
    const { data: tasks, error: taskError } = await supabase.from('tasks').select('*');
    if (taskError) throw new Error(taskError.message);

    for (const task of tasks) {
      await taskStore.put({ id: task.miner_id, tasks: task.task_data });
    }

    await tx.done;
    console.log('Data sync from Supabase completed');
  } catch (error) {
    console.error('Error syncing data from Supabase:', error);
  }
};

// Perform two-way sync with loading indicator
export const performTwoWaySync = async (setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> => {
  setIsSyncing(true);
  try {
    await syncDataToSupabase();
    await syncDataFromSupabase();
    console.log('Two-way sync completed');
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    setIsSyncing(false);
  }
};

// Get ScorpionMiner data by ID
export const getScorpionMinerData = async (id: number): Promise<ScorpionMiner | undefined> => {
  const db = await dbPromise;
  return db.get('scorpionMiners', id);
};

// Get all ScorpionMiners data
export const getAllScorpionMiners = async (): Promise<ScorpionMiner[]> => {
  const db = await dbPromise;
  return db.getAll('scorpionMiners');
};

// Save tasks for a specific ScorpionMiner
export const saveScorpionMinerTasks = async (id: number, tasks: any): Promise<void> => {
  const db = await dbPromise;
  await db.put('tasks', { id, tasks });
};

// Delete a ScorpionMiner by ID
export const deleteScorpionMinerData = async (id: number): Promise<void> => {
  const db = await dbPromise;
  await db.delete('scorpionMiners', id);

  try {
    const { error } = await supabase.from('scorpion_miners').delete().eq('id', id);
    if (error) throw new Error(error.message);
    console.log('Miner data deleted successfully');
  } catch (error) {
    console.error('Error deleting miner data from Supabase:', error);
  }
};
