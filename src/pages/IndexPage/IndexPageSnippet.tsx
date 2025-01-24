// import { List, Tabbar, Title, Modal, Button } from '@telegram-apps/telegram-ui';
// import { FC, useState, useEffect } from 'react';
// import { GiPickle, GiScrollUnfurled } from 'react-icons/gi';
// import { FaUserFriends, FaTrophy } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { scorpion } from '@/images'; // Replace with the correct scorpion image path
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';

// // Mock data for upgrade items
// const upgradeItems = [
//   { id: 1, name: 'Energy Boost', effect: 'Instant energy refill', baseCost: 50 },
//   { id: 2, name: 'Cooldown Reduction', effect: 'Reduce cooldown time by 50%', baseCost: 100 },
// ];

// // Initialize upgrade levels (default level is 1)
// const upgradeLevels: Record<number, number> = {
//   1: 1,
//   2: 1,
// };

// // Define the tabs for navigation
// const tabs = [
//   { id: 'mine', text: 'Mine', Icon: GiPickle },
//   { id: 'quest', text: 'Quest', Icon: GiScrollUnfurled },
//   { id: 'invite', text: 'Invite', Icon: FaUserFriends },
//   { id: 'leaderboard', text: 'Leaderboard', Icon: FaTrophy }, // Leaderboard Tab
// ];

// // Function to format time in minutes and seconds
// const formatTime = (seconds: number) => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
// };

// // Mock data for players' scorpion balances
// const initialLeaderboardData = [
//   { username: 'ScorpionKing', totalScorpions: 500 },
//   { username: 'JohnDoe', totalScorpions: 450 },
//   { username: 'Player123', totalScorpions: 400 },
//   { username: 'ScorpionMaster', totalScorpions: 350 },
//   { username: 'JaneDoe', totalScorpions: 300 },
// ];

// // Mock data for tasks
// const taskData = [
//   { id: 1, name: 'Catch 10 Scorpions', progress: 0, goal: 10, reward: 50, type: 'scorpion' },
//   { id: 2, name: 'Restore Energy', progress: 0, goal: 1, reward: 20, type: 'energy' },
//   { id: 3, name: 'Buy an Upgrade', progress: 0, goal: 1, reward: 100, type: 'upgrade' },
//   { id: 4, name: 'Complete 5 Tasks', progress: 0, goal: 5, reward: 50, type: 'task' },
//   { id: 5, name: 'Refer 3 Friends', progress: 0, goal: 3, reward: 150, type: 'referral' },
//   { id: 6, name: 'Join Telegram Group', progress: 0, goal: 1, reward: 30, type: 'social' },
//   { id: 7, name: 'Get Leaderboard Rank', progress: 0, goal: 1, reward: 200, type: 'leaderboard' },
// ];

// export const IndexPage: FC = () => {
//   const [currentTab, setCurrentTab] = useState(tabs[0].id);
//   const [energy, setEnergy] = useState(100); // Starting energy
//   const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(0); // Cooldown timer state
//   const [balance, setBalance] = useState(200); // Starting scorpion balance
//   const [rewards, setRewards] = useState(0); // Scorpions caught per session
//   const [totalScorpionsCaught, setTotalScorpionsCaught] = useState(100); // Track scorpions caught by current player
//   const [tasksCompleted, setTasksCompleted] = useState(0); // Track tasks completed
//   const [referralsMade, setReferralsMade] = useState(0); // Track referrals made
//   const [upgrades, setUpgrades] = useState(upgradeLevels); // Upgrade levels
//   const [tasks, setTasks] = useState(taskData); // Task list
//   const [leaderboardData, setLeaderboardData] = useState(initialLeaderboardData); // Leaderboard
//   const [playerRank, setPlayerRank] = useState<number | null>(null); // Track player's rank
//   const [isHolding, setIsHolding] = useState(false); // Track if the player is holding
//   const [cooldown, setCooldown] = useState(false); // Track if player is in cooldown

