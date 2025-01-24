// import {
//   List,
//   Modal,
//   Placeholder,
//   Tabbar,
//   Title,
//   Button,
//   Snackbar,
// } from '@telegram-apps/telegram-ui';
// import { FC, useState, useEffect } from 'react';
// import {
//   GiPickle,
//   GiScrollUnfurled
// } from 'react-icons/gi';
// import {
//   FaFacebook,
//   FaInstagram,
//   FaTelegramPlane,
//   FaTwitter,
//   FaUserFriends,
//   FaYoutube,
//   FaBug,
//   FaSpinner,
//   FaExternalLinkAlt,
// } from 'react-icons/fa';
// import { initUtils, useInitData } from '@telegram-apps/sdk-react';
// import { motion } from 'framer-motion';
// import { scorpion } from '@/images'; // Ensure this is the correct path for the image
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
// import {
//   getReferralsByPlayer,
//   performTwoWaySync,
//   savePlayerProgressToSupabase,
//   ScorpionMiner,
//   syncDataFromSupabase,
//   updateAndSyncScorpionMinerData
// } from '@/playerSupabase';
// import { openDB } from 'idb';

// interface Referral {
//   id: string | number;
//   username: string;
// }

// const tabs = [
//   { id: 'mine', text: 'Mine', Icon: GiPickle },
//   { id: 'quest', text: 'Quest', Icon: GiScrollUnfurled },
//   { id: 'invite', text: 'Invite', Icon: FaUserFriends },
// ];

// const taskData = [
//   { id: '12', description: 'Catch 5000 Scorpions', reward: 2500, completed: false, status: 'pending', requiredLevel: 2, platform: null },
//   { id: '13', description: 'Catch 50000 Scorpions', reward: 5000, completed: false, status: 'pending', requiredLevel: 2, platform: null },
//   { id: '14', description: 'Catch 100000 Scorpions', reward: 50000, completed: false, status: 'pending', requiredLevel: 3, platform: null },
//   { id: '15', description: 'Catch 200000 Scorpions', reward: 100000, completed: false, status: 'pending', requiredLevel: 4, platform: null },
//   { id: '16', description: 'Catch 500000 Scorpions', reward: 250000, completed: false, status: 'pending', requiredLevel: 5, platform: null },

//   { id: '17', description: 'Follow us on Twitter', reward: 2500, completed: false, difficulty: 'easy', platform: 'Twitter', link: 'https://x.com/scorpionworld3' },
//   { id: '18', description: 'Follow us on Facebook', reward: 2500, completed: false, difficulty: 'hard', platform: 'Facebook', link: 'https://web.facebook.com/people/Scorpionworld/61566331949332' },
//   { id: '19', description: 'Follow us on Instagram', reward: 2500, completed: false, difficulty: 'medium', platform: 'Instagram', link: 'https://www.instagram.com/scorpionworld3' },
//   { id: '20', description: 'Join our Telegram channel', reward: 5000, completed: false, difficulty: 'hard', platform: 'Telegram', link: 'https://t.me/scorpioncommunity_channel' },
//   { id: '21', description: 'Join our Telegram Community', reward: 5000, completed: false, difficulty: 'easy', platform: 'Telegram', link: 'https://t.me/scorpion_community' },
//   { id: '22', description: 'Subscribe to our YouTube channel', reward: 5000, completed: false, difficulty: 'medium', platform: 'YouTube', link: 'https://youtube.com/@scorpionworld-k5t' },
// ];

// // Define upgrade items with levels
// const upgradeItems = [
//   { id: '1', name: 'Energy Boost', baseCost: 500, effect: 'Increases max energy', level: 1 },
//   { id: '2', name: 'Cooldown Reduction', baseCost: 1500, effect: 'Reduces cooldown time', level: 1 },
//   { id: '3', name: 'Double Rewards', baseCost: 2000, effect: 'Doubles rewards', level: 1 },
//   { id: '4', name: 'Extra Hold Duration', baseCost: 2500, effect: 'Increases hold duration', level: 1 },
//   { id: '5', name: 'Scorpion Magnet', baseCost: 3000, effect: 'Automatically attracts scorpions', level: 1 },
//   { id: '6', name: 'Instant Energy Refill', baseCost: 5000, effect: 'Instantly refills energy', level: 1 },
// ];

