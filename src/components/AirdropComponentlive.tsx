// import { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";

// import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
// import { Address } from "@ton/core";
// import { JettonBalance } from "@ton-api/client";
// import { toNano } from "@ton/core";

// import { isValidAddress } from "../utility/address";
// import { JettonList } from "../components/JettonList";
// import { SendJettonModal } from "../components/SendJettonModal";
// import { NFTList } from "../components/NFTList";
// import ta from "../utility/tonapi";
// import { NFTMinter } from './NFTMinter';
// import { formatTonValue } from "../utility/format";
// import { ProfileHeader } from "./ProfileHeader";
// import useAuth from "@/hooks/useAuth";
// import { getLevel } from "@/gameData";
// import { Button, Snackbar } from "@telegram-apps/telegram-ui";
// import { X } from "lucide-react";
// import { Send } from "lucide-react";
// import { AlertCircle } from "lucide-react";

// // Add these utility functions at the top of your file
// const calculateEndTime = () => {
//   // Option 1: Set a specific end date
//   // const endDate = new Date('2025-04-01T00:00:00Z'); // Replace with your target date
  
//   // Option 2: Set duration from now (e.g., 48 hours from now)
//   const endDate = new Date(Date.now() + (48 * 60 * 60 * 1000));
  
//   return endDate;
// };

// const calculateTimeLeft = (endTime: Date) => {
//   const total = endTime.getTime() - Date.now();
  
//   if (total <= 0) {
//     return { hours: 0, minutes: 0, seconds: 0 };
//   }
  
//   return {
//     hours: Math.floor((total / (1000 * 60 * 60))),
//     minutes: Math.floor((total / (1000 * 60)) % 60),
//     seconds: Math.floor((total / 1000) % 60)
//   };
// };

// // Add this constant at the top of the file
// const NFT_MINT_REWARD = 1000000; // Amount of Scorpions to reward

// function AirdropComponent() {
//   const { user, playerData, updatePlayerData } = useAuth();
//   const [jettons, setJettons] = useState<JettonBalance[] | null>(null);
//   const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [tonBalance, setTonBalance] = useState<string>("0.00");
//   const [isSendModalOpen, setSendModalOpen] = useState(false);
//   const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);

//   const connectedAddressString = useTonAddress();
//   const connectedAddress = useMemo(() => {
//     return isValidAddress(connectedAddressString)
//       ? Address.parse(connectedAddressString)
//       : null;
//   }, [connectedAddressString]);

//   const [tonConnectUI] = useTonConnectUI();
//   const wallet = tonConnectUI.wallet;

//   // Add these state variables near the top of the component
//   const [isLoadingTON, setIsLoadingTON] = useState(true);
//   const [isLoadingScorpion, setIsLoadingScorpion] = useState(true);

//   // Add this state near the top of the component
//   const [activeTab, setActiveTab] = useState<'jettons' | 'nfts'>('jettons');

//   // Update the useEffect that fetches TON balance
//   useEffect(() => {
//     if (!connectedAddress) {
//       setJettons(null);
//       setTonBalance("0.00");
//       setIsLoadingTON(false);
//       return;
//     }

//     setIsLoadingTON(true);
//     ta.accounts
//       .getAccount(connectedAddress)
//       .then((info) => {
//         const balance = formatTonValue(info.balance.toString());
//         setTonBalance(balance);
//       })
//       .catch((e) => {
//         console.error("Failed to fetch TON balance:", e);
//         setTonBalance("0.00");
//       })
//       .finally(() => {
//         setIsLoadingTON(false);
//       });
//   }, [connectedAddress]);

//   // Add this useEffect to handle Scorpion loading state
//   useEffect(() => {
//     setIsLoadingScorpion(true);
//     if (playerData !== undefined) {
//       setIsLoadingScorpion(false);
//     }
//   }, [playerData]);

//   useEffect(() => {
//     if (!connectedAddress) {
//       setJettons(null);
//       setTonBalance("0.00");
//       return;
//     }