//   // Calculate and update the leaderboard rank in useEffect
//   useEffect(() => {
//     const calculateRank = (scorpions: number) => {
//       const updatedLeaderboard = [...leaderboardData, { username: 'You', totalScorpions: scorpions }];
//       const sortedLeaderboard = updatedLeaderboard.sort((a, b) => b.totalScorpions - a.totalScorpions);
//       setLeaderboardData(sortedLeaderboard);
//       const rank = sortedLeaderboard.findIndex(player => player.username === 'You') + 1;
//       setPlayerRank(rank);
//     };

//     calculateRank(totalScorpionsCaught);
//   }, [totalScorpionsCaught, leaderboardData]);

//   // // Simulate energy depletion and start cooldown when energy is 0
//   // const handleHoldInteraction = () => {
//   //   if (energy > 0) {
//   //     setEnergy((prevEnergy) => Math.max(0, prevEnergy - 10));
//   //     setRewards((prevRewards) => prevRewards + 1);
//   //     setTotalScorpionsCaught((prev) => prev + 1);
//   //     updateTaskProgress('scorpion', 1);
//   //   } else {
//   //     setCooldownTimeRemaining(180); // Set 3 minutes cooldown
//   //     updateTaskProgress('energy', 1);
//   //   }
//   // };

//     // Simulate energy depletion and cooldown
//     useEffect(() => {
//       let holdInterval: NodeJS.Timeout;
//       if (isHolding && energy > 0) {
//         holdInterval = setInterval(() => {
//           const energyDrop = Math.floor(Math.random() * 5) + 1;
//           setEnergy((prevEnergy) => Math.max(0, prevEnergy - energyDrop));
//           setRewards((prevRewards) => prevRewards + energyDrop * 2);
//           setTotalScorpionsCaught((prev) => prev + energyDrop * 2);
//           updateTaskProgress('scorpion', 1);

//           if (energy === 0) {
//             setIsHolding(false);
//             setCooldown(true);
//             setCooldownTimeRemaining(180); // Set 3 minutes cooldown
//             updateTaskProgress('energy', 1);
//             setBalance((prevBalance) => prevBalance + rewards); // Auto-harvest rewards
//             setRewards(0); // Reset rewards
//           }
//         }, 500);
//       }
  
//       return () => clearInterval(holdInterval);
//     }, [isHolding, energy, rewards]);
  
//     // Cooldown timer effect
//     useEffect(() => {
//       let cooldownInterval: NodeJS.Timeout;
//       if (cooldownTimeRemaining > 0) {
//         cooldownInterval = setInterval(() => {
//           setCooldownTimeRemaining((prev) => prev - 1);
//           if (cooldownTimeRemaining === 1) {
//             setCooldown(false);
//             setEnergy(100); // Restore energy after cooldown
//           }
//         }, 1000);
//       }
//       return () => clearInterval(cooldownInterval);
//     }, [cooldownTimeRemaining]);
  
//     // Start holding interaction
//     const startHold = () => {
//       if (!cooldown && energy > 0) {
//         setIsHolding(true);
//       }
//     };
  
//     // Stop holding interaction and manual harvest
//     const stopHold = () => {
//       setIsHolding(false);
//       setBalance((prevBalance) => prevBalance + rewards);
//       setRewards(0);
//     };

//   // Function to handle buying an upgrade
//   const handleBuyUpgrade = (upgradeId: number, cost: number) => {
//     if (balance >= cost) {
//       setBalance((prevBalance) => prevBalance - cost);
//       setUpgrades((prevUpgrades) => ({
//         ...prevUpgrades,
//         [upgradeId]: (prevUpgrades[upgradeId] || 1) + 1,
//       }));
//       updateTaskProgress('upgrade', 1);
//     }
//   };

//   const updateTaskProgress = (type: string, amount: number) => {
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.type === type ? { ...task, progress: Math.min(task.progress + amount, task.goal) } : task
//       )
//     );
//   };

//   const claimTaskReward = (taskId: number, reward: number) => {
//     setBalance((prevBalance) => prevBalance + reward);
//     setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
//     setTasksCompleted((prevCount) => prevCount + 1);
//     updateTaskProgress('task', 1);
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4 py-6 relative overflow-hidden">
//         {/* Background Visual Effects */}
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-700 opacity-20 rounded-full blur-2xl"></div>
//         <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-600 opacity-20 rounded-full blur-2xl"></div>