// // Define levels based on balance thresholds
// const levels = [
//   { name: 'Novice Miner', minBalance: 0, maxBalance: 999, level: 1 },
//   { name: 'Apprentice Miner', minBalance: 5000, maxBalance: 49999, level: 2 },
//   { name: 'Skilled Miner', minBalance: 50000, maxBalance: 99999, level: 3 },
//   { name: 'Advanced Miner', minBalance: 100000, maxBalance: 199999, level: 4 },
//   { name: 'Expert Miner', minBalance: 200000, maxBalance: 499999, level: 5 },
//   { name: 'Master Miner', minBalance: 500000, maxBalance: 999999, level: 6 },
//   { name: 'Grandmaster Miner', minBalance: 1000000, maxBalance: 1999999, level: 7 },
//   { name: 'Legendary Miner', minBalance: 2000000, maxBalance: Infinity, level: 8 },
// ];

// // Function to calculate scorpion miner level based on balance
// const getLevel = (balance: number) => {
//   const levelInfo = levels.find((level) => balance >= level.minBalance && balance <= level.maxBalance);
//   return levelInfo ? { name: levelInfo.name, level: levelInfo.level } : { name: 'Unknown', level: 0 };
// };

// export const IndexPage: FC = () => {
//   const [scorpionMiner, setScorpionMiner] = useState<ScorpionMiner | undefined>(undefined);
//   const [currentTab, setCurrentTab] = useState(tabs[0].id);
//   const [activeTab, setActiveTab] = useState('in-game');
//   const [isHolding, setIsHolding] = useState(false);
//   const [rewards, setRewards] = useState(0);
//   const [energy, setEnergy] = useState(100);
//   const [cooldown, setCooldown] = useState(false);
//   const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(0);
//   const [balance, setBalance] = useState(0);
//   const [tasks, setTasks] = useState(taskData);
//   const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
//   const [referralCount, setReferralCount] = useState(0);
//   const [referrals, setReferrals] = useState<Referral[]>([]);
//   const [loadingReferrals, setLoadingReferrals] = useState(false);
//   const [referralLink, setReferralLink] = useState<string | null>(null);
//   const [maxEnergy, setMaxEnergy] = useState(100);
//   const [doubleRewardsActive, setDoubleRewardsActive] = useState(false);
//   const [doubleRewardsTimeout, setDoubleRewardsTimeout] = useState<number | null>(null);
//   const [isSnackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarDescription, setSnackbarDescription] = useState('');
//   const [levelInfo, setLevelInfo] = useState(getLevel(0));
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [simulationEnded, setSimulationEnded] = useState<{ [taskId: string]: boolean }>({});
//   const [isVerifying, setIsVerifying] = useState<{ [key: string]: boolean }>({});
//   const [linkClicked, setLinkClicked] = useState<{ [key: string]: boolean }>({});
//   const [taskVerified, setTaskVerified] = useState<{ [key: string]: boolean }>({});

//   const initData = useInitData();
//   const user = initData?.user;

//   const showSnackbar = (message: string, description: string) => {
//     setSnackbarMessage(message);
//     setSnackbarDescription(description);
//     setSnackbarVisible(true);
//   };

//   useEffect(() => {
//     const saveProgress = async () => {
//       if (user && scorpionMiner) {
//         const updatedData: ScorpionMiner = {
//           ...scorpionMiner,
//           balance,
//           miningLevel: levelInfo.level,
//           energy,
//           rewards,
//           lastHarvestTime: Date.now(),
//           lastExhaustedTime: energy === 0 ? Date.now() : scorpionMiner.lastExhaustedTime,
//           cooldownEndTime: cooldownTimeRemaining > 0 ? Date.now() + cooldownTimeRemaining * 1000 : undefined,
//           tasks,
//         };
//         console.log('Saving updated scorpion miner data:', updatedData);
        