//     ta.accounts
//       .getAccountJettonsBalances(connectedAddress)
//       .then((res) => setJettons(res.balances))
//       .catch((e) => {
//         console.error(e);
//         setError(e.message || "Failed to fetch jettons");
//         setJettons(null);
//       });
//   }, [connectedAddress]);

  
//   const handleImportToken = async (tokenAddress: string) => {
//     try {
//       // Get all jetton balances for the wallet
//       const balanceInfo = await ta.accounts.getAccountJettonsBalances(
//         Address.parse(connectedAddressString!)
//       );
      
//       // Find the specific jetton balance
//       const balance = balanceInfo.balances.find(
//         j => j.jetton.address.toString() === tokenAddress
//       );
      
//       if (balance) {
//         setJettons(prev => prev ? [...prev, balance] : [balance]);
//       }
//     } catch (error) {
//       console.error('Error importing token:', error);
//     }
//   };

//   const handleSendTon = async (destinationAddress: string, amount: string) => {
//     try {
//       setError(null);
//       const transaction = {
//         validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
//         messages: [
//           {
//             address: destinationAddress,
//             amount: toNano(amount).toString(),
//           },
//         ],
//       };

//       await tonConnectUI.sendTransaction(transaction);
//       setSendModalOpen(false);
//     } catch (e) {
//       console.error('Failed to send TON:', e);
//       setError(e instanceof Error ? e.message : 'Failed to send TON. Please try again.');
//     }
//   };

//   // Calculate levelInfo based on player's balance
//   const levelInfo = useMemo(() => {
//     if (!playerData) {
//       return {
//         name: "Loading...",
//         level: 1,
//         minBalance: 0,
//         maxBalance: 999
//       };
//     }
//     return getLevel(playerData.balance || 0);
//   }, [playerData]);

//   // Add a toast/notification state
//   const [copySuccess, setCopySuccess] = useState(false);

//   const handleCopyAddress = async () => {
//     if (!connectedAddressString) return;
    
//     try {
//       await navigator.clipboard.writeText(connectedAddressString);
//       setCopySuccess(true);
//       // Reset success message after 2 seconds
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy address:', err);
//       setError('Failed to copy address to clipboard');
//     }
//   };

//  const [endTime] = useState(calculateEndTime());
//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft(endTime);
//       setTimeLeft(newTimeLeft);
      
//       // Stop the timer when we reach zero
//       if (newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
//         clearInterval(timer);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [endTime]);

//   // Add this new function
//   const handleMintSuccess = async () => {
//     if (!playerData) {
//       console.error("No player data available");
//       return;
//     }

//     try {
//       const newBalance = (playerData.balance || 0) + NFT_MINT_REWARD;
//       const newLevelInfo = getLevel(newBalance);

//       await updatePlayerData({
//         balance: newBalance,
//         miningLevel: newLevelInfo.level,
//         // You can also update other stats if needed
//         tasksCompleted: (playerData.tasksCompleted || 0) + 1,
//       });

//       showSnackbar(
//         "🎉 Achievement Unlocked!",
//         `+${NFT_MINT_REWARD.toLocaleString()} Scorpions | Foundation Sigil NFT Successfully Minted 🏆`
//       );
//     } catch (error) {
//       console.error("Error rewarding mint:", error);
//       showSnackbar(
//         "⚠️ Action Required",
//         "Unable to process rewards. Please try again or contact Discord support."
//       );
//     }
//   };

//   const [snackbarMessage, setSnackbarMessage] = useState<string>('');
//   const [snackbarDescription, setSnackbarDescription] = useState<string>('');
//   const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

