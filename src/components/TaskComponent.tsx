// import React, { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Title, List, Button, Modal, Placeholder } from '@telegram-apps/telegram-ui';
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
// import { FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
// import { useGame } from './GameContextType';

// // Level calculation logic
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

// const getLevel = (balance: number) => {
//   const levelInfo = levels.find((level) => balance >= level.minBalance && balance <= level.maxBalance);
//   return levelInfo ? { name: levelInfo.name, level: levelInfo.level } : { name: 'Unknown', level: 0 };
// };

// // Task interface
// interface Task {
//   id: string;
//   description: string;
//   reward: number;
//   completed: boolean;
//   status: string;
//   requiredScorpions?: number;
//   platform?: string | null;
//   difficulty?: string;
//   link?: string;
//   type: 'in-game' | 'social';
//   requiredMiningLevel?: number;
//   requiredBalance?: number;
//   socialVerificationSteps?: string[];
// }



// // Mock functions (replace with actual API calls in production)
// const mockVerifySocialTask = async (taskId: string): Promise<boolean> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return Math.random() < 0.8;
// };

// const mockCompleteScoprionTask = async (
//   taskId: string, 
//   scorpionsCaught: number, 
//   miningLevel: number, 
//   balance: number
// ): Promise<boolean> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   const task = taskData.find(t => t.id === taskId);
//   if (!task || !task.requiredScorpions) return false;
//   return scorpionsCaught >= task.requiredScorpions &&
//          (!task.requiredMiningLevel || miningLevel >= task.requiredMiningLevel) &&
//          (!task.requiredBalance || balance >= task.requiredBalance);
// };

// const mockUpdateBalance = async (userId: number, reward: number): Promise<number> => {
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return reward;
// };

// const mockCheckSocialPlatformFollow = async (platform: string, userId: string): Promise<boolean> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return Math.random() < 0.8;
// };

// const mockCheckSocialPlatformLike = async (platform: string, postId: string, userId: string): Promise<boolean> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return Math.random() < 0.8;
// };

// const mockCheckSocialPlatformShare = async (platform: string, postId: string, userId: string): Promise<boolean> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return Math.random() < 0.7;
// };

// // Sample task data (replace with API fetch in production)
// const taskData: Task[] = [
//   { id: '12', description: 'Catch 5000 Scorpions', reward: 2500, completed: false, status: 'pending', requiredScorpions: 5000, type: 'in-game', requiredMiningLevel: 1, requiredBalance: 1000 },
//   { id: '13', description: 'Catch 50,000 Scorpions', reward: 5000, completed: false, status: 'pending', requiredScorpions: 50000, type: 'in-game', requiredMiningLevel: 5, requiredBalance: 10000 },
//   { id: '14', description: 'Catch 500,000 Scorpions', reward: 50000, completed: false, status: 'pending', requiredScorpions: 500000, type: 'in-game', requiredMiningLevel: 5, requiredBalance: 500000 },
 
//   { 
//     id: '17', 
//     description: 'Follow us on Twitter', 
//     reward: 2500, 
//     completed: false, 
//     difficulty: 'easy', 
//     platform: 'Twitter', 
//     link: 'https://x.com/scorpionworld3', 
//     status: 'pending', 
//     type: 'social',
//     socialVerificationSteps: ['follow']
//   },
//   { 
//     id: '18', 
//     description: 'Like and Share our Facebook post', 
//     reward: 5000, 
//     completed: false, 
//     difficulty: 'medium', 
//     platform: 'Facebook', 
//     link: 'https://web.facebook.com/people/Scorpionworld/61566331949332', 
//     status: 'pending', 
//     type: 'social',
//     socialVerificationSteps: ['like', 'share']
//   },
//   {
//     id: '19',
//     description: 'Subscribe to our YouTube channel',
//     reward: 3000,
//     completed: false,
//     difficulty: 'easy',
//     platform: 'YouTube',
//     link: 'https://youtube.com/scorpionworld',
//     status: 'pending',
//     type: 'social',
//     socialVerificationSteps: ['subscribe']
//   },
//   {
//     id: '20',
//     description: 'Join our Discord server',
//     reward: 2000,
//     completed: false,
//     difficulty: 'easy',
//     platform: 'Discord',
//     link: 'https://discord.gg/scorpionworld',
//     status: 'pending',
//     type: 'social',
//     socialVerificationSteps: ['join']
//   },
//   {
//     id: '21',
//     description: 'Follow and Retweet on Twitter',
//     reward: 4000,
//     completed: false,
//     difficulty: 'medium',
//     platform: 'Twitter',
//     link: 'https://x.com/scorpionworld3',
//     status: 'pending',
//     type: 'social',
//     socialVerificationSteps: ['follow', 'retweet']
//   }
// ];

