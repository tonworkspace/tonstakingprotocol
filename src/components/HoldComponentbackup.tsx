// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Title, Modal, Button, List } from '@telegram-apps/telegram-ui';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ZapIcon, LucideIcon } from 'lucide-react';
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
// import StatsModal from './StatsModal';
// import { scorpion } from '@/images';
// import { Task } from '@/gameData';

// interface User {
//   id: number;
//   photoUrl?: string;
//   username?: string;
//   firstName?: string;
//   lastName?: string;
// }

// interface LevelInfo {
//   name: string;
//   level: number;
// }

// interface SpecialEvent {
//   id: string;
//   name: string;
//   description: string;
//   startTime: Date;
//   endTime: Date;
// }

// interface HoldComponentProps {
//   user: User;
//   levelInfo: LevelInfo;
//   balance: number;
//   rewards: number;
//   energy: number;
//   maxEnergy: number;
//   cooldown: boolean;
//   cooldownTimeRemaining: number;
//   isHolding: boolean;
//   setIsHolding: React.Dispatch<React.SetStateAction<boolean>>;
//   setRewards: React.Dispatch<React.SetStateAction<number>>;
//   setEnergy: React.Dispatch<React.SetStateAction<number>>;
//   setBalance: React.Dispatch<React.SetStateAction<number>>;
//   setCooldown: React.Dispatch<React.SetStateAction<boolean>>;
//   setCooldownTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
//   handleBuyUpgrade: (upgradeId: string, baseCost: number) => void;
//   handleMining: (newRewards: number, newEnergy: number) => void;
//   handleHarvest: () => Promise<void>;
//   showSnackbar: (message: string, description: string) => void;
//   levels: { name: string; minBalance: number; maxBalance: number; level: number }[];
//   getLevel: (balance: number) => { name: string; level: number };
//   setLevelInfo: React.Dispatch<React.SetStateAction<LevelInfo>>;
//   comboTimeLimit: number;
//   tasksCompleted: number;
//   totalScorpionsCaught: number;
//   setTotalScorpionsCaught: React.Dispatch<React.SetStateAction<number>>;
//   currentEvent: SpecialEvent | null;
//   upgradeItems: UpgradeItem[];
//   upgradeLevels: UpgradeLevels;
//   tasks: Task[]
//   isSnackbarVisible: boolean
//   setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>
//   snackbarMessage: string
//   snackbarDescription: string
// }

// interface UpgradeItem {
//   id: string;
//   name: string;
//   baseCost: number;
//   effect: string;
//   icon: LucideIcon;
// }

// interface UpgradeLevels {
//   energyBoost: number;
//   regenerationRate: number;
//   cooldownReduction: number;
//   [key: string]: number;
// }

// const IconWrapper: React.FC<{ icon: LucideIcon; size?: number; className?: string }> = ({ icon: Icon, size, className }) => {
//   return <Icon size={size} className={className} />;
// };

// const HoldComponent: React.FC<HoldComponentProps> = ({
//   user,
//   levelInfo,
//   balance,
//   rewards,
//   energy,
//   maxEnergy,
//   cooldown,
//   cooldownTimeRemaining,
//   isHolding,
//   setIsHolding,
//   setRewards,
//   setEnergy,
//   setBalance,
//   setCooldown,
//   setCooldownTimeRemaining,
//   upgradeLevels,
//   handleBuyUpgrade,
//   showSnackbar,
//   levels,
//   getLevel,
//   setLevelInfo,
//   tasksCompleted,
//   totalScorpionsCaught,
//   currentEvent,
//   upgradeItems,
// }) => {
//   const [showLevelUp, setShowLevelUp] = useState(false);
//   const [helperMessage, setHelperMessage] = useState<string>('');
//   const animationFrameRef = useRef<number | null>(null);
//   const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
//   // Adjusted cooldown time and harvest threshold
//   const COOLDOWN_TIME = 3 * 60 * 60; // 3 hours in seconds


//   const doubleRewardsActive = upgradeLevels['3'] > 0;

//   useEffect(() => {
//     let holdInterval: NodeJS.Timeout;
//     if (isHolding && energy > 0) {
//       holdInterval = setInterval(() => {
//         const randomEnergyDrop = Math.floor(Math.random() * 5) + 1;
//         const rewardMultiplier = doubleRewardsActive ? 4 : 2;
//         setRewards((prev) => prev + randomEnergyDrop * rewardMultiplier);
//         setEnergy((prev) => Math.max(0, prev - randomEnergyDrop));