//         await updateAndSyncScorpionMinerData(user.id, updatedData);
//         await savePlayerProgressToSupabase(user.id, updatedData);
//       }
//     };

//     saveProgress();
//   }, [user, scorpionMiner, balance, levelInfo.level, energy, rewards, cooldownTimeRemaining, tasks]);

//   const fetchAndSyncData = async () => {
//     if (user) {
//       try {
//         setIsSyncing(true);
//         await performTwoWaySync(setIsSyncing);
//         const db = await openDB('ScorpionMinerDB', 1);
//         const data = await db.get('scorpionMiners', user.id);
//         if (data) {
//           setScorpionMiner(data);
//           console.log('Fetched scorpion miner data:', data);
//         } else {
//           const initialData: ScorpionMiner = {
//             id: user.id,
//             username: user.username,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             balance: 0,
//             miningLevel: 1,
//             energy: 100,
//             rewards: 0,
//             lastUpdated: Date.now(),
//             tasks: taskData,
//             tasksCompleted: 0
//           };
//           await db.put('scorpionMiners', initialData);
//           setScorpionMiner(initialData);
//           console.log('Initialized new scorpion miner data:', initialData);
//         }
        
//         await syncDataFromSupabase();
        
//         const updatedData = await db.get('scorpionMiners', user.id);
//         if (updatedData) {
//           setScorpionMiner(updatedData);
//           console.log('Updated scorpion miner data after sync:', updatedData);
//         }
//       } catch (error) {
//         console.error('Error fetching or creating scorpion miner data:', error);
//         showSnackbar('Sync Error', 'Failed to sync data. Please try again later.');
//       } finally {
//         setIsSyncing(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchAndSyncData();

//     const syncInterval = setInterval(() => {
//       syncDataFromSupabase().then(() => {
//         console.log('Periodic sync completed');
//       }).catch((error) => {
//         console.error('Periodic sync failed:', error);
//       });
//     }, 5 * 60 * 1000);

//     return () => clearInterval(syncInterval);
//   }, [user]);

//   useEffect(() => {
//     if (scorpionMiner) {
//       setBalance(scorpionMiner.balance || 0);
//       setLevelInfo(getLevel(scorpionMiner.balance || 0));
//       setEnergy(scorpionMiner.energy || 100);
//       setRewards(scorpionMiner.rewards || 0);
//       setTasks(scorpionMiner.tasks || taskData);

//       if (scorpionMiner.cooldownEndTime && scorpionMiner.cooldownEndTime > Date.now()) {
//         const remainingTime = Math.floor((scorpionMiner.cooldownEndTime - Date.now()) / 1000);
//         setCooldownTimeRemaining(remainingTime);
//       }
//     }
//   }, [scorpionMiner]);

//   useEffect(() => {
//     setLevelInfo(getLevel(balance));
//   }, [balance]);

//   const generateReferralLink = (userId: string) => {
//     return `https://t.me/scorpion_world_bot?start=${userId}`;
//   };

//   const COOLDOWN_TIME = 3 * 60 * 60;

//   useEffect(() => {
//     if (user) {
//       const link = generateReferralLink(user.id.toString());
//       setReferralLink(link);
//     }
//   }, [user]);

//   const fetchReferralData = async () => {
//     if (!user) return;
  
//     setLoadingReferrals(true);
  
//     try {
//       const referralsData = await getReferralsByPlayer(user.id);
//       const formattedReferrals = referralsData.map((referral) => ({
//         id: referral.referred_id,
//         username: referral.referred_username || 'Anonymous User',
//       }));
  
//       setReferralCount(formattedReferrals.length);
//       setReferrals(formattedReferrals);
//     } catch (error) {
//       console.error('Failed to fetch referral data:', error);
//       setReferrals([]);
//     } finally {
//       setLoadingReferrals(false);
//     }
//   };