//   const showSnackbar = (message: string, description: string) => {
//     setSnackbarMessage(message);
//     setSnackbarDescription(description);
//     setIsSnackbarVisible(true);
//     setTimeout(() => setIsSnackbarVisible(false), 3000);
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="">
//         <div className="max-w-5xl mx-auto">
//           <ProfileHeader
//             photoUrl={user?.photoUrl}
//             username={user?.username || "Unknown"}
//             customButton={
//               wallet && 'imageUrl' in wallet ? (
//                 <div className="flex items-center ml-[28px]">
//                   <TonConnectButton className="!px-18 !py-2 ml-[28px]" />
//                 </div>
//               ) : (
//                 <TonConnectButton className="!px-18 !py-2 ml-[28px]" />
//               )
//             }
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="airdrop-custom">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//             {/* Active Task: NFT Minter Card */}
//             {!connectedAddress ? (
//               <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 border border-orange-500/50 rounded-2xl shadow-xl relative overflow-hidden">
//                 {/* Animated gradient background */}                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {/* Left Column: Auth Content */}
//                   <div className="md:col-span-2">
//                     <div className="text-center space-y-6">
//                       <div className="space-y-4 max-w-2xl mx-auto">
//                         <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
//                           Authentication Required
//                         </h2>
                        
//                         <div className="bg-[#2c2d31] rounded-2xl p-6 shadow-xl border border-orange-500/20">
//                           <div className="">
//                             {/* Task Content */}
//                             <div className="flex flex-col items-center">
//                               {/* Scorpion Logo Animation */}
//                               <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.8 }}
//                                 className="flex justify-center items-center relative z-10 mb-2"
//                               >
//                                 <motion.div
//                                   animate={{ rotate: [0, 5, -5, 0] }}
//                                   transition={{ 
//                                     duration: 4,
//                                     repeat: Infinity,
//                                     ease: "easeInOut"
//                                   }}
//                                 >
//                                   <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     {/* Body - with gradient fill */}
//                                     <motion.path
//                                       d="M30 50C30 45 35 40 40 40C45 40 48 42 50 45C52 42 55 40 60 40C65 40 70 45 70 50C70 60 60 70 50 70C40 70 30 60 30 50Z"
//                                       fill="url(#scorpionGradient)"
//                                       initial={{ scale: 0.95 }}
//                                       animate={{ scale: 1 }}
//                                       transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//                                     />
//                                     {/* Tail - with same gradient */}
//                                     <motion.path
//                                       d="M50 70C50 70 45 75 45 80C45 85 50 90 50 90C50 90 55 85 55 80C55 75 50 70 50 70Z"
//                                       fill="url(#scorpionGradient)"
//                                       initial={{ rotate: -3 }}
//                                       animate={{ rotate: 3 }}
//                                       transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//                                     />
//                                     {/* Claws - with same gradient */}
//                                     <motion.path
//                                       d="M25 45C20 45 15 50 15 55C15 60 20 62 25 60C30 58 30 50 25 45Z"
//                                       fill="url(#scorpionGradient)"
//                                       initial={{ rotate: -3 }}
//                                       animate={{ rotate: 3 }}
//                                       transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//                                     />
//                                     <motion.path
//                                       d="M75 45C80 45 85 50 85 55C85 60 80 62 75 60C70 58 70 50 75 45Z"
//                                       fill="url(#scorpionGradient)"
//                                       initial={{ rotate: 3 }}
//                                       animate={{ rotate: -3 }}
//                                       transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//                                     />
//                                     {/* Eyes - with glow effect */}
//                                     <circle cx="43" cy="45" r="2" fill="#ffffff">
//                                       <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
//                                     </circle>
//                                     <circle cx="57" cy="45" r="2" fill="#ffffff">
//                                       <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
//                                     </circle>
//                                     {/* Stinger - with bright red glow */}
//                                     <motion.path
//                                       d="M50 90L48 95L50 98L52 95L50 90"
//                                       fill="#ff4444"
//                                       initial={{ scale: 0.9 }}
//                                       animate={{ scale: 1.1 }}
//                                       transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//                                       style={{ filter: 'drop-shadow(0 0 2px #ff0000)' }}
//                                     />
                                    