//         <List>
//           {/* Mine Tab */}
//           {currentTab === 'mine' && (
//             <div>
//               <div className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg mb-6">
//                 {/* Player Info */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="p-2 rounded-lg shadow-md">
//                       <img
//                         src="https://xelene.me/telegram.gif"
//                         alt="Profile"
//                         width={60}
//                         height={60}
//                         className="rounded-full shadow-lg"
//                       />
//                     </div>
//                     <div className="ml-2 text-white">
//                       <p className="text-lg font-semibold">@You</p>
//                       <p className="text-sm text-gray-400">You</p>
//                       <p className="text-sm text-[#f48d2f]">Miner Level (Lv. 1)</p>
//                     </div>
//                   </div>

//                   {/* Modal for Upgrade Shop */}
//                   <Modal
//                     header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Upgrade Shop</ModalHeader>}
//                     trigger={
//                       <motion.button
//                         className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-200 ease-in-out"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         Boost
//                       </motion.button>
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
//                             <p className="text-xs text-[#f48d2f]">
//                               Cost: {item.baseCost * (upgrades[item.id] || 1)} Scorpions
//                             </p>
//                           </div>
//                           <Button
//                             disabled={balance < item.baseCost * (upgrades[item.id] || 1)}
//                             onClick={() => handleBuyUpgrade(item.id, item.baseCost * (upgrades[item.id] || 1))}
//                             size="m"
//                             color={balance >= item.baseCost * (upgrades[item.id] || 1) ? 'green' : 'gray'}
//                           >
//                             Buy
//                           </Button>
//                         </div>
//                       ))}
//                     </List>
//                   </Modal>
//                 </div>
//               </div>

//               {/* Balance and Rewards Display */}
//               <div className="flex justify-center mt-6">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="text-center"
//                 >
//                   <Title caps level="1" weight="1" className="text-5xl text-white">
//                     {balance}
//                   </Title>
//                   <p className="text-lg text-[#f48d2f]">
//                     Catching <strong>{rewards} scorpions</strong>
//                   </p>
//                 </motion.div>
//               </div>

//               {/* Game Stats Modal Button */}
//               <div className="flex justify-center mt-6">
//                 <Modal
//                   header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Game Stats</ModalHeader>}
//                   trigger={
//                     <motion.button
//                       className="bg-[#f48d2f] hover:bg-[#e67e22] text-white p-3 rounded-full shadow-lg transition duration-200 ease-in-out"
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       View Stats
//                     </motion.button>
//                   }
//                 >
//                   <List>
//                     {/* Game Stats Section */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 50 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5 }}
//                       className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6 text-white"
//                     >
//                       <Title caps level="2" weight="2" className="text-center text-[#f48d2f] mb-4">Game Stats</Title>
//                       <div className="grid grid-cols-2 gap-6">
//                         <div className="stat-item text-center">
//                           <p className="text-2xl font-bold">{totalScorpionsCaught}</p>
//                           <p className="text-sm text-[#f48d2f]">Total Scorpions Caught</p>
//                         </div>
//                         <div className="stat-item text-center">
//                           <p className="text-2xl font-bold">{tasksCompleted}</p>
//                           <p className="text-sm text-[#f48d2f]">Tasks Completed</p>
//                         </div>
//                         <div className="stat-item text-center">
//                           <p className="text-2xl font-bold">{referralsMade}</p>
//                           <p className="text-sm text-[#f48d2f]">Referrals Made</p>
//                         </div>
//                         <div className="stat-item text-center">
//                           <p className="text-2xl font-bold">{Object.values(upgrades).reduce((a, b) => a + b, 0)}</p>
//                           <p className="text-sm text-[#f48d2f]">Upgrades Bought</p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </List>
//                 </Modal>
//               </div>


//               <div className="flex justify-center mt-6">
//                 <motion.div
//                   className={`relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border-8 border-[#f48d2f] flex items-center justify-center cursor-pointer ${
//                     cooldownTimeRemaining > 0 ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                   onMouseDown={cooldownTimeRemaining === 0 ? startHold : undefined}
//                   onMouseUp={cooldownTimeRemaining === 0 ? stopHold : undefined}
//                   onTouchStart={cooldownTimeRemaining === 0 ? startHold : undefined}
//                   onTouchEnd={cooldownTimeRemaining === 0 ? stopHold : undefined}
//                   onContextMenu={(e) => e.preventDefault()}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95, rotate: [0, 20, -20, 0] }}
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
//               <div className="flex justify-between items-center mt-6">
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

