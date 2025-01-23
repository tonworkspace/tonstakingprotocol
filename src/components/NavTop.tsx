// import React from 'react';
// import { useGame } from './GameContextType';
// import { Modal, List, Title } from '@telegram-apps/telegram-ui';
// import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
// import { ModalClose } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalClose/ModalClose';
// import { motion } from 'framer-motion';

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

// const NavTop: React.FC = () => {
//   const { user, scorpionMiner } = useGame();

//   if (!user || !scorpionMiner) return null;

//   const levelInfo = getLevel(scorpionMiner.balance);

//   return (
//     <div className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-md">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="p-2 rounded-lg shadow-md">
//             <img
//               src={user.photoUrl || 'https://xelene.me/telegram.gif'}
//               alt="Profile"
//               width={40}
//               height={40}
//               className="rounded-full shadow-lg"
//             />
//           </div>
//           <div className="ml-2 text-white">
//             <p className="text-sm font-semibold">@{user.username || 'Username'}</p>
//             <p className="text-xs text-gray-400">
//               {user.firstName} {user.lastName || ''}
//             </p>
//             <p className="text-xs text-[#f48d2f]">{levelInfo.name} (Level {levelInfo.level})</p>
//           </div>
//         </div>
        
//         <Modal
//           header={<ModalHeader after={<ModalClose>Close</ModalClose>}>Game Stats</ModalHeader>}
//           trigger={
//             <motion.button
//               className="bg-[#f48d2f] hover:bg-[#e67e22] text-white p-2 rounded-full shadow-lg transition duration-200 ease-in-out"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               View Stats
//             </motion.button>
//           }
//         >
//           <List>
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6 text-white"
//             >
//               <Title caps level="2" weight="2" className="text-center text-[#f48d2f] mb-4">Game Stats</Title>
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{scorpionMiner.balance}</p>
//                   <p className="text-sm text-[#f48d2f]">Total Scorpions</p>
//                 </div>
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{scorpionMiner.scorpionsCaught}</p>
//                   <p className="text-sm text-[#f48d2f]">Scorpions Caught</p>
//                 </div>
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{scorpionMiner.tasks?.filter((task: { status: string; }) => task.status === 'COMPLETED').length || 0}</p>
//                   <p className="text-sm text-[#f48d2f]">Tasks Completed</p>
//                 </div>
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{scorpionMiner.referredPlayers?.length || 0}</p>
//                   <p className="text-sm text-[#f48d2f]">Referrals Made</p>
//                 </div>
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{levelInfo.name}</p>
//                   <p className="text-sm text-[#f48d2f]">Mining Rank (Level {levelInfo.level})</p>
//                 </div>
//                 <div className="stat-item text-center">
//                   <p className="text-2xl font-bold">{scorpionMiner.energy}</p>
//                   <p className="text-sm text-[#f48d2f]">Current Energy</p>
//                 </div>
//               </div>
//             </motion.div>
//           </List>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default NavTop;