//                                     {/* Gradient definitions */}
//                                     <defs>
//                                       <linearGradient id="scorpionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                                         <stop offset="0%" style={{ stopColor: '#f97316' }} />
//                                         <stop offset="100%" style={{ stopColor: '#ea580c' }} />
//                                       </linearGradient>
//                                     </defs>
//                                   </svg>
//                                 </motion.div>
//                               </motion.div>
                              
//                               <div className="flex justify-center">
//                                 <div className="w-full touch-manipulation relative z-50">
//                                   <center>
//                                     <TonConnectButton className="!min-h-[48px] !px-6 !py-3 relative z-50" />
//                                   </center>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="text-center mt-4">
//                           <p className="text-gray-400 text-sm">
//                             New to TON? {' '}
//                             <a 
//                               href="https://ton.org/docs" 
//                               target="_blank" 
//                               rel="noopener noreferrer" 
//                               className="text-orange-400 hover:text-orange-300 transition-colors"
//                             >
//                               Learn more about Web3 wallets
//                             </a>
//                           </p>
//                         </div>

//                         <div className="bg-black/20 rounded-xl p-6 max-w-lg mx-auto">
//                           <ul className="text-left space-y-4 text-gray-300">
//                             <li className="flex items-center gap-3">
//                               <span className="text-green-400">✓</span>
//                               Mint exclusive Foundation Sigil NFT
//                             </li>
//                             <li className="flex items-center gap-3">
//                               <span className="text-green-400">✓</span>
//                               Earn Scorpion rewards
//                             </li>
//                             <li className="flex items-center gap-3">
//                               <span className="text-green-400">✓</span>
//                               Access special ecosystem benefits
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column: Profile & Stats */}
//                   <div className="space-y-6">
//                     {/* Profile Card */}
//                     <div className="bg-[#1c2028]/50 rounded-2xl p-6 border border-orange-500/20 shadow-[0_0_30px_rgba(251,146,60,0.1)] relative group hover:shadow-[0_0_40px_rgba(251,146,60,0.2)] transition-all duration-300">
//                       {/* Animated gradient overlay */}
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
//                       <div className="relative">
//                         <div className="text-center">
//                           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 p-1 shadow-[0_0_20px_rgba(251,146,60,0.3)]">
//                             <div className="w-full h-full rounded-full bg-[#1c2028] flex items-center justify-center border border-orange-500/20">
//                               <span className="text-3xl animate-pulse">🦂</span>
//                             </div>
//                           </div>
//                           <h3 className="text-xl font-bold text-white mb-1 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-200">
//                             Level {levelInfo.level}
//                           </h3>
//                           <p className="text-sm text-orange-300/80">{levelInfo.name}</p>
//                         </div>

//                         {/* Enhanced Progress Bar */}
//                         <div className="mt-6">
//                           <div className="h-3 bg-[#151820] rounded-full overflow-hidden border border-orange-500/20 shadow-[0_0_10px_rgba(251,146,60,0.1)]">
//                             <div 
//                               className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-pink-500 animate-pulse"
//                               style={{ 
//                                 width: `${((playerData?.balance || 0) - levelInfo.minBalance) / 
//                                 (levelInfo.maxBalance - levelInfo.minBalance) * 100}%` 
//                               }}
//                             >
//                               <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer"></div>
//                             </div>
//                           </div>
//                           <div className="flex justify-between text-xs text-orange-300/60 mt-2 font-medium">
//                             <span>{levelInfo.minBalance}</span>
//                             <span>{levelInfo.maxBalance}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Quick Stats Card */}
//                     <div className="bg-[#1c2028]/50 rounded-2xl p-6 border border-orange-500/20 shadow-[0_0_30px_rgba(251,146,60,0.1)] relative group hover:shadow-[0_0_40px_rgba(251,146,60,0.2)] transition-all duration-300">
//                       {/* Animated gradient overlay */}
//                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
//                       <div className="relative">
//                         <h3 className="text-sm font-semibold text-orange-400 mb-6 uppercase tracking-wider">Quick Stats</h3>
//                         <div className="space-y-5">
//                           <div className="flex justify-between items-center p-3 bg-[#151820] rounded-xl border border-orange-500/10 group/stat hover:border-orange-500/30 transition-colors">
//                             <span className="text-orange-300/80 group-hover/stat:text-orange-300 transition-colors">Tasks Completed</span>
//                             <span className="text-white font-medium bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
//                               {playerData?.tasksCompleted || 0}
//                             </span>
//                           </div>
//                           <div className="flex justify-between items-center p-3 bg-[#151820] rounded-xl border border-orange-500/10 group/stat hover:border-orange-500/30 transition-colors">
//                             <span className="text-orange-300/80 group-hover/stat:text-orange-300 transition-colors">Total Balance</span>
//                             <span className="text-white font-medium bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
//                               {playerData?.balance || 0} <span className="text-sm text-orange-300/60">SCR</span>
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Progress indicator */}
//                 <div className="mt-6 pt-6 border-t border-gray-700/50">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-gray-400">Authentication Status</span>
//                       <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
//                     </div>
//                     <span className="text-yellow-400 font-medium">Pending Connection</span>
//                   </div>
//                 </div>
//               </div>
//             ) : (
              