//         if (energy === 0) {
//           autoHarvest();
//         }
//       }, 500);
//     }
//     return () => clearInterval(holdInterval);
//   }, [isHolding, energy, doubleRewardsActive]);

//   const autoHarvest = () => {
//     setBalance((prevBalance) => prevBalance + rewards);
//     setRewards(0);
//     setIsHolding(false);
//     setCooldown(true);
//     setCooldownTimeRemaining(COOLDOWN_TIME);

//     setTimeout(() => {
//       setEnergy(maxEnergy);
//       setCooldown(false);
//       setCooldownTimeRemaining(0);
//     }, COOLDOWN_TIME * 1000);
//   };

//   const stopHold = () => {
//     setIsHolding(false);
//     autoHarvest();
//   };

//   useEffect(() => {
//     if (energy === 0 && !isHolding) {
//       setCooldown(true);
//       setCooldownTimeRemaining(COOLDOWN_TIME);
//     }
//   }, [energy]);

//   useEffect(() => {
//     let cooldownInterval: NodeJS.Timeout;
//     if (cooldownTimeRemaining > 0) {
//       cooldownInterval = setInterval(() => {
//         setCooldownTimeRemaining((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(cooldownInterval);
//   }, [cooldownTimeRemaining]);

//   const startHold = () => {
//     if (!cooldown && energy > 0) {
//       setIsHolding(true);
//     }
//   };

//   const formatCountdown = (seconds: number): string => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//       if (comboTimerRef.current) {
//         clearInterval(comboTimerRef.current);
//       }
//       if (holdIntervalRef.current) {
//         clearInterval(holdIntervalRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const newLevelInfo = getLevel(balance);
//     if (newLevelInfo.level > levelInfo.level) {
//       setShowLevelUp(true);
//       showSnackbar('Level Up!', `You are now ${newLevelInfo.name}`);
//       setTimeout(() => setShowLevelUp(false), 3000);
//     }
//     setLevelInfo(newLevelInfo);
//   }, [balance, getLevel, levelInfo.level, setLevelInfo, showSnackbar]);

//   const BalanceDisplay: React.FC<{ balance: number }> = ({ balance }) => (
//     <motion.div
//       initial={{ scale: 1 }}
//       animate={{ scale: [1, 1.1, 1] }}
//       transition={{ duration: 0.3 }}
//     >
//       <p className="text-4xl font-bold text-[#fff]">
//         {balance}
//       </p>
//     </motion.div>
//   );

//   return (
//     <div className="relative p-custom">
//       <div className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-md">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="p-2 rounded-lg shadow-md">
//               <img
//                 src={user?.photoUrl || 'https://xelene.me/telegram.gif'}
//                 alt="Profile"
//                 width={40}
//                 height={40}
//                 className="rounded-full shadow-lg"
//               />
//             </div>
//             <div className="ml-2 text-white">
//               <p className="text-sm font-semibold">@{user?.username || 'Username'}</p>
//               <p className="text-xs text-gray-400">
//                 {user?.firstName} {user?.lastName || ''}
//               </p>
//               <p className="text-xs text-[#f48d2f]">{levelInfo.name} (Lv. {levelInfo.level})</p>
//             </div>
//           </div>
//            <Modal
//             header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Game Boost</ModalHeader>}
//             trigger={
//               <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-200 ease-in-out flex items-center">
//                 <IconWrapper icon={ZapIcon} size={18} className="mr-1" /> Boost
//               </button>
//             }
//           >
//                     <List>
//                       {upgradeItems.map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex justify-between items-center bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-lg"
//                         >
//                           <div>
//                             <p className="text-sm font-bold">{item.name}</p>
//                             <p className="text-xs">{item.effect}</p>
//                             <p className="text-xs text-[#f48d2f]">Cost: {item.baseCost * (upgradeLevels[item.id] || 1)} Scorpions</p>
//                           </div>
//                           <Button
//                             disabled={balance < item.baseCost * (upgradeLevels[item.id] || 1)}
//                             onClick={() => handleBuyUpgrade(item.id, item.baseCost)}
//                             size="m"
//                             color={balance >= item.baseCost * (upgradeLevels[item.id] || 1) ? 'green' : 'gray'}
//                           >
//                             Buy
//                           </Button>
//                         </div>
//                       ))}
//                     </List>
//                   </Modal>
//         </div>
//       </div>