//   useEffect(() => {
//     fetchReferralData();
//   }, [user]);

//   const handleInviteFriend = () => {
//     const utils = initUtils();
  
//     if (user && user.id) {
//       const inviteLink = generateReferralLink(user.id.toString());
//       const shareText = 'Catch scorpions, earn rewards, and compete with friends in Scorpion World! 🌍🦂 Join me in this exciting Telegram mini app adventure and start earning now! 🔥 Click the link and let’s play together!';
//       const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
//       utils.openTelegramLink(fullUrl);
//     } else {
//       console.error('User ID is missing. Cannot generate referral link.');
//     }
//   };

//   const [upgradeLevels, setUpgradeLevels] = useState<{ [key: string]: number }>(
//     upgradeItems.reduce((acc, item) => ({ ...acc, [item.id]: item.level }), {})
//   );

//   const handleBuyUpgrade = (upgradeId: string, baseCost: number) => {
//     const currentLevel = upgradeLevels[upgradeId];
//     const cost = baseCost * currentLevel;

//     if (balance >= cost) {
//       setBalance((prevBalance) => prevBalance - cost);
//       setUpgradeLevels((prevLevels) => ({
//         ...prevLevels,
//         [upgradeId]: prevLevels[upgradeId] + 1,
//       }));

//       switch (upgradeId) {
//         case '1':
//           setMaxEnergy((prevMax) => prevMax + prevMax * 0.1 * currentLevel);
//           showSnackbar('Energy Boost purchased!', `Max energy increased to ${maxEnergy}`);
//           break;
//         case '2':
//           setCooldownTimeRemaining((prevCooldown) => Math.max(0, prevCooldown - 600 * currentLevel));
//           showSnackbar('Cooldown Reduction purchased!', `Cooldown reduced by ${currentLevel * 10} minutes.`);
//           break;
//         case '3':
//           setDoubleRewardsActive(true);
//           if (doubleRewardsTimeout) clearTimeout(doubleRewardsTimeout);
//           const timeoutId = window.setTimeout(() => {
//             setDoubleRewardsActive(false);
//           }, 3600000);
//           setDoubleRewardsTimeout(timeoutId);
//           showSnackbar('Double Rewards purchased!', 'Earn double scorpions for 1 hour.');
//           break;
//         case '4':
//           setEnergy((prevEnergy) => prevEnergy + prevEnergy * 0.2 * currentLevel);
//           showSnackbar('Extra Hold Duration purchased!', `Hold duration increased by ${currentLevel * 20}%.`);
//           break;
//         case '6':
//           setEnergy(maxEnergy);
//           setCooldown(false);
//           setCooldownTimeRemaining(0);
//           showSnackbar('Instant Energy Refill purchased!', 'Energy fully restored, and cooldown disabled.');
//           break;
//         default:
//           break;
//       }
//     } else {
//       showSnackbar('Insufficient scorpions!', 'Not enough scorpions to purchase this upgrade.');
//     }
//   };

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

//   const formatTime = (seconds: number) =>
//     `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

//   const handleTaskComplete = (taskId: string) => {
//     const task = tasks.find((t) => t.id === taskId);
//     if (task && !task.completed) {
//       if (levelInfo.level >= (task.requiredLevel ?? 0)) {
//         setLoadingTaskId(taskId);
//         setTimeout(() => {
//           setRewards((prev) => prev + task.reward);
//           setBalance((prevBalance) => prevBalance + task.reward);
//           setTasks((prev) =>
//             prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
//           );
//           setLoadingTaskId(null);
//           setTaskVerified((prev) => ({ ...prev, [taskId]: false }));
//         }, 1000);
//       } else {
//         showSnackbar('Level Too Low', `You need to reach level ${task.requiredLevel} to claim this task reward.`);
//       }
//     }
//   };

//   const handleLinkClick = (taskId: string) => {
//     setLinkClicked((prev) => ({ ...prev, [taskId]: true }));
//     showSnackbar('Link clicked', 'You have clicked the task link, now proceed to claim the reward.');
//   };