//               <div className="md:col-span-2 bg-gradient-to-br from-orange-900/20 to-orange-900/20 rounded-2xl p-6 border border-orange-500/50 shadow-xl relative overflow-hidden">
//                 {/* Animated gradient background */}                
//                 Task Header with enhanced animations
//                 <div className="space-y-4 mb-8 animate-fade-in">
//                   <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 flex items-center group">
//                     <svg 
//                       className="w-5 h-5 mr-3 text-orange-400" 
//                       viewBox="0 0 24 24" 
//                       fill="none" 
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path 
//                         d="M12 2L2 7L12 12L22 7L12 2Z" 
//                         stroke="currentColor" 
//                         strokeWidth="2" 
//                         strokeLinecap="round" 
//                         strokeLinejoin="round" 
//                         className="opacity-90"
//                       />
//                       <path 
//                         d="M2 17L12 22L22 17" 
//                         stroke="currentColor" 
//                         strokeWidth="2" 
//                         strokeLinecap="round" 
//                         strokeLinejoin="round" 
//                         className="opacity-70"
//                       />
//                       <path 
//                         d="M2 12L12 17L22 12" 
//                         stroke="currentColor" 
//                         strokeWidth="2" 
//                         strokeLinecap="round" 
//                         strokeLinejoin="round" 
//                         className="opacity-80"
//                       />
//                     </svg>

//                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-orange-100 font-semibold tracking-wide">
//                       Foundation Sigil
//                     </span>

//                     <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
//                       Limited Access
//                     </span>
//                   </h2>
                  
//                   <p className="text-base sm:text-base text-gray-400 leading-loose max-w-2xl relative group">
//                     <span className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
//                     <span className="relative">
//                       🎉 Claim your Foundation Sigil NFT
//                       <span className="text-orange-400 font-semibold"> - Your proof of early adoption. </span>
//                       This exclusive credential unlocks special benefits in the Scorpion ecosystem.
//                       <span className="text-orange-400 font-semibold"> Your purchase is a token of gratitude, fueling future developments. </span>
//                       <span className="block mt-2 text-yellow-500 font-medium animate-bounce">
//                         🏆 Limited time offer for early adopters
//                       </span>
//                     </span>
//                   </p>
//                 </div>
               
//                 <div className="">
//                   <NFTMinter onMintSuccess={handleMintSuccess} />
//                 </div>