// const platformIcons: { [key: string]: string } = {
//   Twitter: '🐦',
//   Facebook: '📘',
//   Instagram: '📷',
//   Telegram: '📱',
//   YouTube: '🎥',
// };

// export const TaskComponent: React.FC = () => {
//   const { scorpionMiner, updateScorpionMinerData } = useGame();
//   const [tasks, setTasks] = useState<Task[]>(taskData);
//   const [balance, setBalance] = useState(scorpionMiner?.balance || 0);
//   const [isSnackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
//   const [linkClicked, setLinkClicked] = useState<{[key: string]: boolean}>({});
//   const [isVerifying, setIsVerifying] = useState<{[key: string]: boolean}>({});
//   const [taskVerified, setTaskVerified] = useState<{[key: string]: boolean}>({});
//   const [verificationAttempts, setVerificationAttempts] = useState(0);
//   const [socialTaskProgress, setSocialTaskProgress] = useState<{[key: string]: string[]}>({});

//   const miningLevel = useMemo(() => getLevel(balance).level, [balance]);

//   useEffect(() => {
//     if (scorpionMiner) {
//       setBalance(scorpionMiner.balance);
//     }
//   }, [scorpionMiner]);

//   const showSnackbar = (message: string) => {
//     setSnackbarMessage(message);
//     setSnackbarVisible(true);
//     setTimeout(() => setSnackbarVisible(false), 3000);
//   };

//   const handleLinkClick = (taskId: string) => {
//     setLinkClicked(prev => ({ ...prev, [taskId]: true }));
//   };

//   const handleSocialAction = async (taskId: string, action: string) => {
//     const task = tasks.find(t => t.id === taskId);
//     if (!task || task.type !== 'social') return;

//     let success = false;
//     switch (action) {
//       case 'follow':
//         success = await mockCheckSocialPlatformFollow(task.platform!, scorpionMiner?.id?.toString() || '');
//         break;
//       case 'like':
//         success = await mockCheckSocialPlatformLike(task.platform!, task.id, scorpionMiner?.id?.toString() || '');
//         break;
//       case 'share':
//         success = await mockCheckSocialPlatformShare(task.platform!, task.id, scorpionMiner?.id?.toString() || '');
//         break;
//     }

//     if (success) {
//       setSocialTaskProgress(prev => ({
//         ...prev,
//         [taskId]: [...(prev[taskId] || []), action]
//       }));
//       showSnackbar(`Successfully completed: ${action} on ${task.platform}`);
//     } else {
//       showSnackbar(`Failed to verify: ${action} on ${task.platform}. Please try again.`);
//     }
//   };

//   const handleClaimReward = async (taskId: string) => {
//     setLoadingTaskId(taskId);
//     setIsVerifying(prev => ({ ...prev, [taskId]: true }));
//     setVerificationAttempts(0);

//     const task = tasks.find(t => t.id === taskId);
//     if (!task) return;

//     let isVerified = false;
//     for (let i = 0; i < 3; i++) {
//       setVerificationAttempts(prev => prev + 1);
//       if (task.type === 'social') {
//         const completedSteps = socialTaskProgress[taskId] || [];
//         isVerified = task.socialVerificationSteps?.every(step => completedSteps.includes(step)) || false;
//       } else {
//         isVerified = await mockCompleteScoprionTask(
//           taskId, 
//           scorpionMiner?.scorpionsCaught || 0,
//           miningLevel,
//           balance
//         );
//       }
//       if (isVerified) break;
//     }

//     setTaskVerified(prev => ({ ...prev, [taskId]: isVerified }));
//     setIsVerifying(prev => ({ ...prev, [taskId]: false }));

