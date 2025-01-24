import { openDB, DBSchema } from 'idb';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { initCloudStorage } from '@telegram-apps/sdk';

// Initialize Telegram Cloud Storage (TCS)
const cloudStorage = initCloudStorage();

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

// Open IndexedDB
const dbPromise = openDB<ScorpionMinerDB>('ScorpionMinerDB', 1, {
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
  cooldownEndTime?: number | null;
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

// Save Scorpion Miner Data to Telegram Cloud Storage (TCS)
export const saveToCloudStorage = async (scorpionMiner: ScorpionMiner): Promise<void> => {
  try {
    await cloudStorage.set('balance', scorpionMiner.balance.toString());
    await cloudStorage.set('miningLevel', scorpionMiner.miningLevel.toString());
    await cloudStorage.set('energy', scorpionMiner.energy.toString());
    console.log('Scorpion Miner data cached in Telegram Cloud Storage.');
  } catch (error) {
    console.error('Error caching Scorpion Miner data in Cloud Storage:', error);
  }
};

// Get Scorpion Miner Data from Telegram Cloud Storage (TCS)
export const getFromCloudStorage = async (): Promise<Partial<ScorpionMiner> | null> => {
  try {
    const balance = await cloudStorage.get('balance');
    const miningLevel = await cloudStorage.get('miningLevel');
    const energy = await cloudStorage.get('energy');

    if (balance && miningLevel && energy) {
      return {
        balance: parseInt(balance, 10),
        miningLevel: parseInt(miningLevel, 10),
        energy: parseInt(energy, 10),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Scorpion Miner data from Cloud Storage:', error);
    return null;
  }
};

// Save and sync Scorpion Miner Data to IndexedDB, Supabase, and TCS
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
    console.log('Data synced successfully to Supabase');
  } catch (error) {
    console.error('Error syncing data to Supabase:', error);
  }

  // Cache critical data to Telegram Cloud Storage
  await saveToCloudStorage(scorpionMiner);
};

// Fetch Scorpion Miner Data from IndexedDB
export const getScorpionMinerData = async (id: number): Promise<ScorpionMiner | null> => {
  const db = await dbPromise;
  const minerData = await db.get('scorpionMiners', id);
  return minerData || null; // Return null if the data is not found
};

// Fetch and Sync Scorpion Miner Data from IndexedDB, Supabase, and TCS
export const performTwoWaySyncWithCloudStorage = async (minerId: number): Promise<void> => {
  // Step 1: Try fetching from Cloud Storage first
  const cachedData = await getFromCloudStorage();

  if (cachedData) {
    console.log('Using cached data from Cloud Storage:', cachedData);
    return; // Load the game state using cached data
  }

  // Step 2: If no cache, fetch from IndexedDB
  const localMiner = await getScorpionMinerData(minerId);
  if (localMiner) {
    console.log('Loaded data from IndexedDB:', localMiner);
    // Sync to Supabase and cache in Cloud Storage
    await saveAndSyncScorpionMinerData(localMiner);
    return;
  }

  // Step 3: If no local data, fetch from Supabase
  const supabaseMiner = await fetchMinerFromSupabase(minerId);
  if (supabaseMiner) {
    console.log('Loaded data from Supabase:', supabaseMiner);
    // Save fetched data locally
    await saveScorpionMinerData(supabaseMiner);
    // Cache in Cloud Storage
    await saveToCloudStorage(supabaseMiner);
  }
};

// Fetch Scorpion Miner Data from Supabase
export const fetchMinerFromSupabase = async (minerId: number): Promise<ScorpionMiner | null> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('*')
      .eq('id', minerId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error fetching Scorpion Miner data from Supabase:', error);
    return null;
  }
};

// Save Scorpion Miner Data to IndexedDB
export const saveScorpionMinerData = async (scorpionMiner: ScorpionMiner): Promise<void> => {
  const db = await dbPromise;
  await db.put('scorpionMiners', scorpionMiner);
};

// Sync data to Supabase
export const syncDataToSupabase = async (): Promise<void> => {
  const db = await dbPromise;
  const minerStore = db.transaction('scorpionMiners', 'readonly').objectStore('scorpionMiners');
  const miners = await minerStore.getAll();

  if (miners.length > 0) {
    const batchMiners = miners.map(convertDatesToISO);

    try {
      const { error: minerError } = await supabase.from('scorpion_miners').upsert(batchMiners, { onConflict: 'id' });
      if (minerError) throw new Error(minerError.message);
      console.log('Miners synced to Supabase successfully');
    } catch (error) {
      console.error('Error syncing miner data:', error);
    }
  }
};

// Sync data from Supabase
export const syncDataFromSupabase = async (): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction(['scorpionMiners', 'tasks'], 'readwrite');
  const minerStore = tx.objectStore('scorpionMiners');
  const taskStore = tx.objectStore('tasks');

  try {
    // Fetch all miners from Supabase
    const { data: miners, error: minerError } = await supabase.from('scorpion_miners').select('*');
    if (minerError) throw new Error(minerError.message);

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

// Delete Scorpion Miner Data
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

// Two-way sync function
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
