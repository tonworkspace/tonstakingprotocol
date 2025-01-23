import React from 'react';
import { Modal } from '@telegram-apps/telegram-ui';
import { ZapIcon } from 'lucide-react';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
import { motion } from 'framer-motion';
import CheckFootprint from './CheckFootprint';

interface ProfileHeaderProps {
  photoUrl?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  levelInfo?: {
    name: string;
    level: number;
  };
  showBoostButton?: boolean;
  customButton?: React.ReactNode;
  onBoostClick?: () => void;
  children?: React.ReactNode;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  photoUrl,
  username,
  firstName,
  lastName,
  levelInfo,
  showBoostButton = false,
  customButton,
  children
}) => {
  return (
    <>
    <CheckFootprint/>
    <div className="w-full p-4 bg-gray-800/50 backdrop-blur-sm p-6 border border-orange-500/50 shadow-xl relative rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Level Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f48d2f] to-yellow-500 rounded-full p-[2px]">
              <div className="w-full h-full bg-gray-900 rounded-full" />
            </div>
            
            {/* Profile Image */}
            <motion.div 
              className="relative p-0.5"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#f48d2f] ring-offset-2 ring-offset-gray-900">
                <img
                  src={photoUrl || 'https://xelene.me/telegram.gif'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
          
          <div className="ml-2 text-white">
            <p className="text-sm font-semibold">@{username || 'Username'}</p>
            <p className="text-xs text-gray-400 truncate max-w-[150px]">
              {firstName} {lastName || ''}
            </p>
            {levelInfo && (
              <p className="text-xs text-[#f48d2f]">
                {levelInfo.name} (Lv. {levelInfo.level})
              </p>
            )}
          </div>
        </div>

        <div>
          {showBoostButton && (
            <Modal
              header={
                <ModalHeader after={<ModalClose>Close</ModalClose>}>
                  Game Boost
                </ModalHeader>
              }
              trigger={
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2.5 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 font-medium min-w-[120px] sm:min-w-[140px] justify-center"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ZapIcon size={18} className="text-yellow-300" />
                  </motion.div>
                  <span className="whitespace-nowrap">Boost</span>
                </motion.button>
              }
            >
              {children}
            </Modal>
          )}
          {customButton && (
            <div className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px]">
              {customButton}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}; 