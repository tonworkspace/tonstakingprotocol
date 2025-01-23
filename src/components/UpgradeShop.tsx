import React from 'react';
import { Modal, List, Button } from '@telegram-apps/telegram-ui';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
import { motion } from 'framer-motion';
import { FaCoins, FaBolt, FaClock, FaFire, FaMagic } from 'react-icons/fa';

interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  effect: string;
  icon: React.ElementType;
}

interface UpgradeShopProps {
  balance: number;
  upgradeItems: UpgradeItem[];
  upgradeLevels: { [key: string]: number };
  handleBuyUpgrade: (upgradeId: string, baseCost: number) => void;
}

const upgradeItems: UpgradeItem[] = [
  {
    id: '1',
    name: 'Energy Boost',
    description: 'Increase max energy by 10',
    baseCost: 100,
    effect: 'Max Energy +10',
    icon: FaBolt,
  },
  {
    id: '2',
    name: 'Cooldown Reducer',
    description: 'Reduce cooldown time by 10 minutes',
    baseCost: 200,
    effect: 'Cooldown -10 min',
    icon: FaClock,
  },
  {
    id: '3',
    name: 'Double Rewards',
    description: 'Double scorpion rewards for 1 hour',
    baseCost: 300,
    effect: '2x Rewards (1h)',
    icon: FaCoins,
  },
  {
    id: '4',
    name: 'Combo Extender',
    description: 'Increase combo time limit by 5 seconds',
    baseCost: 400,
    effect: 'Combo Time +5s',
    icon: FaFire,
  },
  {
    id: '5',
    name: 'Instant Refill',
    description: 'Instantly refill energy and remove cooldown',
    baseCost: 500,
    effect: 'Full Energy Now',
    icon: FaMagic,
  },
];

const UpgradeShop: React.FC<UpgradeShopProps> = ({
  balance,
  upgradeLevels,
  handleBuyUpgrade,
}) => {
  return (
    <Modal
      header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Upgrade Shop</ModalHeader>}
      trigger={
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-full shadow-lg transition duration-200 ease-in-out"
        >
          <FaCoins size={24} />
        </motion.button>
      }
    >
      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Upgrade Shop</h2>
        <p className="text-lg text-yellow-400 mb-6">Your Balance: {balance} Scorpions</p>
        <List>
          {upgradeItems.map((item) => {
            const currentLevel = upgradeLevels[item.id] || 0;
            const cost = item.baseCost * (currentLevel + 1);
            const canAfford = balance >= cost;

            return (
              <motion.div
                key={item.id}
                className="bg-gray-800 p-4 mb-4 rounded-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <item.icon size={24} className="text-yellow-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                      <p className="text-xs text-green-400 mt-1">Current Level: {currentLevel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-yellow-400 mb-2">Cost: {cost} Scorpions</p>
                    <Button
                      disabled={!canAfford}
                      onClick={() => handleBuyUpgrade(item.id, item.baseCost)}
                      size="s"
                      color={canAfford ? 'green' : 'gray'}
                    >
                      {canAfford ? 'Upgrade' : 'Not Enough'}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-blue-400 mt-2">Effect: {item.effect}</p>
              </motion.div>
            );
          })}
        </List>
      </div>
    </Modal>
  );
};

export default UpgradeShop;