//                 {/* Progress indicator with countdown */}
//                 <div className="mt-6 pt-6 border-t border-gray-700/50">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-gray-400">Onchain Quest</span>
//                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2">
//                         <svg className="w-4 h-4 text-yellow-500 animate-spin-slow" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         <div className="flex space-x-1 font-mono text-sm">
//                           <div className="bg-gray-800/50 rounded px-2 py-1">
//                             <span className="text-yellow-400">{timeLeft.hours.toString().padStart(2, '0')}</span>
//                             <span className="text-xs text-gray-500 ml-1">h</span>
//                           </div>
//                           <div className="bg-gray-800/50 rounded px-2 py-1">
//                             <span className="text-yellow-400">{timeLeft.minutes.toString().padStart(2, '0')}</span>
//                             <span className="text-xs text-gray-500 ml-1">m</span>
//                           </div>
//                           <div className="bg-gray-800/50 rounded px-2 py-1">
//                             <span className="text-yellow-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
//                             <span className="text-xs text-gray-500 ml-1">s</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//              {/* Only show wallet-dependent sections when connected */}
//              {connectedAddress && (
//                <>
//                  {/* Balance Card */}
//                  <div className="md:col-span-2 bg-gradient-to-br from-orange-900/20 to-orange-900/20 rounded-2xl p-6 border border-orange-500/50 shadow-xl relative overflow-hidden">

//                    <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-stretch w-full">
//                      {/* Currency Displays */}
//                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full">
//                        {/* TON Balance Card */}
//                        <div className="group bg-gradient-to-r from-[#1e2738]/95 to-[#1a2235]/95 rounded-xl p-4 lg:p-6 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
//                          <div className="flex items-center space-x-3 mb-3">
//                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center ring-2 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all">
//                              <span className="text-2xl">💎</span>
//                            </div>
//                            <div>
//                              <h2 className="text-white text-xs font-semibold uppercase tracking-wider">TON Balance</h2>
//                              <p className="text-gray-400 text-xs">Available</p>
//                            </div>
//                          </div>
//                          <div className="mt-4">
//                            {isLoadingTON ? (
//                              <div className="animate-pulse flex space-x-2 items-baseline">
//                                <div className="h-8 bg-orange-500/20 rounded w-24"></div>
//                                <div className="h-4 bg-gray-500/20 rounded w-8"></div>
//                              </div>
//                            ) : (
//                              <p className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
//                                {new Intl.NumberFormat('en-US', {
//                                  minimumFractionDigits: 2,
//                                  maximumFractionDigits: 2,
//                                }).format(parseFloat(tonBalance))}
//                                <span className="text-base ml-2 text-gray-400">TON</span>
//                              </p>
//                            )}
//                          </div>
//                        </div>

//                        {/* Scorpion Balance Card */}
//                        <div className="group bg-gradient-to-r from-[#1e2738]/95 to-[#1a2235]/95 rounded-xl p-4 lg:p-6 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
//                          <div className="flex items-center space-x-3 mb-3">
//                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center ring-2 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all">
//                              <span className="text-2xl">🦂</span>
//                            </div>
//                            <div>
//                              <h2 className="text-white text-xs font-semibold uppercase tracking-wider">Scorpion</h2>
//                              <p className="text-gray-400 text-xs">Game Currency</p>
//                            </div>
//                          </div>
//                          <div className="mt-4">
//                            {isLoadingScorpion ? (
//                              <div className="space-y-2">
//                                <div className="animate-pulse flex space-x-2 items-baseline">
//                                  <div className="h-8 bg-orange-500/20 rounded w-24"></div>
//                                  <div className="h-4 bg-gray-500/20 rounded w-8"></div>
//                                </div>
//                                <div className="animate-pulse h-4 bg-gray-500/20 rounded w-20 mt-2"></div>
//                              </div>
//                            ) : (
//                              <>
//                                <p className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
//                                  {new Intl.NumberFormat('en-US').format(playerData?.balance || 0)}
//                                  <span className="text-base ml-2 text-gray-400">SCR</span>
//                                </p>
//                                <p className="text-sm text-gray-400 mt-1">Level {levelInfo.level} Account</p>
//                              </>
//                            )}
//                          </div>
//                        </div>
//                      </div>
//                    </div>

