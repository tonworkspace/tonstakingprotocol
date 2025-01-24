// import { List, Modal, Placeholder, Tabbar, Title, Button, Snackbar, } from '@telegram-apps/telegram-ui';
// import { FC, useState, useEffect } from 'react';
// import { GiPickle, GiScrollUnfurled } from 'react-icons/gi';
// import { FaFacebook, FaInstagram, FaTelegramPlane, FaTwitter, FaUserFriends, FaYoutube, FaBug, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
// import { initUtils, useInitData } from '@telegram-apps/sdk-react';
// import { motion } from 'framer-motion';
// import { scorpion } from '@/images'; // Ensure this is the correct path for the image
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
// import { fetchPlayerDataFromSupabase, fetchPlayerDataFromIndexedDB, savePlayerDataToSupabaseAndIndexedDB, ScorpionMiner } from '@/playerSupabaseStorage';
// import { openDB } from 'idb';
// import useAuth from '@/components/useAuth';

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
//   { id: '1', description: 'Catch 5000 Scorpions', reward: 2500, completed: false, status: 'pending',  requiredLevel: 2, platform: null },
//   { id: '2', description: 'Catch 50000 Scorpions', reward: 5000, completed: false, status: 'pending', requiredLevel: 2, platform: null },
//   { id: '3', description: 'Catch 100000 Scorpions', reward: 50000, completed: false, status: 'pending', requiredLevel: 3, platform: null },
//   { id: '4', description: 'Catch 200000 Scorpions', reward: 100000, completed: false, status: 'pending', requiredLevel: 4, platform: null },
//   { id: '5', description: 'Catch 500000 Scorpions', reward: 250000, completed: false, status: 'pending', requiredLevel: 5, platform: null },

//   // Social tasks remain unchanged as they don't require level restrictions
//   { id: '6', description: 'Follow us on Twitter', reward: 2500, completed: false, difficulty: 'easy', platform: 'Twitter', link: 'https://x.com/scorpionworld3' },
//   { id: '7', description: 'Follow us on Facebook', reward: 2500, completed: false, difficulty: 'hard', platform: 'Facebook', link: 'https://web.facebook.com/people/Scorpionworld/61566331949332' },
//   { id: '8', description: 'Follow us on Instagram', reward: 2500, completed: false, difficulty: 'medium', platform: 'Instagram', link: 'https://www.instagram.com/scorpionworld3' },
//   { id: '9', description: 'Join our Telegram channel', reward: 5000, completed: false, difficulty: 'hard', platform: 'Telegram', link: 'https://t.me/scorpioncommunity_channel' },
//   { id: '10', description: 'Join our Telegram Community', reward: 5000, completed: false, difficulty: 'easy', platform: 'Telegram', link: 'https://t.me/scorpion_community' },
//   { id: '11', description: 'Subscribe to our YouTube channel', reward: 5000, completed: false, difficulty: 'medium', platform: 'YouTube', link: 'https://youtube.com/@scorpionworld-k5t' },
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
//   const { user, playerData, isLoading } = useAuth();
//   const [scorpionMiner, setScorpionMiner] = useState<ScorpionMiner | undefined>(undefined);
//   const [currentTab, setCurrentTab] = useState(tabs[0].id);
//   const [activeTab, setActiveTab] = useState('in-game');
//   const [isHolding, setIsHolding] = useState(false);
//   const [rewards, setRewards] = useState(0);
//   const [energy, setEnergy] = useState(100);
//   const [cooldown, setCooldown] = useState(false);
//   const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(0);
//   const [balance, setBalance] = useState(0);
//   const [tasks, setTasks] = useState(taskData); // Updated task data
//   const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
//   const [referralCount, setReferralCount] = useState(0);
//   const [referrals, setReferrals] = useState<Referral[]>([]);
//   const [loadingReferrals, setLoadingReferrals] = useState(false);
//   const [referralLink, setReferralLink] = useState<string | null>(null);
//   const [maxEnergy, setMaxEnergy] = useState(100); // New state to track max energy
//   const [doubleRewardsActive, setDoubleRewardsActive] = useState(false); // Track if double rewards are active
//   const [doubleRewardsTimeout, setDoubleRewardsTimeout] = useState<number | null>(null); // To clear the timeout for double rewards
//   // Snackbar state
//   const [isSnackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarDescription, setSnackbarDescription] = useState('');
//   const [levelInfo, setLevelInfo] = useState(getLevel(0)); // Scorpion miner level info
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [simulationEnded, setSimulationEnded] = useState<{ [taskId: string]: boolean }>({}); // Track if simulation ended for each task
//  const [isVerifying, setIsVerifying] = useState<{ [key: string]: boolean }>({});
//  const [linkClicked, setLinkClicked] = useState<{ [key: string]: boolean }>({}); // Track if link was clicked for each task
//  const [taskVerified, setTaskVerified] = useState<{ [key: string]: boolean }>({});



