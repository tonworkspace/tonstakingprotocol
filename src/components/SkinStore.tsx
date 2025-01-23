import { motion } from 'framer-motion';
import { SKINS, SkinConfig } from '../config/skins';
import { purchaseSkin, setActiveSkin } from '../playerSupabase';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface SkinStoreProps {
  balance: number;
  ownedSkins: string[];
  activeSkin: string;
  onPurchase: (skinId: string) => void;
  onSelect: (skinId: string) => void;
  onClose: () => void;
  playerId: number;
}

// Add local storage keys
const STORAGE_KEYS = {
  ACTIVE_SKIN: 'scorpion_active_skin',
  OWNED_SKINS: 'scorpion_owned_skins'
};

const formatBalance = (balance: number) => {
  return balance.toLocaleString('en-US');
};

export const SkinStore: React.FC<SkinStoreProps> = ({
  balance,
  ownedSkins,
  activeSkin,
  onPurchase,
  onSelect,
  onClose,
  playerId,
}) => {
  // Cache skins in local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OWNED_SKINS, JSON.stringify(ownedSkins));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, activeSkin);
  }, [ownedSkins, activeSkin]);

  const handlePurchase = async (skin: SkinConfig) => {
    if (balance < skin.price) {
      toast.error("Insufficient balance to purchase this skin");
      return;
    }

    if (ownedSkins.includes(skin.id)) {
      toast('You already own this skin!');
      return;
    }

    try {
      await purchaseSkin(playerId, skin.id, skin.price);
      onPurchase(skin.id);
      toast.success(`Successfully purchased ${skin.name}!`);
      onClose();
    } catch (error) {
      console.error('Failed to purchase skin:', error);
      toast.error("Failed to purchase skin. Please try again later.");
    }
  };

  const handleSelect = async (skinId: string) => {
    if (!ownedSkins.includes(skinId)) {
      toast.error("You need to purchase this skin first!");
      return;
    }

    // Update locally first for instant feedback
    onSelect(skinId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, skinId);
    
    try {
      await setActiveSkin(playerId, skinId);
      toast.success("Skin equipped successfully!");
      onClose();
    } catch (error) {
      // Rollback on failure
      onSelect(activeSkin);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SKIN, activeSkin);
      console.error('Failed to select skin:', error);
      toast.error("Failed to equip skin. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-b from-[#2a2b2f] to-[#1a1b1f] rounded-xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl border border-gray-800 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#1a1b1f] to-[#2a2b2f] p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Scorpion Arsenal
              </h2>
              <p className="text-gray-400 mt-1">Balance: {formatBalance(balance)} 🦂</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200 border border-gray-700"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKINS.map((skin) => {
                const isOwned = ownedSkins.includes(skin.id);
                const isActive = activeSkin === skin.id;

                return (
                  <motion.div
                    key={skin.id}
                    className={`relative rounded-xl overflow-hidden ${
                      isActive ? 'ring-4 ring-[#f48d2f]' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    {/* Rarity Banner */}
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
                      ${skin.rarity === 'epic' ? 'bg-purple-500/80' : 
                        skin.rarity === 'rare' ? 'bg-blue-500/80' : 'bg-gray-500/80'}`}>
                      {skin.rarity}
                    </div>

                    {/* Main Content */}
                    <div className={`p-4 ${
                      isOwned ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-gray-900 to-black'
                    }`}>
                      <div className="aspect-square relative group">
                        <img 
                          src={skin.image} 
                          alt={skin.name} 
                          className={`w-full h-full object-contain transition-transform duration-300 
                            ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                        />
                        {isOwned && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                              ✓ Owned
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-white">{skin.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{skin.description}</p>
                        <p className="text-sm text-yellow-500 mt-1">
                          Reward Multiplier: {skin.rewardMultiplier}x
                        </p>
                        
                        <div className="mt-4">
                          {isActive ? (
                            <button
                              disabled
                              className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white opacity-50 cursor-not-allowed"
                            >
                              Equipped
                            </button>
                          ) : (
                            <button
                              onClick={() => isOwned ? handleSelect(skin.id) : handlePurchase(skin)}
                              disabled={!isOwned && balance < skin.price}
                              className={`w-full py-3 rounded-lg transition-all duration-200 ${
                                isOwned 
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                  : balance >= skin.price
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                    : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isOwned ? 'Equip Now' : `${skin.price} 🦂`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 