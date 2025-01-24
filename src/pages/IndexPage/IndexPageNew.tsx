// import React, { useState } from 'react';
// import { Tabbar } from '@telegram-apps/telegram-ui';
// import { GiPickle, GiScrollUnfurled } from 'react-icons/gi';
// import { FaUserFriends } from 'react-icons/fa';
// import { GameProvider } from '@/components/GameContextType';
// import { GameComponent } from '@/components/GameComponent';
// import TaskComponent  from '@/components/TaskComponent';
// // Import other components (QuestsComponent, InviteComponent) when they're ready

// const tabs = [
//   { id: 'mine', text: 'Mine', Icon: GiPickle },
//   { id: 'quest', text: 'Quest', Icon: GiScrollUnfurled },
//   { id: 'invite', text: 'Invite', Icon: FaUserFriends },
// ];

// export const IndexPage: React.FC = () => {
//   const [currentTab, setCurrentTab] = useState(tabs[0].id);

//   return (
//     <GameProvider>
//       <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black px-4 py-6 relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-72 h-72 bg-blue-700 opacity-20 rounded-full blur-2xl"></div>
//         <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-600 opacity-20 rounded-full blur-2xl"></div>

//         {currentTab === 'mine' && <GameComponent />}
//         {currentTab === 'quest' && <TaskComponent />}


//         {/* Add other components for 'quest' and 'invite' tabs when they're ready */}

//         <div className="fixed bottom-0 left-0 right-0">
//           <Tabbar>
//             {tabs.map(({ id, text, Icon }) => (
//               <Tabbar.Item
//                 key={id}
//                 text={text}
//                 selected={id === currentTab}
//                 onClick={() => setCurrentTab(id)}
//               >
//                 <Icon size={24} className="text-white" />
//               </Tabbar.Item>
//             ))}
//           </Tabbar>
//         </div>
//       </div>
//     </GameProvider>
//   );
// };

// export default IndexPage;