//   const initData = useInitData();
//   const user = initData?.user;

//   // Show Snackbar function
//   const showSnackbar = (message: string, description: string) => {
//     setSnackbarMessage(message);
//     setSnackbarDescription(description);
//     setSnackbarVisible(true);
//   };

  
//   //  // Function to verify Telegram tasks using backend verification
//   //  const handleVerifyTelegramTask = async () => {
//   //   if (!user || !user.id) {
//   //     showSnackbar('User ID Missing', 'Could not retrieve your Telegram User ID. Please try again.');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch(`https://lumbar-secretive-colby.glitch.me/verifyTelegramTasks`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ userId: user.id }), // Assuming user.id contains the Telegram user ID
//   //     });

//   //     const result = await response.json();
//   //     if (result.community && result.channel) {
//   //       showSnackbar('Task Verified!', 'You have successfully completed both Telegram tasks.');
         
//   // // Update the tasks to mark them as completed
//   // setTasks(prevTasks =>
//   //   prevTasks.map(task =>
//   //     task.id === '9' || task.id === '10'
//   //       ? { ...task, completed: true }
//   //       : task
//   //   )
//   // );
  
//   // setTaskVerified('9'); // Set the verified task ID to '9', or '10' as per your needs

//   //     } else {
//   //       const missingTasks = [];
//   //       if (!result.community) missingTasks.push('community');
//   //       if (!result.channel) missingTasks.push('channel');
//   //       showSnackbar('Task Incomplete', `You have not joined the Telegram ${missingTasks.join(' and ')}.`);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error verifying Telegram tasks:', error);
//   //     showSnackbar('Verification Failed', 'There was an issue verifying your Telegram tasks. Please try again.');
//   //   }
//   // };


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
//         };
//         console.log('Saving updated scorpion miner data:', updatedData); // Log data before saving
        
//         // Save to IndexedDB and sync
//         await updateAndSyncScorpionMinerData(user.id, updatedData);
  
//         // Save progress directly to Supabase
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
//           // If the data does not exist, initialize a new player profile
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
//           };
//           await db.put('scorpionMiners', initialData);
//           setScorpionMiner(initialData);
//           console.log('Initialized new scorpion miner data:', initialData);
//         }
        
//         // Sync data from Supabase after initial fetch/create
//         await syncDataFromSupabase();
        
//         // Fetch updated data after sync
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

//     // Set up periodic sync (every 5 minutes)
//     const syncInterval = setInterval(() => {
//       syncDataFromSupabase().then(() => {
//         console.log('Periodic sync completed');
//       }).catch((error) => {
//         console.error('Periodic sync failed:', error);
//       });
//     }, 5 * 60 * 1000); // 5 minutes in milliseconds

//     return () => clearInterval(syncInterval);
//   }, [user]);
  

//   // Set up periodic sync (every 5 minutes)
// useEffect(() => {
//   const syncInterval = setInterval(() => {
//     syncDataFromSupabase().then(() => {
//       console.log('Periodic sync completed');
//       fetchReferralData(); // Fetch referral data during sync
//     }).catch((error) => {
//       console.error('Periodic sync failed:', error);
//     });
//   }, 5 * 60 * 1000); // 5 minutes in milliseconds

