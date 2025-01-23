import React from 'react';
import { Modal, List } from '@telegram-apps/telegram-ui';
import { motion } from 'framer-motion';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
import { Trophy, Award, Target, Battery, Coins } from 'lucide-react';

interface StatsModalProps {
  userId: string;
  balance: number;
  levelInfo: { name: string; level: number };
  energy: number;
  tasksCompleted: number;
  totalScorpionsCaught: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ 
  balance, 
  levelInfo, 
  energy, 
  tasksCompleted, 
  totalScorpionsCaught 
}) => {
  const formatNumber = (num: string | number): string => {
    return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const StatItem = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
    <motion.div 
      className="stat-item text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#f48d2f]/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#f48d2f]" />
      </div>
      <p className="text-2xl font-bold text-white">
        {label.includes('Energy') ? `${Math.floor(Number(value))}%` : formatNumber(value)}
      </p>
      <p className="text-sm text-[#f48d2f]">{label}</p>
    </motion.div>
  );

  return (
    <Modal
      header={
        <ModalHeader after={<ModalClose>Close</ModalClose>}>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#f48d2f]" />
            <span>Game Stats</span>
          </div>
        </ModalHeader>
      }
      trigger={
        <motion.button
          className="bg-[#f48d2f] hover:bg-[#e67e22] text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy className="w-4 h-4" />
          <span>Stats</span>
        </motion.button>
      }
    >
      <List>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg"
        >
          {/* Level Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#f48d2f]/20 to-orange-600/20 p-4 rounded-xl mb-6 border border-[#f48d2f]/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Rank</p>
                <h2 className="text-2xl font-bold text-[#f48d2f]">{levelInfo.name}</h2>
              </div>
              <div className="bg-[#f48d2f]/20 px-3 py-1 rounded-full">
                <p className="text-[#f48d2f] font-semibold">Level {levelInfo.level}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon={Coins}
              value={balance}
              label="Total Balance"
            />
            <StatItem
              icon={Target}
              value={totalScorpionsCaught}
              label="Scorpions Caught"
            />
            <StatItem
              icon={Award}
              value={tasksCompleted}
              label="Tasks Completed"
            />
            <StatItem
              icon={Battery}
              value={energy}
              label="Current Energy"
            />
          </div>
        </motion.div>
      </List>
    </Modal>
  );
};

export default StatsModal;