//                    {/* Action Buttons */}
//                    <div className="flex flex-wrap gap-3 mt-6">
//                      <button 
//                        onClick={() => setReceiveModalOpen(true)}
//                        className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 text-orange-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 border border-orange-500/20 hover:border-orange-500/30"
//                      >
//                        <span className="text-lg">↓</span>
//                        <span>Receive</span>
//                      </button>
//                      <button 
//                        onClick={() => setSendModalOpen(true)}
//                        className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 text-orange-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 border border-orange-500/20 hover:border-orange-500/30"
//                      >
//                        <span className="text-lg">↑</span>
//                        <span>Send</span>
//                      </button>
//                    </div>
//                  </div>

//                  {/* Replace the separate Jettons and NFTs sections with this tabbed interface */}
//                  <div className="md:col-span-2 bg-gradient-to-br from-orange-900/20 to-orange-900/20 rounded-2xl p-6 border border-orange-500/50 shadow-xl relative overflow-hidden">                   
//                    {/* Tab Navigation */}
//                    <div className="flex space-x-4 mb-6">
//                      <button
//                        onClick={() => setActiveTab('jettons')}
//                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
//                          ${activeTab === 'jettons' 
//                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
//                            : 'text-gray-400 hover:text-gray-300'}`}
//                      >
//                        <span className="text-lg">💎</span>
//                        <span>Jettons</span>
//                        {jettons && (
//                          <span className="ml-2 bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">
//                            {jettons.length}
//                          </span>
//                        )}
//                      </button>
                     
//                      <button
//                        onClick={() => {
//                          console.log('Switching to NFTs tab');
//                          setActiveTab('nfts');
//                        }}
//                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
//                          ${activeTab === 'nfts' 
//                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
//                            : 'text-gray-400 hover:text-gray-300'}`}
//                      >
//                        <span className="text-lg">🖼️</span>
//                        <span>NFTs</span>
//                      </button>
//                    </div>

//                    {/* Tab Content */}
//                    <div className="">
//                      {activeTab === 'jettons' ? (
//                        <div className="space-y-4">
//                          <div className="flex items-center justify-between">
//                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                              <span>Your Jettons</span>
//                              <span className="text-sm text-gray-400 font-normal">
//                                (Fungible Tokens)
//                              </span>
//                            </h2>
//                          </div>
//                          <p className="text-sm text-gray-400">
//                            Jettons are fungible tokens on TON, similar to ERC-20 tokens on Ethereum.
//                            Each Jetton represents a divisible and interchangeable digital asset.
//                          </p>
//                          <JettonList
//                            jettons={jettons}
//                            onSelect={setSelectedJetton}
//                            onImport={handleImportToken}
//                          />
//                        </div>
//                      ) : (
//                        <div className="space-y-4">
//                          <div className="flex items-center justify-between">
//                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
//                              <span>Your NFTs</span>
//                              <span className="text-sm text-gray-400 font-normal">
//                                (Non-Fungible Tokens)
//                              </span>
//                            </h2>
//                          </div>
//                          <p className="text-sm text-gray-400">
//                            NFTs are unique digital assets on TON. Each NFT is one-of-a-kind and 
//                            can represent artwork, collectibles, or other digital items.
//                          </p>
//                          {connectedAddress && (
//                            <NFTList address={connectedAddress} />
//                          )}
//                        </div>
//                      )}
//                    </div>
//                  </div>
//                </>
//              )}
//         </div>

//         {error && (
//           <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
//             <p className="text-red-400">{error}</p>
//           </div>
//         )}
        
//         {selectedJetton && connectedAddress && (
//           <SendJettonModal
//             senderAddress={connectedAddress}
//             jetton={selectedJetton}
//             onClose={() => setSelectedJetton(null)}
//           />
//         )}