//   return () => clearInterval(syncInterval);
// }, [user]);


//   useEffect(() => {
//     if (scorpionMiner) {
//       setBalance(scorpionMiner.balance || 0);
//       setLevelInfo(getLevel(scorpionMiner.balance || 0));
//       setEnergy(scorpionMiner.energy || 100);
//       setRewards(scorpionMiner.rewards || 0);
  
//       if (scorpionMiner.cooldownEndTime && scorpionMiner.cooldownEndTime > Date.now()) {
//         const remainingTime = Math.floor((scorpionMiner.cooldownEndTime - Date.now()) / 1000);
//         setCooldownTimeRemaining(remainingTime);
//       }
//     }
//   }, [scorpionMiner]);

//   // Update rank and level whenever balance changes
//   useEffect(() => {
//     setLevelInfo(getLevel(balance)); // Calculate scorpion miner level based on balance
//   }, [balance]);

//   // Function to generate the referral link
//   const generateReferralLink = (userId: string) => {
//     return `https://t.me/scorpion_world_bot?start=${userId}`;
//   };

//   // Adjusted cooldown time and harvest threshold
//   const COOLDOWN_TIME = 3 * 60 * 60; // 3 hours in seconds

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
//       // Fetch referrals directly from Supabase
//       const referralsData = await getReferralsByPlayer(user.id);
  
//       // Map Supabase data to match the Referral type structure
//       const formattedReferrals = referralsData.map((referral) => ({
//         id: referral.referred_id, // map referred_id to id
//         username: referral.referred_username || 'Anonymous User', // map referred_username to username
//       }));
  
//       // Set the formatted referrals data to state
//       setReferralCount(formattedReferrals.length);
//       setReferrals(formattedReferrals);
//     } catch (error) {
//       console.error('Failed to fetch referral data:', error);
//       setReferrals([]); // Set empty array in case of error
//     } finally {
//       setLoadingReferrals(false);
//     }
//   };


//   useEffect(() => {
//     fetchReferralData();
//   }, [user]);


//   const handleInviteFriend = () => {
//     // Initialize utils from the Telegram SDK
//     const utils = initUtils();
  
//     // Ensure userId is defined
//     if (user && user.id) {
//       // Generate the referral link with the user ID
//       const inviteLink = generateReferralLink(user.id.toString());
  
//       // Prepare the text for sharing
//       const shareText = 'Catch scorpions, earn rewards, and compete with friends in Scorpion World! 🌍🦂 Join me in this exciting Telegram mini app adventure and start earning now! 🔥 Click the link and let’s play together!';
  
//       // Create the full Telegram share URL
//       const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
  
//       // Open the Telegram link
//       utils.openTelegramLink(fullUrl);
//     } else {
//       // Handle case where user ID is not available
//       console.error('User ID is missing. Cannot generate referral link.');
//     }
//   };
  
   
//   const [upgradeLevels, setUpgradeLevels] = useState<{ [key: string]: number }>(
//     upgradeItems.reduce((acc, item) => ({ ...acc, [item.id]: item.level }), {})
//   );

//   // Handle buying upgrades and applying level scaling
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
//         case '1': // Energy Boost
//           setMaxEnergy((prevMax) => prevMax + prevMax * 0.1 * currentLevel);
//           showSnackbar('Energy Boost purchased!', `Max energy increased to ${maxEnergy}`);
//           break;
//         case '2': // Cooldown Reduction
//           setCooldownTimeRemaining((prevCooldown) => Math.max(0, prevCooldown - 600 * currentLevel));
//           showSnackbar('Cooldown Reduction purchased!', `Cooldown reduced by ${currentLevel * 10} minutes.`);
//           break;
//         case '3': // Double Rewards
//           setDoubleRewardsActive(true);
//           if (doubleRewardsTimeout) clearTimeout(doubleRewardsTimeout);
//           const timeoutId = window.setTimeout(() => {
//             setDoubleRewardsActive(false);
//           }, 3600000); // 1 hour = 3600000 ms
//           setDoubleRewardsTimeout(timeoutId);
//           showSnackbar('Double Rewards purchased!', 'Earn double scorpions for 1 hour.');
//           break;
//         case '4': // Extra Hold Duration
//           setEnergy((prevEnergy) => prevEnergy + prevEnergy * 0.2 * currentLevel);
//           showSnackbar('Extra Hold Duration purchased!', `Hold duration increased by ${currentLevel * 20}%.`);
//           break;
//         case '6': // Instant Energy Refill
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

