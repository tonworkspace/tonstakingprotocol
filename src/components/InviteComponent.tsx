import React, { useState, useEffect } from 'react';
import { Snackbar, } from '@telegram-apps/telegram-ui';
import { motion, } from 'framer-motion';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import { GiTrophyCup, GiStarsStack, GiLevelThree } from 'react-icons/gi';
import { getReferralLeaderboard, getAllReferrals } from '../playerSupabase';

interface Referral {
  id: string | number;
  username: string;
  is_premium?: boolean;
}

interface Tier {
  level: string;
  requirement: number;
}

interface InviteComponentProps {
  referralCount: number;
  referralLink: string | null;
  handleInviteFriend: () => void;
  loadingReferrals: boolean;
  referrals: Referral[];
}

interface LeaderboardEntry {
  username: string;
  referral_count: number;
}

const InviteComponent: React.FC<InviteComponentProps> = ({
  referralCount,
  referralLink,
  handleInviteFriend,
  referrals
}) => {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'leaderboard'>('invite');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [page] = useState(1);
  const itemsPerPage = 50;
  const [totalReferrals, setTotalReferrals] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getReferralLeaderboard(100);
      setLeaderboardData(data);
    };

    const fetchTotalReferrals = async () => {
      const total = await getAllReferrals();
      setTotalReferrals(total.length);
    };

    if (activeTab === 'leaderboard') {
      fetchLeaderboard();
      fetchTotalReferrals();
    }
  }, [activeTab]);

  const copyToClipboard = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setSnackbarMessage('Link copied to clipboard!');
      setIsSnackbarVisible(true);
    }
  };

  const getNextTier = () => {
    const tiers = [
      { requirement: 5, reward: '500 Bonus Scorpions', icon: <GiTrophyCup /> },
      { requirement: 10, reward: '1000 Bonus Scorpions', icon: <GiStarsStack /> },
      { requirement: 20, reward: '2000 Bonus Scorpions', icon: <GiLevelThree /> }
    ];
    return tiers.find(tier => tier.requirement > referralCount);
  };

  const getCurrentTier = () => {
    const tiers: Tier[] = [
      { level: 'Rookie', requirement: 0 },
      { level: 'Bronze', requirement: 5 },
      { level: 'Silver', requirement: 10 },
      { level: 'Gold', requirement: 20 },
      { level: 'Platinum', requirement: 50 },
      { level: 'Diamond', requirement: 100 }
    ];
    
    return tiers.reduce((prev, curr) => 
      referralCount >= curr.requirement ? curr : prev
    );
  };

  // Simplified header section
  return (
    <div className="bg-gray-900 p-custom rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'invite'
                ? 'bg-[#f48d2f] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Invite Friends
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#f48d2f] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Invite Friends Tab Content */}
        {activeTab === 'invite' ? (
          <>
            {/* Simple Header */}
            <div className="relative mb-8">
              {/* Decorative Background Elements */}
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              
              <div className="relative flex justify-between items-start">
                <div>
                  {/* Main Title with Enhanced Gradient */}
                  <h1 className="relative text-4xl font-extrabold mb-3">
                    <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 
                      bg-clip-text text-transparent drop-shadow-sm">
                      INVITE CENTER
                    </span>
                    <div className="absolute -top-1 -right-2 w-3 h-3 rounded-full 
                      bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" />
                  </h1>

                  {/* Subtitle with Enhanced Design */}
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 
                      bg-clip-text text-transparent">
                      REFER & EARN
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 font-medium">
                        INVITE FRIENDS TO EARN REWARDS
                      </span>
                      <div className="h-px flex-grow bg-gradient-to-r from-amber-500/50 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Decorative Icon */}
                <div className="hidden sm:block">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                    border border-gray-700/30 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 
                      flex items-center justify-center transform rotate-12">
                      <GiStarsStack className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl text-center"
              >
                <GiTrophyCup className="text-3xl mx-auto mb-2 text-yellow-300" />
                <p className="text-sm text-gray-200">Current Rank</p>
                <p className="text-xl font-bold text-white">{getCurrentTier()?.level || 'Rookie'}</p>
              </motion.div>
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-white mb-1">{referralCount}</p>
                <p className="text-sm text-gray-400">Friends Invited</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl text-center">
                <p className="text-3xl font-bold text-[#f48d2f] mb-1">{referralCount * 100}</p>
                <p className="text-sm text-gray-400">Scorpions Earned</p>
              </div>
            </div>

            {/* Current Progress */}
            <div className="bg-gray-800 p-4 rounded-xl mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Current Progress</span>
                <span className="text-[#f48d2f]">
                  {getNextTier()?.reward ?? 'Max Level'}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <motion.div
                  className="bg-[#f48d2f] h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((referralCount / (getNextTier()?.requirement ?? referralCount)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">
                {referralCount} / {getNextTier()?.requirement ?? 'MAX'} referrals needed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInviteFriend}
                className="flex-1 py-3 bg-[#f48d2f] text-white font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <FaShareAlt /> Invite Friend
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className="flex-1 py-3 bg-gray-800 text-white font-medium rounded-xl flex items-center justify-center gap-2"
              >
                <FaCopy /> Copy Link
              </motion.button>
            </div>

            {/* Simplified Tier Display */}
            {getNextTier() && (
              <div className="bg-gray-800 p-4 rounded-xl mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getNextTier()?.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">Next Reward</h3>
                    <p className="text-[#f48d2f]">{getNextTier()?.reward}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {(() => {
                        const nextTier = getNextTier();
                        return `Invite ${nextTier?.requirement ? nextTier.requirement - referralCount : 0} more friends`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Referral List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 mt-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f48d2f]/20 p-2 rounded-lg">
                    <GiStarsStack className="text-[#f48d2f] text-xl" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Your Referrals</h3>
                </div>
                <span className="text-sm text-gray-400">
                  Total: {referrals.length}
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {referrals.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="text-gray-600 text-6xl mb-4"
                    >
                      👥
                    </motion.div>
                    <p className="text-gray-400 mb-2">No referrals yet</p>
                    <p className="text-sm text-gray-500">Share your link to start earning rewards!</p>
                  </motion.div>
                ) : (
                  [...referrals].reverse().map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group flex justify-between items-center p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 hover:border-[#f48d2f]/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white group-hover:bg-[#f48d2f]/20 transition-colors">
                          {referral.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white font-medium group-hover:text-[#f48d2f] transition-colors">
                            {referral.username}
                          </span>
                          {referral.is_premium && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full inline-flex items-center gap-1"
                            >
                              ⭐ PREMIUM
                            </motion.span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-[#f48d2f]/10 px-4 py-2 rounded-full"
                        >
                          <span className="text-[#f48d2f] font-bold">
                            +{referral.is_premium ? '400' : '150'}
                          </span>
                          {referral.is_premium && (
                            <span className="ml-1 text-xs text-[#f48d2f]/70">(+250 bonus)</span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        ) : (
          /* Leaderboard Tab Content */
          <div className="space-y-6">
            {/* Stats Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-4 rounded-xl text-center">
                <GiTrophyCup className="text-4xl mx-auto mb-2 text-white" />
                <p className="text-white font-bold">{leaderboardData[0]?.username || 'No Leader'}</p>
                <p className="text-sm text-white/80">Top Referrer</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl text-center">
                <GiStarsStack className="text-4xl mx-auto mb-2 text-white" />
                <p className="text-white font-bold">{totalReferrals}</p>
                <p className="text-sm text-white/80">Total Referrals</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl text-center">
                <GiLevelThree className="text-4xl mx-auto mb-2 text-white" />
                <p className="text-white font-bold">{leaderboardData.length}</p>
                <p className="text-sm text-white/80">Active Referrers</p>
              </div>
            </motion.div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                <GiTrophyCup className="text-[#f48d2f]" /> Top Referrers
              </h3>
              <div className="space-y-4">
                {leaderboardData
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((entry, index) => (
                    <motion.div
                      key={entry.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/20' :
                        index === 1 ? 'bg-gradient-to-r from-gray-500/20 to-gray-400/20 border border-gray-400/20' :
                        index === 2 ? 'bg-gradient-to-r from-amber-700/20 to-amber-600/20 border border-amber-600/20' :
                        'bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Enhanced Position Badge */}
                        {index < 3 ? (
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                              'bg-gradient-to-br from-amber-500 to-amber-700'
                            }`}
                          >
                            <span className="font-bold text-gray-900">#{index + 1}</span>
                          </motion.div>
                        ) : (
                          <span className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium">
                            #{index + 1}
                          </span>
                        )}
                        
                        {/* Enhanced Username Display */}
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{entry.username}</span>
                          {index < 3 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`text-lg ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' :
                                'text-amber-600'
                              }`}
                            >
                              {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                            </motion.span>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Points Display */}
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span className="text-[#f48d2f] font-medium">
                            {entry.referral_count * 100}
                          </span>
                          <span className="text-sm text-gray-400">⭐</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                  
                {/* Enhanced Empty State */}
                {leaderboardData.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 10, 0],
                        y: [0, -5, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <GiTrophyCup className="text-6xl text-gray-600 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-400 text-lg mb-2">No referrals yet</p>
                    <p className="text-sm text-gray-500">Be the first to invite friends and claim the crown! 👑</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Snackbar remains outside tabs */}
        {isSnackbarVisible && (
          <Snackbar
            onClose={() => setIsSnackbarVisible(false)}
            duration={3000}
            description={snackbarMessage}
          />
        )}
      </motion.div>
    </div>
  );
};

export default InviteComponent;