//   const VERIFICATION_DURATION = 5000;
//   const VERIFICATION_CYCLE_TIME = 2000;

//   const handleClaimRewardSimulator = (taskId: string) => {
//     if (!linkClicked[taskId]) {
//       showSnackbar('You have not clicked the link!', "Don't be lazy, try again by clicking the link first.");
//       return;
//     }

//     let totalTime = 0;
//     setVerificationAttempts(0);
//     setLoadingTaskId(taskId);
//     setIsVerifying((prev) => ({ ...prev, [taskId]: true }));

//     const interval = setInterval(() => {
//       if (totalTime >= VERIFICATION_DURATION) {
//         clearInterval(interval);
//         setSimulationEnded((prev) => ({ ...prev, [taskId]: true }));
//         setLoadingTaskId(null);
//         setIsVerifying((prev) => ({ ...prev, [taskId]: false }));
//         confirmTaskCompletion(taskId);
//         return;
//       }

//       setSnackbarMessage('Verifying link...');
//       setSnackbarDescription('Please wait while we verify your task.');
//       setSnackbarVisible(true);

//       setTimeout(() => {
//         setSnackbarMessage('Try again');
//         showSnackbar(
//           'You need to click the link!', 
//           'To complete this task, click the provided link and follow the instructions.'
//         );
//         setSnackbarVisible(true);
//       }, VERIFICATION_CYCLE_TIME / 2);
//       setVerificationAttempts((prev: number) => prev + 1);

//       setVerificationAttempts((prev) => {
//         const newAttempts = prev + 1;
//         setSnackbarMessage(`Verifying link... Attempt ${newAttempts}`);
//         setSnackbarDescription(`Please wait while we verify your task. Attempt ${newAttempts} of ${Math.ceil(VERIFICATION_DURATION / VERIFICATION_CYCLE_TIME)}`);
//         setSnackbarVisible(true);
//         return newAttempts;
//       });

//       totalTime += VERIFICATION_CYCLE_TIME;
//       setVerificationAttempts((prev) => prev + 1);
//     }, VERIFICATION_CYCLE_TIME);
//   };

//   const confirmTaskCompletion = (taskId: string) => {
//     if (simulationEnded[taskId]) {
//       handleTaskComplete(taskId);
//     } else {
//       showSnackbar('Verification Incomplete', 'Please complete the verification process first.');
//     }
//   };

//   return (
//     <>
//       {isSyncing && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg">
//             <p className="text-black">Syncing data...</p>
//           </div>
//         </div>
//       )}
//       <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4 p-custom2">
//         <List>
//           {currentTab === 'mine' && (
//             <div>
//               <div className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-md">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="p-2 rounded-lg shadow-md">
//                       <img
//                         src={user?.photoUrl || 'https://xelene.me/telegram.gif'}
//                         alt="Profile"
//                         width={40}
//                         height={40}
//                         className="rounded-full shadow-lg"
//                       />
//                     </div>
//                     <div className="ml-2 text-white">
//                       <p className="text-sm font-semibold">@{user?.username || 'Username'}</p>
//                       <p className="text-xs text-gray-400">
//                         {user?.firstName} {user?.lastName || ''}
//                       </p>
//                       <p className="text-xs text-[#f48d2f]">{levelInfo.name} (Lv. {levelInfo.level})</p>
//                     </div>
//                   </div>
//                   {isSnackbarVisible && (
//                     <Snackbar
//                       onClose={() => setSnackbarVisible(false)}
//                       duration={4000}
//                       description={snackbarDescription}
//                       after={<Button size="s" onClick={() => setSnackbarVisible(false)}>Close</Button>}
//                       className="snackbar-top"
//                     >
//                       <div>
//                         {snackbarMessage}
//                         <div className="relative w-full h-4 bg-gray-700 rounded-full shadow-md overflow-hidden mt-2">
//                           <div
//                             className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
//                           />
//                         </div>
//                       </div>
//                     </Snackbar>
//                   )}
//                   <Modal
//                     header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Upgrade Shop</ModalHeader>}
//                     trigger={
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-200 ease-in-out">
//                         Boost
//                       </button>
//                     }
//                   >
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
//                 </div>
//               </div>

