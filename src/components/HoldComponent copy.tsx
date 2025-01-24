// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Title, Modal, Button } from '@telegram-apps/telegram-ui';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ZapIcon, BatteryCharging, Clock, Zap, TrendingUp, LucideIcon } from 'lucide-react';
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

// const MAX_UPGRADE_LEVEL = 3;

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
//   handleMining,
//   handleHarvest,
//   showSnackbar,
//   levels,
//   getLevel,
//   setLevelInfo,
//   comboTimeLimit,
//   tasksCompleted,
//   totalScorpionsCaught,
//   setTotalScorpionsCaught,
//   currentEvent,
//   upgradeItems,
// }) => {
//   const [comboMultiplier, setComboMultiplier] = useState(1);
//   const [holdDuration, setHoldDuration] = useState(0);
//   const [showLevelUp, setShowLevelUp] = useState(false);
//   const [comboTimeRemaining, setComboTimeRemaining] = useState(comboTimeLimit);
//   const [displayedRewards, setDisplayedRewards] = useState(rewards);
//   const [catchAnimations, setCatchAnimations] = useState<{ id: number; x: number; y: number }[]>([]);
//   const [helperMessage, setHelperMessage] = useState<string>('');
//   const [countdown, setCountdown] = useState<number>(0);

//   const holdStartTime = useRef<number | null>(null);
//   const animationFrameRef = useRef<number | null>(null);
//   const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  

//   const doubleRewardsActive = upgradeLevels['3'] > 0;

//   const calculateEnergyDepletionRate = useCallback(() => {
//     return maxEnergy / (100 * (1 + upgradeLevels.energyBoost * 0.1));
//   }, [maxEnergy, upgradeLevels.energyBoost]);

//   const updateHelperMessage = useCallback(() => {
//     if (cooldown) {
//       setHelperMessage('Cooling down. Wait for the timer to finish.');
//     } else if (energy <= 0) {
//       setHelperMessage('No energy left. Wait for it to regenerate.');
//     } else if (isHolding) {
//       if (comboMultiplier >= 2.5) {
//         setHelperMessage('Great combo! Consider releasing soon to secure your catch.');
//       } else if (energy < maxEnergy * 0.2) {
//         setHelperMessage('Energy running low! Consider releasing soon.');
//       } else {
//         setHelperMessage('Keep holding to increase your combo!');
//       }
//     } else {
//       setHelperMessage('Hold the scorpion to start catching!');
//     }
//   }, [cooldown, energy, maxEnergy, isHolding, comboMultiplier]);

//   useEffect(() => {
//     updateHelperMessage();
//   }, [cooldown, energy, isHolding, comboMultiplier, updateHelperMessage]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (cooldown && cooldownTimeRemaining > 0) {
//       setCountdown(cooldownTimeRemaining);
//       timer = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [cooldown, cooldownTimeRemaining]);


//   const formatCountdown = (seconds: number): string => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const animateHold = useCallback(() => {
//     if (holdStartTime.current && energy > 0) {
//       const currentTime = Date.now();
//       const newHoldDuration = (currentTime - holdStartTime.current) / 1000;
//       setHoldDuration(newHoldDuration);
  
//       const energyDepletionRate = calculateEnergyDepletionRate();
//       const newEnergy = Math.max(0, energy - energyDepletionRate);
  
//       const newComboMultiplier = Math.min(1 + (newHoldDuration / 5), 3);
//       setComboMultiplier(newComboMultiplier);
  
//       const baseReward = Math.floor(Math.random() * 50) + 75;
//       let earnedRewards = Math.floor(baseReward * newComboMultiplier * (doubleRewardsActive ? 2 : 1));
      
//       if (currentEvent && currentEvent.id === 'double-rewards') {
//         earnedRewards *= 2;
//       }
  
//       const newRewards = rewards + earnedRewards;
//       const newTotalScorpionsCaught = totalScorpionsCaught + earnedRewards;
  
//       setEnergy(newEnergy);
//       setRewards(newRewards);
//       setDisplayedRewards(newRewards);
//       setTotalScorpionsCaught(newTotalScorpionsCaught);
      
//       setCatchAnimations(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
  
//       handleMining(earnedRewards, newEnergy);
  
//       if (newEnergy > 0 && comboTimeRemaining > 0) {
//         animationFrameRef.current = requestAnimationFrame(animateHold);
//       } else {
//         stopHold();
//       }
//     }
//   }, [
//     energy,
//     rewards,
//     totalScorpionsCaught,
//     comboTimeRemaining,
//     doubleRewardsActive,
//     currentEvent,
//     setEnergy,
//     setRewards,
//     setTotalScorpionsCaught,
//     handleMining,
//     calculateEnergyDepletionRate
//   ]);

//   const startHold = useCallback(() => {
//     if (!cooldown && energy > 0) {
//       setIsHolding(true);
//       holdStartTime.current = Date.now();
//       setComboTimeRemaining(comboTimeLimit);
//       animateHold();
      