//   // Adjust hold mechanics to consider double rewards
//   useEffect(() => {
//     let holdInterval: NodeJS.Timeout;
//     if (isHolding && energy > 0) {
//       holdInterval = setInterval(() => {
//         const randomEnergyDrop = Math.floor(Math.random() * 5) + 1; // Random drop between 1 and 5
//         const rewardMultiplier = doubleRewardsActive ? 4 : 2; // Double rewards if active
//         setRewards((prev) => prev + randomEnergyDrop * rewardMultiplier); // Adjust rewards based on double rewards status
//         setEnergy((prev) => Math.max(0, prev - randomEnergyDrop)); // Ensure energy doesn't go below 0

//         if (energy === 0) {
//           autoHarvest(); // Trigger auto-harvest when energy reaches 0
//         }
//       }, 500); // Faster energy depletion every 0.5 seconds
//     }
//     return () => clearInterval(holdInterval);
//   }, [isHolding, energy, doubleRewardsActive]);

//   // Auto-harvest logic
//   const autoHarvest = () => {
//     setBalance((prevBalance) => prevBalance + rewards); // Transfer rewards to balance
//     setRewards(0); // Reset rewards after harvesting
//     setIsHolding(false);
//     setCooldown(true);
//     setCooldownTimeRemaining(COOLDOWN_TIME);

//     // Reset energy and cooldown
//     setTimeout(() => {
//       setEnergy(maxEnergy); // Fully refill energy after cooldown
//       setCooldown(false);
//       setCooldownTimeRemaining(0);
//     }, COOLDOWN_TIME * 1000); // Cooldown duration in milliseconds
//   };

//   // Stop holding and harvest manually
//   const stopHold = () => {
//     setIsHolding(false);
//     autoHarvest(); // Trigger harvest when the player manually stops holding
//   };

//   // Handle cooldown when energy is zero
//   useEffect(() => {
//     if (energy === 0 && !isHolding) {
//       setCooldown(true);
//       setCooldownTimeRemaining(COOLDOWN_TIME); // Start cooldown when energy is exhausted
//     }
//   }, [energy]);

//   // Cooldown timer effect
//   useEffect(() => {
//     let cooldownInterval: NodeJS.Timeout;
//     if (cooldownTimeRemaining > 0) {
//       cooldownInterval = setInterval(() => {
//         setCooldownTimeRemaining((prev) => prev - 1);
//       }, 1000); // Decrease cooldown every second
//     }
//     return () => clearInterval(cooldownInterval);
//   }, [cooldownTimeRemaining]);

//   const startHold = () => {
//     if (!cooldown && energy > 0) {
//       setIsHolding(true);
//     }
//   };

//   const formatTime = (seconds: number) => `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

//    // Handle task completion
//   const handleTaskComplete = (taskId: string) => {
//     const task = tasks.find((t) => t.id === taskId);
//     if (task && !task.completed) {
//       // Check if scorpion miner's level meets the required level for the task
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
//         }, 1000); // Simulating loading
//       } else {
//         showSnackbar('Level Too Low', `You need to reach level ${task.requiredLevel} to claim this task reward.`);
//       }
//     }
//   };  

//   const handleLinkClick = (taskId: string) => {
//     // Mark the task's link as clicked
//     setLinkClicked((prev) => ({ ...prev, [taskId]: true }));
//     showSnackbar('Link clicked', 'You have clicked the task link, now proceed to claim the reward.');
//   };
 
