import { openDB, DBSchema } from 'idb';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase initialization
const supabaseUrl = "https://ioxvnoufbpphhtyqpmyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHZub3VmYnBwaGh0eXFwbXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNTc4NDcsImV4cCI6MjA0MTczMzg0N30.p6hIjsmxQ1YK-n5pv6xh2XroHUUQ_gEctFebXVDTfVg";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface ScorpionMinerDB extends DBSchema {
  scorpionMiners: {
    key: number;
    value: ScorpionMiner;
  };
  sessions: {
    key: number;
    value: { id: number; sessionData: string; timestamp: number }; // Ensure `id` exists here
  };
}

// Open IndexedDB connection
const dbPromise = openDB<ScorpionMinerDB>('ScorpionMinerDB', 1, {
  upgrade(db) {
    db.createObjectStore('scorpionMiners', { keyPath: 'id' });
    db.createObjectStore('sessions', { keyPath: 'id' }); // Store session data
  },
});

// ScorpionMiner interface
export interface ScorpionMiner {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  languageCode?: string;
  balance: number;
  miningLevel: number;
  energy: number;
  rewards: number;
  lastHarvestTime?: number;
  lastExhaustedTime?: number;
  cooldownEndTime?: number | null;
  referrerId?: number;
  referredPlayers?: number[];
  lastLoginDate?: string;
  loginStreak?: number;
  lastUpdated: number;
}

// Helper functions for date conversion
const convertDatesToISO = (miner: ScorpionMiner): any => ({
  ...miner,
  lastHarvestTime: miner.lastHarvestTime ? new Date(miner.lastHarvestTime).toISOString() : null,
  lastExhaustedTime: miner.lastExhaustedTime ? new Date(miner.lastExhaustedTime).toISOString() : null,
  cooldownEndTime: miner.cooldownEndTime ? new Date(miner.cooldownEndTime).toISOString() : null,
  lastUpdated: new Date(miner.lastUpdated).toISOString(),
});

const convertISOToDates = (miner: any): ScorpionMiner => ({
  ...miner,
  lastHarvestTime: miner.lastHarvestTime ? new Date(miner.lastHarvestTime).getTime() : undefined,
  lastExhaustedTime: miner.lastExhaustedTime ? new Date(miner.lastExhaustedTime).getTime() : undefined,
  cooldownEndTime: miner.cooldownEndTime ? new Date(miner.cooldownEndTime).getTime() : undefined,
});

// **Main Backend Functions: Supabase as main, IndexedDB for persistence**

export const fetchPlayerDataFromSupabase = async (playerId: number): Promise<ScorpionMiner | null> => {
  try {
    const { data, error } = await supabase
      .from('scorpion_miners')
      .select('*')
      .eq('id', playerId)
      .single();

    if (error || !data) return null;

    // Save to IndexedDB for persistence after fetching from Supabase
    const db = await dbPromise;
    await db.put('scorpionMiners', convertISOToDates(data));

    return convertISOToDates(data);
  } catch (error) {
    console.error('Error fetching player data from Supabase', error);
    return null;
  }
};

// Fetch player data from IndexedDB as a fallback for persistence
export const fetchPlayerDataFromIndexedDB = async (playerId: number): Promise<ScorpionMiner | null> => {
  try {
    const db = await dbPromise;
    const miner = await db.get('scorpionMiners', playerId);
    return miner ? miner : null; // If miner is undefined, return null
  } catch (error) {
    console.error('Error fetching player data from IndexedDB', error);
    return null;
  }
};



// Save player data to Supabase first, then to IndexedDB for persistence
export const savePlayerDataToSupabaseAndIndexedDB = async (miner: ScorpionMiner): Promise<void> => {
  try {
    // Sync to Supabase first
    const { error } = await supabase
      .from('scorpion_miners')
      .upsert([convertDatesToISO(miner)], { onConflict: 'id' });

    if (error) throw new Error(error.message);

    // Save to IndexedDB after successful Supabase save
    const db = await dbPromise;
    await db.put('scorpionMiners', miner);
  } catch (error) {
    console.error('Error saving player data:', error);
  }
};

// Sync data between Supabase and IndexedDB
export const syncDataBetweenSupabaseAndIndexedDB = async (): Promise<void> => {
  const db = await dbPromise;
  const miners = await db.getAll('scorpionMiners');

  // Sync IndexedDB miners to Supabase
  if (miners.length > 0) {
    const minersToSync = miners.map(convertDatesToISO);
    try {
      const { error } = await supabase.from('scorpion_miners').upsert(minersToSync, { onConflict: 'id' });
      if (error) throw new Error(error.message);
      console.log('Data sync between Supabase and IndexedDB completed');
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }
};


// Save session data for persistence
export const saveSessionData = async (sessionId: number, sessionData: string): Promise<void> => {
  const db = await dbPromise;
  await db.put('sessions', { id: sessionId, sessionData, timestamp: Date.now() }); // Adding `id` field
};


// Fetch session data
export const getSessionData = async (sessionId: number): Promise<string | null> => {
  const db = await dbPromise;
  const session = await db.get('sessions', sessionId);
  return session ? session.sessionData : null;
};