//       <div className="flex justify-center mt-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="text-center"
//         >
//           <Title caps level="1" weight="1" className="text-5xl text-white">
//             <BalanceDisplay balance={balance} />
//           </Title>
//           <p className="text-lg text-[#f48d2f]">
//             Catching <strong>{rewards} scorpions</strong>
//           </p>
         
//         </motion.div>
//       </div>

//       <div className="flex justify-center mt-2">
//         <div className="text-center">
//           <StatsModal
//             userId={user?.username || 'anonymous'}
//             balance={balance}
//             levelInfo={levelInfo}
//             energy={energy}
//             tasksCompleted={tasksCompleted}
//             totalScorpionsCaught={totalScorpionsCaught}
//           />
//         </div>
//       </div>

//       <div className="flex justify-center mt-6">
//         <motion.div
//           className={`relative w-[250px] h-[250px] rounded-full border-8 border-[#f48d2f] flex items-center justify-center cursor-pointer ${
//             cooldown ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           onMouseDown={cooldownTimeRemaining === 0 ? startHold : undefined}
//           onMouseUp={cooldownTimeRemaining === 0 ? stopHold : undefined}
//           onTouchStart={cooldownTimeRemaining === 0 ? startHold : undefined}
//           onTouchEnd={cooldownTimeRemaining === 0 ? stopHold : undefined}
//           onContextMenu={(e) => e.preventDefault()}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <img src={scorpion} alt="Scorpion" className="w-48 h-48 object-cover no-select" />
//           <AnimatePresence>
//             {isHolding && (
//               <motion.div
//                 className="absolute inset-0 bg-[#f48d2f] opacity-30 rounded-full flex justify-center items-center"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.3 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
//               >
//                 <p className="text-white text-2xl font-bold">{rewards} Scorpions</p>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <AnimatePresence>
//           </AnimatePresence>
//         </motion.div>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//       {cooldownTimeRemaining > 0 ? (
//           <div className="bg-[#f48d2f] text-white font-bold px-2 rounded-full">
//              {formatCountdown(cooldownTimeRemaining)}
//           </div>
//         ) : (
//           <div className="bg-[#f48d2f] text-white font-bold px-4 rounded-full">{energy}%</div>
//         )}
//         <span className="text-[#f48d2f] font-semibold">
//           {cooldown ? (
//             <span className="text-sm">Cooling Down</span>
//           ) : (
//             <span className="text-sm">Hold to Catch</span>
//           )}
//         </span>
//       </div>

//       <div className="relative w-full h-6 bg-gray-700 rounded-full shadow-md overflow-hidden mb-2 mt-2">
//         <motion.div
//           className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
//           initial={{ width: '100%' }}
//           animate={{ width: `${(energy / maxEnergy) * 100}%` }}
//           transition={{ type: 'spring', stiffness: 120, damping: 20 }}
//         />
//         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//           <span className="text-xs font-bold text-white drop-shadow-md">
//             {Math.floor((energy / maxEnergy) * 100)}%
//           </span>
//         </div>
//       </div>
//        {/* Helper message */}
//        <div className="mt-2 text-center">
//         <p className="text-white font-semibold">{helperMessage}</p>
//       </div>


//       {currentEvent && (
//         <div className="mt-4 bg-blue-600 text-white p-4 rounded-lg shadow-md">
//           <h3 className="text-lg font-bold mb-2">{currentEvent.name}</h3>
//           <p>{currentEvent.description}</p>
//         </div>
//       )}

//       <AnimatePresence>
//         {showLevelUp && (
//           <motion.div
//             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0, opacity: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h2 className="text-2xl font-bold">Level Up!</h2>
//             <p>You are now {levelInfo.name}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-white mb-2">Upcoming Milestones</h3>
//         <div className="space-y-2">
//           {levels.filter(level => level.level > levelInfo.level).slice(0, 3).map((level) => (
//             <div key={level.level} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
//               <div>
//                 <p className="text-white font-semibold">{level.name}</p>
//                 <p className="text-sm text-gray-400">Level {level.level}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[#f48d2f] font-bold">{level.minBalance} Scorpions</p>
//                 <p className="text-xs text-gray-400">{level.minBalance - balance} more to go</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
        
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-white mb-2">Recent Achievements</h3>
//         <div className="space-y-2">
//           {levels.filter(level => level.level <= levelInfo.level).slice(-3).reverse().map((level) => (
//             <div key={level.level} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
//               <div>
//                 <p className="text-white font-semibold">{level.name}</p>
//                 <p className="text-sm text-gray-400">Level {level.level}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-green-500 font-bold">Achieved!</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HoldComponent;