// const VERIFICATION_DURATION = 5000; // 2 minutes in milliseconds
// const VERIFICATION_CYCLE_TIME = 2000; // Each cycle (verify, fail) lasts 5 seconds


// const handleClaimRewardSimulator = (taskId: string) => {
//   // Check if the player has clicked the link for this task
//   if (!linkClicked[taskId]) {
//     showSnackbar('You have not clicked the link!', "Don't be lazy, try again by clicking the link first.");
//     return; // Prevent the simulation from starting
//   }

//   // If the link was clicked, proceed with the simulation
//   let totalTime = 0;
//   setVerificationAttempts(0); // Reset verification attempts
//   setLoadingTaskId(taskId);
//   setIsVerifying((prev) => ({ ...prev, [taskId]: true })); // Start verification for this task

//   const interval = setInterval(() => {
//     if (totalTime >= VERIFICATION_DURATION) {
//       // After the simulation ends, allow task completion
//       clearInterval(interval);
//       setSimulationEnded((prev) => ({ ...prev, [taskId]: true })); // Mark the task as completed in simulation
//       setLoadingTaskId(null); // Stop loading
//       setIsVerifying((prev) => ({ ...prev, [taskId]: false })); // End verification for this task
//       confirmTaskCompletion(taskId); // Trigger task completion once simulation ends
//       return;
//     }

//     // Show "Verifying link..." message during the first half of the cycle
//     setSnackbarMessage('Verifying link...');
//     setSnackbarDescription('Please wait while we verify your task.');
//     setSnackbarVisible(true);


//     // Simulate verification failure after 2.5 seconds (half of the cycle)
//     setTimeout(() => {
//       setSnackbarMessage('Try again');
//       showSnackbar(
//         'You need to click the link!', 
//         'To complete this task, click the provided link and follow the instructions.'
//       );
//       setSnackbarVisible(true);
//     }, VERIFICATION_CYCLE_TIME / 2);
//     setVerificationAttempts((prev: number) => prev + 1); // Ensure 'prev' has a type


//     setVerificationAttempts((prev) => {
//       const newAttempts = prev + 1;
//       // Update snackbar message with attempt count
//       setSnackbarMessage(`Verifying link... Attempt ${newAttempts}`);
//       setSnackbarDescription(`Please wait while we verify your task. Attempt ${newAttempts} of ${Math.ceil(VERIFICATION_DURATION / VERIFICATION_CYCLE_TIME)}`);
//       setSnackbarVisible(true);
//       return newAttempts;
//     });

//     // Increment time and verification attempts
//     totalTime += VERIFICATION_CYCLE_TIME;
//     setVerificationAttempts((prev) => prev + 1);
//   }, VERIFICATION_CYCLE_TIME); // Every 5 seconds, repeat the process
// };


// // Step 4: Complete the task after simulation ends
// const confirmTaskCompletion = (taskId: string) => {
//   if (simulationEnded[taskId]) {
//     handleTaskComplete(taskId); // Proceed to task completion and claiming the reward
//   } else {
//     showSnackbar('Verification Incomplete', 'Please complete the verification process first.');
//   }
// };


//   return (
//     <>
//      {isSyncing && (
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
//                   {/* Snackbar */}
//                   {isSnackbarVisible && (
//                    // Inside JSX (replace Snackbar with this for visual feedback):
// <Snackbar
//   onClose={() => setSnackbarVisible(false)}
//   duration={4000}
//   description={snackbarDescription}
//   after={<Button size="s" onClick={() => setSnackbarVisible(false)}>Close</Button>}
//   className="snackbar-top"
// >
//   <div>
//     {snackbarMessage}
//     <div className="relative w-full h-4 bg-gray-700 rounded-full shadow-md overflow-hidden mt-2">
//       <div
//         className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
//       />
//     </div>
//   </div>
// </Snackbar>
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

//               {/* Scorpion Hold Interaction */}
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

//               {/* Energy and Cooldown Display */}
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