//               <div className="flex justify-center mt-6">
//                 <div className="text-center">
//                   <Title caps level="1" weight="1" className="text-5xl text-white">
//                     {balance}
//                   </Title>
//                   <p className="text-lg text-[#f48d2f]">
//                     Catching <strong>{rewards} scorpions</strong>
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-center mt-6">
//                 <motion.div
//                   className={`relative w-[250px] h-[250px] rounded-full border-8 border-[#f48d2f] flex items-center justify-center cursor-pointer ${
//                     cooldownTimeRemaining > 0 ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                   onMouseDown={cooldownTimeRemaining === 0 ? startHold : undefined}
//                   onMouseUp={cooldownTimeRemaining === 0 ? stopHold : undefined}
//                   onTouchStart={cooldownTimeRemaining === 0 ? startHold : undefined}
//                   onTouchEnd={cooldownTimeRemaining === 0 ? stopHold : undefined}
//                   onContextMenu={(e) => e.preventDefault()}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <img src={scorpion} alt="Scorpion" className="object-cover no-select" />
//                   {isHolding && (
//                     <motion.div
//                       className="absolute inset-0 bg-[#f48d2f] opacity-30 rounded-full flex justify-center items-center"
//                       initial={{ scale: 1 }}
//                       animate={{ scale: 1.1 }}
//                       transition={{ duration: 0.5, yoyo: Infinity }}
//                     >
//                       <p className="text-white text-2xl animate-pulse">{rewards} Scorpions</p>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               </div>

//               <div className="flex justify-between items-center mt-custom">
//                 {cooldownTimeRemaining > 0 ? (
//                   <div className="bg-[#f48d2f] text-white font-bold px-4 rounded-full">
//                     {formatTime(cooldownTimeRemaining)}
//                   </div>
//                 ) : (
//                   <div className="bg-[#f48d2f] text-white font-bold px-4 rounded-full">{energy}%</div>
//                 )}
//                 <span className="text-[#f48d2f] font-semibold">
//                   {cooldownTimeRemaining > 0 ? (
//                     <span className="text-sm">Cooling Down</span>
//                   ) : (
//                     <span className="text-sm">Hold to Catch Scorpions</span>
//                   )}
//                 </span>
//               </div>

//               <div className="relative w-full h-4 bg-gray-700 rounded-full shadow-md overflow-hidden mb-2 mt-2">
//                 <div
//                   className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
//                   style={{ width: `${energy}%` }}
//                 />
//               </div>

//               <p className="text-center mt-2 text-sm text-[#f48d2f]">
//                 Hold the scorpion to catch more. The longer you hold, the more scorpions you earn.
//               </p>
//             </div>
//           )}

//           {currentTab === 'invite' && (
//             <div className="invite-tab">
//               <div className="p-4">
//                 <div className="text-center">
//                   <h2 className="text-2xl text-[#f48d2f] font-bold mb-2">👨‍👩‍👧‍👦 Invite Friends & Earn Scorpions</h2>
//                   <p className="text-[#f48d2f] mb-6">
//                     Share your referral link and earn rewards for each successful referral!{' '}
//                     <a href="#" className="text-blue-400 underline">
//                       How it works?
//                     </a>
//                   </p>

//                   <div className="flex justify-center">
//                     <div className="text-center">
//                       <Title caps level="1" weight="1" className="text-5xl text-white">
//                         {referralCount}
//                       </Title>
//                     </div>
//                   </div>

//                   <div className="mt-4 mb-4">
//                     <p className="text-white">Your Referral Link</p>
//                     <p className="bg-gray-800 mt-4 mb-4 p-2 rounded-md text-white">{referralLink || 'Generating...'}</p>
//                   </div>