//     if (isVerified) {
//       await completeTask(task);
//     } else {
//       showSnackbar('Task verification failed. Please check requirements and try again.');
//     }

//     setLoadingTaskId(null);
//   };

//   const completeTask = async (task: Task) => {
//     try {
//       const rewardEarned = await mockUpdateBalance(scorpionMiner?.id || 0, task.reward);
//       setTasks(prevTasks => prevTasks.map(t =>
//         t.id === task.id ? { ...t, completed: true, status: 'completed' } : t
//       ));
//       const newBalance = balance + rewardEarned;
//       setBalance(newBalance);
//       updateScorpionMinerData({
//         balance: newBalance
//       });
//       showSnackbar(`Task completed! You earned ${rewardEarned} scorpions.`);
//     } catch (error) {
//       showSnackbar('Failed to update balance. Please contact support.');
//     }
//   };

//   const renderTaskItem = (task: Task) => (
//     <motion.div
//       key={task.id}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg mb-4 shadow-lg border border-blue-500"
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="text-lg font-bold text-white">
//             {task.platform ? platformIcons[task.platform] || '❓' : '🎯'} {task.description}
//           </p>
//           <p className="text-sm text-blue-300">
//             Reward: <span className="text-yellow-400">{task.reward}</span> scorpions
//             {task.requiredScorpions && ` | Required: ${task.requiredScorpions} scorpions`}
//             {task.requiredMiningLevel && ` | Required Mining Level: ${task.requiredMiningLevel}`}
//             {task.requiredBalance && ` | Required Balance: ${task.requiredBalance}`}
//             {task.difficulty && ` | Difficulty: ${task.difficulty}`}
//           </p>
//         </div>
//         <TaskModal 
//           task={task} 
//           onClaimReward={handleClaimReward} 
//           miningLevel={miningLevel} 
//           balance={balance} 
//           isVerifying={isVerifying[task.id]} 
//           loadingTaskId={loadingTaskId}
//           onSocialAction={handleSocialAction}
//           socialTaskProgress={socialTaskProgress}
//         />
//       </div>
//     </motion.div>
//   );

//   const categorizedTasks = useMemo(() => {
//     const inGameTasks = tasks.filter(task => task.type === 'in-game' && !task.completed);
//     const socialTasks = tasks.filter(task => task.type === 'social' && !task.completed);
//     return { inGameTasks, socialTasks };
//   }, [tasks]);

//   return (
//     <div className='p-custom bg-gradient-to-b from-black to-blue-900 min-h-screen'>
//       <Snackbar message={snackbarMessage} isVisible={isSnackbarVisible} />
      
//       <BalanceDisplay balance={balance} />

//       <h2 className="text-2xl text-white mb-4 mt-8">Social Tasks</h2>
//       <List>
//         <AnimatePresence>
//           {categorizedTasks.socialTasks.map(renderTaskItem)}
//         </AnimatePresence>
//       </List>

//       <h2 className="text-2xl text-white mb-4">In-Game Tasks</h2>
//       <List>
//         <AnimatePresence>
//           {categorizedTasks.inGameTasks.map(renderTaskItem)}
//         </AnimatePresence>
//       </List>
//     </div>
//   );
// };

// const Snackbar: React.FC<{ message: string; isVisible: boolean }> = ({ message, isVisible }) => (
//   isVisible && (
//     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#f48d2f] text-white px-4 py-2 rounded-lg shadow-lg z-50">
//       {message}
//     </div>
//   )
// );

// const BalanceDisplay: React.FC<{ balance: number }> = ({ balance }) => (
//   <div className="mt-6">
//     <h2 className="text-2xl text-white mb-2">Miner Balance</h2>
//     <p className="text-4xl font-bold text-[#f48d2f] mb-6 animate-pulse">
//       {balance} <span className="text-2xl">scorpions</span>
//     </p>
//   </div>
// );

// const TaskModal: React.FC<{ 
//   task: Task; 
//   onClaimReward: (taskId: string) => void;
//   miningLevel: number;
//   balance: number;
//   isVerifying: boolean;
//   loadingTaskId: string | null;
//   onSocialAction: (taskId: string, action: string) => void;
//   socialTaskProgress: {[key: string]: string[]};
// }> = ({ task, onClaimReward, miningLevel, balance, isVerifying, loadingTaskId, onSocialAction, socialTaskProgress }) => {
//   const { scorpionMiner } = useGame();