//                   {/* Display referral link */}
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
//   <h3 className="text-lg text-[#f48d2f] font-bold mb-4">Referral List</h3>
//   {loadingReferrals ? (
//     <p className="text-white">Loading referrals...</p>
//   ) : (
//     <ul className="bg-gray-800 p-4 rounded-md text-white">
//       {referrals && referrals.length > 0 ? (
//         referrals.map((referral: Referral) => (
//           <li key={referral.id} className="mb-2">
//             {referral.username || 'Anonymous User'}
//           </li>
//         ))
//       ) : (
//         <p>No referrals yet.</p>
//       )}
//     </ul>
//   )}
// </div>

//                 </div>
//               </div>
//             </div>
//           )}

//           {currentTab === 'quest' && (
//             <div className="task-tab">
//                {/* Snackbar */}
//                {isSnackbarVisible && (
//                     <Snackbar
//                       onClose={() => setSnackbarVisible(false)}
//                       duration={4000}
//                       description={snackbarDescription}
//                       after={<Button size="s" onClick={() => setSnackbarVisible(false)}>Close</Button>}
//                       className="snackbar-top"
//                     >
//                       {snackbarMessage}
//                     </Snackbar>
//                   )}
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
//                                   : 'bg-green-600 hover:bg-blue-700 text-white'
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
//   header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Task Instructions</ModalHeader>}
//   trigger={(
//     <button
//     disabled={task.completed || loadingTaskId === task.id}
//     onClick={() => handleClaimRewardSimulator(task.id)}
//     className={`py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out ${
//       task.completed ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
//     }`}
//   >
//     {loadingTaskId === task.id ? (
//       isVerifying ? (
//         <FaSpinner className="animate-spin" /> // Show this message during the verification process
//       ) : (
//         <FaSpinner className="animate-spin" />
//       )
//     ) : task.completed ? (
//       'Claimed'
//     ) : (
//       'Start'
//     )}
//   </button>
//   )}
// >
//   <Placeholder description={task.description} header="Task Instructions">
//     <div className="space-y-4">
//       {/* Step 1: Task Link */}
//       <div className="flex items-center space-x-2">
//         <span className="text-lg font-bold text-[#f48d2f]">1.</span>
//         <p className="text-sm">Click the link below to complete the task</p>
//       </div>
//       <div className="flex items-center">
//       <a
//   href={task.link}
//   target="_blank"
//   rel="noopener noreferrer"
//   className={`text-blue-500 underline flex items-center ${linkClicked[task.id] ? 'text-green-500' : 'text-blue-500'}`} // Change color if link is clicked
//   onClick={() => handleLinkClick(task.id)}
// >
//   <FaExternalLinkAlt className="mr-2" />
//   Join the Scorpion World {task.platform} Link
// </a>
//       </div> 

//       {/* Step 4: Claim Reward */}
//       <div className="flex items-center space-x-2">
//         <span className="text-lg font-bold text-[#f48d2f]">2.</span>
//         <p className="text-sm">Claim your reward once all steps are complete:</p>
//       </div>
     
// <button
//   disabled={task.completed || loadingTaskId === task.id || !linkClicked[task.id]} // Disable if link not clicked
//   onClick={() => handleClaimRewardSimulator(task.id)} // Start simulation after link click
//   className={`py-2 px-4 w-full rounded-lg shadow-md transition duration-200 ease-in-out ${
//     task.completed ? 'bg-gray-500 cursor-not-allowed' : linkClicked[task.id] ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'
//   }`}
// >
//  {loadingTaskId === task.id ? (
//         isVerifying[task.id] ? (
//           <><FaSpinner className="animate-spin"/></>
//         ) : (
//           <FaSpinner className="animate-spin" />
//         )
//       ) : task.completed ? (
//         'Claimed'
//       ) : (
//         'Start'
//       )}
// </button>

// <div className="flex justify-between items-center mt-4">
//   <div className="flex space-x-1">
//     <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//     <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//     <div className={`w-3 h-3 rounded-full ${taskVerified[task.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
//   </div>
//   <p className="text-xs text-gray-500">Checking..({verificationAttempts})</p>
// </div>
//     </div>
//   </Placeholder>
// </Modal>

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