//                   <div className="space-y-4 mt-4">
//                     <button
//                       onClick={handleInviteFriend}
//                       className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-300"
//                     >
//                       Invite Friend
//                     </button>
//                     <button
//                       className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition duration-300"
//                       onClick={() => navigator.clipboard.writeText(referralLink || '')}
//                     >
//                       Copy Invite Link
//                     </button>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-lg text-[#f48d2f] font-bold mb-4">Referral List</h3>
//                     {loadingReferrals ? (
//                       <p className="text-white">Loading referrals...</p>
//                     ) : (
//                       <ul className="bg-gray-800 p-4 rounded-md text-white">
//                         {referrals && referrals.length > 0 ? (
//                           referrals.map((referral: Referral) => (
//                             <li key={referral.id} className="mb-2">
//                               {referral.username || 'Anonymous User'}
//                             </li>
//                           ))
//                         ) : (
//                           <p>No referrals yet.</p>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {currentTab === 'quest' && (
//             <div className="task-tab">
//               {isSnackbarVisible && (
//                 <Snackbar
//                   onClose={() => setSnackbarVisible(false)}
//                   duration={4000}
//                   description={snackbarDescription}
//                   after={<Button size="s" onClick={() => setSnackbarVisible(false)}>Close</Button>}
//                   className="snackbar-top"
//                 >
//                   {snackbarMessage}
//                 </Snackbar>
//               )}
//               <div className="p-custom">
//                 <div className="flex justify-center">
//                   <div className="text-center">
//                     <Title caps level="1" weight="1" className="text-5xl text-white">
//                       {balance}
//                     </Title>
//                     <p className="text-lg text-[#f48d2f]">Complete tasks to earn Scorpion rewards</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-center space-x-4 mt-4">
//                   <button
//                     onClick={() => setActiveTab('in-game')}
//                     className={`py-2 px-6 rounded-lg ${activeTab === 'in-game' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
//                   >
//                     Game Tasks
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('social')}
//                     className={`py-2 px-6 rounded-lg ${activeTab === 'social' ? 'bg-blue-500 text-black' : 'bg-gray-700 text-white'}`}
//                   >
//                     Social Tasks
//                   </button>
//                 </div>