//         {isSendModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setSendModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.95 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-[#1E1E1E] rounded-2xl max-w-md w-full overflow-hidden border border-gray-800 shadow-xl"
//             >
//               {/* Header */}
//               <div className="p-6 border-b border-gray-800">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
//                       <Send className="w-5 h-5 text-orange-500" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white">Send TON</h2>
//                       <p className="text-sm text-gray-400">
//                         Available: {tonBalance} TON
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setSendModalOpen(false)}
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <form onSubmit={async (e) => {
//                 e.preventDefault();
//                 const form = e.target as HTMLFormElement;
//                 const address = (form.elements.namedItem('address') as HTMLInputElement).value;
//                 const amount = (form.elements.namedItem('amount') as HTMLInputElement).value;
//                 await handleSendTon(address, amount);
//               }}>
//                 <div className="p-6 space-y-6">
//                   {error && (
//                     <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
//                       <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                       <p className="text-red-400 text-sm">{error}</p>
//                     </div>
//                   )}

//                   <div className="space-y-4">
//                     {/* Recipient Address Input */}
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">
//                         Recipient Address
//                       </label>
//                       <input
//                         name="address"
//                         type="text"
//                         placeholder="Enter TON address"
//                         className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
//                         required
//                       />
//                     </div>

//                     {/* Amount Input */}
//                     <div>
//                       <label className="block text-sm text-gray-400 mb-2">
//                         Amount
//                       </label>
//                       <div className="relative">
//                         <input
//                           name="amount"
//                           type="number"
//                           step="0.000000001" // Allow for 9 decimal places (TON's precision)
//                           min="0"
//                           placeholder="0.0"
//                           className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
//                           required
//                         />
//                         <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const input = document.querySelector('input[name="amount"]') as HTMLInputElement;
//                               input.value = tonBalance;
//                             }}
//                             className="text-sm text-orange-500 hover:text-orange-400"
//                           >
//                             MAX
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="p-6 border-t border-gray-800 bg-gray-900/50">
//                   <div className="flex space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setSendModalOpen(false)}
//                       className="flex-1 px-4 py-3 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
//                     >
//                       <Send className="w-4 h-4" />
//                       <span>Send TON</span>
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}

//         {isReceiveModalOpen && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-[#2c2d31] rounded-2xl p-6 max-w-md w-full mx-4">
//               <h3 className="text-xl font-bold text-white mb-4">Receive TON</h3>
//               {!connectedAddressString ? (
//                 <div className="text-center py-4">
//                   <p className="text-gray-400">Please connect your wallet first</p>
//                   <TonConnectButton className="mt-4" />
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm text-gray-400 mb-2">Your Wallet Address</label>
//                     <div className="relative group">
//                       <div className="flex items-center w-full px-4 py-3 bg-[#1a1b1e] border border-gray-700 hover:border-orange-500/50 rounded-xl transition-colors">
//                         <input
//                           type="text"
//                           value={connectedAddressString}
//                           readOnly
//                           className="w-full bg-transparent text-white font-mono text-sm outline-none"
//                         />
//                         <button
//                           onClick={handleCopyAddress}
//                           className="ml-2 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg text-orange-400 text-sm transition-all flex items-center gap-2 whitespace-nowrap"
//                         >
//                           {copySuccess ? (
//                             <>
//                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
//                               </svg>
//                               <span>Copied!</span>
//                             </>
//                           ) : (
//                             <>
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                               </svg>
//                               <span>Copy</span>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                       <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
//                     </div>
//                   </div>
                  
//                   {/* Optional: Add QR Code */}
//                   <div className="mt-4 p-4 bg-white rounded-xl flex justify-center">
//                     <img
//                       src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${connectedAddressString}`}
//                       alt="Wallet Address QR Code"
//                       className="w-32 h-32"
//                     />
//                   </div>

//                   <div className="mt-4">
//                     <p className="text-sm text-gray-400">
//                       Share this address to receive TON and other tokens in your wallet.
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setReceiveModalOpen(false)}
//                     className="w-full px-4 py-2 bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Updated Snackbar */}
//         {isSnackbarVisible && (
//           <Snackbar
//             onClose={() => setIsSnackbarVisible(false)}
//             duration={4000}
//             description={snackbarDescription}
//             after={<Button size="s" onClick={() => setIsSnackbarVisible(false)}>Close</Button>}
//             className="snackbar-top"
//           >
//             <div>
//               {snackbarMessage}
//             </div>
//           </Snackbar>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AirdropComponent;