//               {/* Energy Bar */}
//               <div className="relative w-full h-4 bg-gray-700 rounded-full shadow-md overflow-hidden mb-2 mt-2">
//                 <motion.div
//                   className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
//                   style={{ width: `${energy}%` }}
//                   animate={{ width: `${energy}%` }}
//                   transition={{ duration: 0.5 }}
//                 />
//               </div>

//               <p className="text-center mt-2 text-sm text-[#f48d2f]">
//                 Hold the scorpion to catch more. The longer you hold, the more scorpions you earn.
//               </p>
            

//               {/* <div className="flex justify-center mt-6">
//                 <motion.div
//                   className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border-8 border-[#f48d2f] flex items-center justify-center cursor-pointer"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95, rotate: [0, 20, -20, 0] }}
//                   onClick={handleHoldInteraction} // Handle interaction
//                 >
//                   <img src={scorpion} alt="Scorpion" className="object-cover no-select" />
//                 </motion.div>
//               </div> */}
//             </div>
//           )}

//           {/* Leaderboard Tab */}
//           {currentTab === 'leaderboard' && (
//             <div className="leaderboard-tab">
//               <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">
//                 <div className="text-center mb-6">
//                   <h2 className="text-2xl md:text-3xl text-[#f48d2f] font-bold">🏆 Leaderboard</h2>
//                   <p className="text-[#f48d2f] mt-4">Top players ranked by scorpions caught</p>
//                 </div>

//                 {/* Leaderboard List */}
//                 <div className="space-y-4 mt-4">
//                   {leaderboardData.map((player, index) => (
//                     <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
//                       <span className="text-lg font-bold text-[#f48d2f]">#{index + 1}</span>
//                       <span className="text-white text-base">{player.username}</span>
//                       <span className="text-lg font-semibold text-green-400">{player.totalScorpions} Scorpions</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Display current player rank */}
//                 {playerRank !== null && (
//                   <div className="mt-6">
//                     <p className="text-lg font-semibold text-[#f48d2f] text-center">
//                       Your Rank: #{playerRank}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Quest Tab */}
//           {currentTab === 'quest' && (
//             <div className="task-tab">
//               <div className="p-custom">
//                 <div className="text-center mb-6">
//                   <Title caps level="1" weight="1" className="text-5xl text-white">
//                     {tasksCompleted}
//                   </Title>
//                   <p className="text-lg text-[#f48d2f]">Complete tasks to earn rewards</p>
//                 </div>

//                 {/* Task List */}
//                 <div className="space-y-4">
//                   {tasks.map((task) => (
//                     <div key={task.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
//                       <div className="flex justify-between items-center">
//                         <p className="text-sm md:text-base">{task.name}</p>
//                         <p className="text-[#f48d2f] text-sm md:text-base">
//                           {task.progress}/{task.goal} ({task.reward} Scorpions)
//                         </p>
//                         {task.progress === task.goal && (
//                           <Button
//                             onClick={() => claimTaskReward(task.id, task.reward)}
//                             size="s"
//                             color="green"
//                           >
//                             Claim
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Invite Tab */}
//           {currentTab === 'invite' && (
//             <div className="invite-tab">
//               <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-white">
//                 <div className="text-center mb-6">
//                   <h2 className="text-2xl md:text-3xl text-[#f48d2f] font-bold">👨‍👩‍👧‍👦 Invite Friends & Earn Rewards</h2>
//                   <p className="text-[#f48d2f] mt-4">Share your referral link and earn rewards for each successful referral!</p>
//                 </div>

//                 <div className="mt-4 mb-4">
//                   <p className="text-white">Your Referral Link</p>
//                   <p className="bg-gray-700 p-2 rounded-md text-white text-sm md:text-base">https://t.me/invite_link</p>
//                 </div>

//                 <div className="space-y-4 mt-4">
//                   <motion.button
//                     className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     Invite Friend
//                   </motion.button>
//                   <motion.button
//                     className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-300"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     Copy Invite Link
//                   </motion.button>
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