//                 <div className="mt-6">
//                   {activeTab === 'in-game' ? (
//                     <div className="space-y-4">
//                       {tasks
//                         .filter((task) => !task.platform)
//                         .map((task) => (
//                           <div key={task.id} className="flex justify-between items-center bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-lg">
//                             <div className="flex items-center space-x-6 gap-2">
//                               <FaBug className="text-4xl text-yellow-500" />
//                               <div>
//                                 <p className="text-sm">{task.description}</p>
//                                 <p className="text-xs text-[#f48d2f]">+{task.reward} Scorpions</p>
//                                 <p className="text-xs text-gray-400">Required Level: {task.requiredLevel}</p>
//                               </div>
//                             </div>
//                             <button
//                               onClick={() => handleTaskComplete(task.id)}
//                               disabled={task.completed || loadingTaskId === task.id || levelInfo.level < (task.requiredLevel ?? 0)}
//                               className={`py-2 px-4 rounded-lg shadow-md ${
//                                 task.completed || loadingTaskId === task.id || levelInfo.level < (task.requiredLevel ?? 0)
//                                   ? 'bg-gray-500 cursor-not-allowed'
//                                   : 'bg-green-600 hover:bg-green-700 text-white'
//                               }`}
//                             >
//                               {task.completed
//                                 ? 'Done'
//                                 : loadingTaskId === task.id
//                                 ? 'Loading...'
//                                 : levelInfo.level < (task.requiredLevel ?? 0)
//                                 ? 'Claim'
//                                 : 'Claim'}
//                             </button>
//                           </div>
//                         ))}
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {tasks
//                         .filter((task) => task.platform)
//                         .map((task) => (
//                           <div key={task.id} className="flex justify-between items-center bg-gray-900 text-white p-4 mb-4 rounded-lg shadow-lg">
//                             <div className="flex items-center space-x-4">
//                               {task.platform === 'Telegram' && <FaTelegramPlane className="text-2xl text-blue-500" />}
//                               {task.platform === 'Twitter' && <FaTwitter className="text-2xl text-blue-400" />}
//                               {task.platform === 'Facebook' && <FaFacebook className="text-2xl text-blue-700" />}
//                               {task.platform === 'YouTube' && <FaYoutube className="text-2xl text-red-600" />}
//                               {task.platform === 'Instagram' && <FaInstagram className="text-2xl text-pink-500" />}
//                               <div>
//                                 <p className="text-sm">{task.description}</p>
//                                 <p className="text-xs text-[#f48d2f]">+{task.reward} Scorpion</p>
//                               </div>
//                             </div>
//                             <Modal
//                               header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Task Instructions</ModalHeader>}
//                               trigger={(
//                                 <button
//                                   disabled={task.completed || loadingTaskId === task.id}
//                                   onClick={() => handleClaimRewardSimulator(task.id)}
//                                   className={`py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out ${
//                                     task.completed ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//                                   }`}
//                                 >
//                                   {loadingTaskId === task.id ? (
//                                     isVerifying ? (
//                                       <FaSpinner className="animate-spin" />
//                                     ) : (
//                                       <FaSpinner className="animate-spin" />
//                                     )
//                                   ) : task.completed ? (
//                                     'Done'
//                                   ) : (
//                                     'Start'
//                                   )}
//                                 </button>
//                               )}
//                             >
//                               <Placeholder description={task.description} header="Task Instructions">
//                                 <div className="space-y-4">
//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-lg font-bold text-[#f48d2f]">1.</span>
//                                     <p className="text-sm">Click the link below to complete the task</p>
//                                   </div>
//                                   <div className="flex items-center">
//                                     <a
//                                       href={task.link}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className={`text-blue-500 underline flex items-center ${linkClicked[task.id] ? 'text-green-500' : 'text-blue-500'}`}
//                                       onClick={() => handleLinkClick(task.id)}
//                                     >
//                                       <FaExternalLinkAlt className="mr-2" />
//                                       Join the Scorpion World {task.platform} Link
//                                     </a>
//                                   </div>

//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-lg font-bold text-[#f48d2f]">2.</span>
//                                     <p className="text-sm">Claim your reward once all steps are complete:</p>
//                                   </div>

//                                   <button
//                                     disabled={task.completed || loadingTaskId === task.id || !linkClicked[task.id]}
//                                     onClick={() => handleClaimRewardSimulator(task.id)}
//                                     className={`py-2 px-4 w-full rounded-lg shadow-md transition duration-200 ease-in-out ${
//                                       task.completed ? 'bg-gray-500 cursor-not-allowed' : linkClicked[task.id] ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
//                                     }`}
//                                   >
//                                     {loadingTaskId === task.id ? (
//                                       isVerifying[task.id] ? (
//                                         <><FaSpinner className="animate-spin"/></>
//                                       ) : (
//                                         <FaSpinner className="animate-spin" />
//                                       )
//                                     ) : task.completed ? (
//                                       'Done'
//                                     ) : (
//                                       'Claim Task Reward'
//                                     )}
//                                   </button>

//                                   <div className="flex justify-between items-center mt-4">
//                                     <div className="flex space-x-1">
//                                       <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//                                       <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//                                       <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//                                     </div>
//                                     <p className="text-xs text-gray-500">Checking..({verificationAttempts})</p>
//                                   </div>
//                                 </div>
//                               </Placeholder>
//                             </Modal>
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </List>
//       </div>

//       <Tabbar>
//         {tabs.map(({ id, text, Icon }) => (
//           <Tabbar.Item
//             key={id}
//             text={text}
//             selected={id === currentTab}
//             onClick={() => setCurrentTab(id)}
//           >
//             <Icon size={24} className="text-white" />
//           </Tabbar.Item>
//         ))}
//       </Tabbar>
//     </>
//   );
// };