//       if (comboTimerRef.current) {
//         clearInterval(comboTimerRef.current);
//       }
//       comboTimerRef.current = setInterval(() => {
//         setComboTimeRemaining((prev) => {
//           if (prev <= 0) {
//             stopHold();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       holdIntervalRef.current = setInterval(() => {
//         setHoldDuration((prevDuration) => prevDuration + 0.1);
//       }, 100);
//     } else {
//       showSnackbar('Cannot start mining', cooldown ? 'Cooldown active' : 'No energy left');
//     }
//   }, [cooldown, energy, comboTimeLimit, setIsHolding, animateHold, showSnackbar]);

//   const stopHold = useCallback(async () => {
//     setIsHolding(false);
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
//     if (comboTimerRef.current) {
//       clearInterval(comboTimerRef.current);
//     }
    
//     setBalance(prevBalance => prevBalance + displayedRewards);
    
//     await handleHarvest();
    
//     setComboTimeRemaining(comboTimeLimit);
//     setCooldown(true);
//     setCooldownTimeRemaining(5 * 60); // 5 minutes cooldown
    
//     if (holdIntervalRef.current) {
//       clearInterval(holdIntervalRef.current);
//     }
//     setHoldDuration(0);
//     setComboMultiplier(1);
//     setDisplayedRewards(0);

//     showSnackbar('Mining Complete!', `You caught ${displayedRewards} scorpions!`);
//   }, [comboTimeLimit, handleHarvest, setIsHolding, setCooldown, setCooldownTimeRemaining, setBalance, displayedRewards, showSnackbar]);

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

//   const handleUpgradePurchase = useCallback((upgradeId: string, baseCost: number) => {
//     const currentLevel = upgradeLevels[upgradeId] || 0;
//     const cost = baseCost * (currentLevel + 1);

//     if (balance >= cost) {
//       setBalance(prevBalance => prevBalance - cost);
//       handleBuyUpgrade(upgradeId, baseCost);
//     } else {
//       showSnackbar('Insufficient scorpions!', 'Not enough scorpions to purchase this upgrade.');
//     }
//   }, [balance, upgradeLevels, setBalance, handleBuyUpgrade, showSnackbar]);

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
//           <Modal
//             header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Game Boost</ModalHeader>}
//             trigger={
//               <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-200 ease-in-out flex items-center">
//                 <IconWrapper icon={ZapIcon} size={18} className="mr-1" /> Boost
//               </button>
//             }
//           >
//             {upgradeItems.map((item) => {
//               const currentLevel = upgradeLevels[item.id] || 0;
//               const cost = item.baseCost * (currentLevel + 1);
//               const isMaxLevel = currentLevel >= MAX_UPGRADE_LEVEL;

//               return (
//                 <div
//                   key={item.id}
//                   className="flex justify-between items-center bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-lg"
//                 >
//                   <div className="flex items-center">
//                     <IconWrapper icon={item.icon} size={24} className="mr-3 text-blue-400" />
//                     <div>
//                       <p className="text-sm font-bold">{item.name}</p>
//                       <p className="text-xs">{item.effect}</p>
//                       <p className="text-xs text-[#f48d2f]">
//                         {isMaxLevel ? 'Max Level' : `Cost: ${cost} Scorpions`}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end">
//                     <p className="text-sm font-semibold mb-1">
//                       Level: {currentLevel}/{MAX_UPGRADE_LEVEL}
//                     </p>
//                     <Button
//                       disabled={isMaxLevel || balance < cost}
//                       onClick={() => handleUpgradePurchase(item.id, item.baseCost)}
//                       size="m"
//                       color={isMaxLevel ? 'gray' : balance >= cost ? 'green' : 'gray'}
//                     >
//                       {isMaxLevel ? 'Maxed' : 'Upgrade'}
//                     </Button>
//                   </div>
//                 </div>
//               );
//             })}
//           </Modal>
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
//             Catching <strong>{displayedRewards} scorpions</strong>
//           </p>
//           <p className="text-sm text-[#f48d2f]">
//             Combo: x{comboMultiplier.toFixed(1)}
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
//           onMouseDown={!cooldown ? startHold : undefined}
//           onMouseUp={!cooldown ? stopHold : undefined}
//           onMouseLeave={!cooldown ? stopHold : undefined}
//           onTouchStart={!cooldown ? startHold : undefined}
//           onTouchEnd={!cooldown ? stopHold : undefined}
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
//                 <p className="text-white text-2xl font-bold">{displayedRewards} Scorpions</p>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <AnimatePresence>
//             {catchAnimations.map((anim) => (
//               <motion.div
//                 key={anim.id}
//                 className="absolute text-2xl"
//                 initial={{ opacity: 1, scale: 0.5, x: anim.x + '%', y: anim.y + '%' }}
//                 animate={{ opacity: 0, scale: 1.5, y: anim.y - 20 + '%' }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 🦂
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>
//       </div>

//       <div className="flex justify-between items-center mt-4">
//         {cooldown ? (
//           <div className="bg-[#f48d2f] text-white font-bold px-2 rounded-full">
//             {formatCountdown(countdown)}
//           </div>
//         ) : (
//           <div className="bg-[#f48d2f] text-white font-bold px-2 rounded-full">{holdDuration.toFixed(1)}s</div>
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