//   const canClaimReward = () => {
//     if (task.type === 'social') {
//       const completedSteps = socialTaskProgress[task.id] || [];
//       return task.socialVerificationSteps?.every(step => completedSteps.includes(step)) || false;
//     } else {
//       return (
//         (!task.requiredMiningLevel || miningLevel >= task.requiredMiningLevel) &&
//         (!task.requiredBalance || balance >= task.requiredBalance) &&
//         (scorpionMiner?.scorpionsCaught || 0) >= (task.requiredScorpions || 0)
//       );
//     }
//   };

//   return (
//     <Modal
//       header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Task Instructions</ModalHeader>}
//       trigger={(
//         <Button
//           disabled={task.completed}
//           onClick={() => {}}
//           size="m"
//           color={task.completed ? 'secondary' : 'primary'}
//         >
//           {task.completed ? 'Done' : 'Start'}
//         </Button>
//       )}
//     >
//       <Placeholder description={task.description} header="Task Instructions">
//         <div className="space-y-4">
//           {task.type === 'social' && (
//             <>
//               <div className="flex items-center space-x-2">
//                 <span className="text-lg font-bold text-[#f48d2f]">1.</span>
//                 <p className="text-sm">Complete the following steps:</p>
//               </div>
//               {task.socialVerificationSteps?.map((step, index) => (
//                 <div key={step} className="flex items-center space-x-2">
//                   <Button
//                     onClick={() => onSocialAction(task.id, step)}
//                     disabled={socialTaskProgress[task.id]?.includes(step)}
//                     size="s"
//                     color={socialTaskProgress[task.id]?.includes(step) ? 'secondary' : 'primary'}
//                   >
//                     {step.charAt(0).toUpperCase() + step.slice(1)}
//                   </Button>
//                   <p className="text-sm">{`${step.charAt(0).toUpperCase() + step.slice(1)} on ${task.platform}`}</p>
//                   {socialTaskProgress[task.id]?.includes(step) && (
//                     <span className="text-green-500">✓</span>
//                   )}
//                 </div>
//               ))}
//               <div className="flex items-center">
//                 <a
//                   href={task.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 underline flex items-center"
//                 >
//                   <FaExternalLinkAlt className="mr-2" />
//                   Go to {task.platform}
//                 </a>
//               </div>
//             </>
//           )}

//           {task.type === 'in-game' && (
//             <>
//               <div className="flex items-center space-x-2">
//                 <span className="text-lg font-bold text-[#f48d2f]">1.</span>
//                 <p className="text-sm">Requirements:</p>
//               </div>
//               <ul className="list-disc list-inside text-sm">
//                 <li>Mining Level: {task.requiredMiningLevel || 'N/A'} (Your level: {miningLevel})</li>
//                 <li>Balance: {task.requiredBalance || 'N/A'} (Your balance: {balance})</li>
//                 <li>Scorpions Caught: {task.requiredScorpions || 'N/A'} (Your caught: {scorpionMiner?.scorpionsCaught || 0})</li>
//               </ul>
//             </>
//           )}

//           <div className="flex items-center space-x-2">
//             <span className="text-lg font-bold text-[#f48d2f]">{task.type === 'social' ? '2.' : '1.'}</span>
//             <p className="text-sm">Claim your reward once all steps are complete:</p>
//           </div>

//           <center>
//             <Button
//               disabled={task.completed || !canClaimReward() || isVerifying}
//               onClick={() => onClaimReward(task.id)}
//               size="l"
//               color={task.completed ? 'secondary' : canClaimReward() ? 'primary' : 'secondary'}
//             >
//               {task.completed ? 'Done' : isVerifying ? (
//                 <div className="flex items-center">
//                   <FaSpinner className="animate-spin mr-2" />
//                   Verifying...
//                 </div>
//               ) : 'Claim Task Reward'}
//             </Button>
//           </center>
//         </div>
//       </Placeholder>
//     </Modal>
//   );
// };

// export default TaskComponent;