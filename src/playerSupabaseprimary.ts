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

// Save ScorpionMiner data directly to Supabase
export const saveScorpionMinerDataToSupabase = async (scorpionMiner: ScorpionMiner): Promise<void> => {
  try {
    const { error } = await supabase
      .from('scorpion_miners')
      .upsert([convertDatesToISO(scorpionMiner)], { onConflict: 'id' });

    if (error) throw new Error(error.message);
    console.log('Data saved to Supabase successfully');
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
  }
};

// Retrieve player data from Supabase
export const getScorpionMinerDataFromSupabase = async (id: number): Promise<ScorpionMiner | undefined> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    console.log('Data retrieved from Supabase', data);

    return data ? convertISOToDates(data) : undefined;
  } catch (error) {
    console.error('Error retrieving data from Supabase:', error);
    return undefined;
  }
};

// Save data to IndexedDB only if Supabase is unreachable (for offline caching)
export const saveToIndexedDBIfOffline = async (scorpionMiner: ScorpionMiner): Promise<void> => {
  const db = await dbPromise;
  try {
    // Attempt to save to Supabase first
    await saveScorpionMinerDataToSupabase(scorpionMiner);
  } catch (error) {
    console.error('Supabase unreachable, saving to IndexedDB instead', error);
    await db.put('scorpionMiners', {
      ...scorpionMiner,
      lastUpdated: Date.now(),
    });
    console.log('Data saved to IndexedDB');
  }
};

// Sync local IndexedDB data to Supabase
export const syncDataToSupabase = async (): Promise<void> => {
  const db = await dbPromise;
  const miners = await db.getAll('scorpionMiners');

  if (miners.length > 0) {
    const batchMiners = miners.map(convertDatesToISO);

    try {
      const { error } = await supabase.from('scorpion_miners').upsert(batchMiners, { onConflict: 'id' });
      if (error) throw new Error(error.message);
      console.log('Miners synced to Supabase successfully');
    } catch (error) {
      console.error('Error syncing data to Supabase:', error);
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

// Perform two-way sync (sync local data to Supabase, then fetch from Supabase)
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

// Get ScorpionMiner data by ID from IndexedDB
export const getScorpionMinerData = async (id: number): Promise<ScorpionMiner | undefined> => {
  const db = await dbPromise;
  return db.get('scorpionMiners', id);
};

// Get all ScorpionMiners data from IndexedDB
export const getAllScorpionMiners = async (): Promise<ScorpionMiner[]> => {
  const db = await dbPromise;
  return db.getAll('scorpionMiners');
};

// Delete a ScorpionMiner by ID from both IndexedDB and Supabase
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
