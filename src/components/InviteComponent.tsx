import React, { useState, useEffect } from 'react';
import { Snackbar, } from '@telegram-apps/telegram-ui';
import { motion, } from 'framer-motion';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import { GiTrophyCup, GiStarsStack, GiLevelThree } from 'react-icons/gi';
import { getReferralLeaderboard, getAllReferrals } from '../playerSupabase';
import useAuth from '@/hooks/useAuth';

interface Referral {
  id: string | number;
  username: string;
  is_premium?: boolean;
}

interface Tier {
  level: string;
  requirement: number;
  referralBonuses: {
    level: number;
    percentage: number;
  }[];
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
  const { user } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'leaderboard'>('invite');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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
      { 
        requirement: 5, 
        reward: 'Bronze Tier Unlocked', 
        icon: <GiTrophyCup />,
        benefits: '2 Level Referral System'
      },
      { 
        requirement: 10, 
        reward: 'Silver Tier Unlocked', 
        icon: <GiStarsStack />,
        benefits: '3 Level Referral System'
      },
      { 
        requirement: 20, 
        reward: 'Gold Tier Unlocked', 
        icon: <GiLevelThree />,
        benefits: '4 Level Referral System'
      },
      { 
        requirement: 50, 
        reward: 'Platinum Tier Unlocked', 
        icon: <GiTrophyCup />,
        benefits: '5 Level Referral System'
      },
      { 
        requirement: 100, 
        reward: 'Diamond Tier Unlocked', 
        icon: <GiStarsStack />,
        benefits: 'Maximum Rewards Unlocked'
      }
    ];
    return tiers.find(tier => tier.requirement > referralCount);
  };

  const getCurrentTier = () => {
    const tiers: Tier[] = [
      { 
        level: 'Rookie', 
        requirement: 0,
        referralBonuses: [
          { level: 1, percentage: 3 },
        ]
      },
      { 
        level: 'Bronze', 
        requirement: 5,
        referralBonuses: [
          { level: 1, percentage: 4 },
          { level: 2, percentage: 1 },
        ]
      },
      { 
        level: 'Silver', 
        requirement: 10,
        referralBonuses: [
          { level: 1, percentage: 5 },
          { level: 2, percentage: 2 },
          { level: 3, percentage: 0.5 },
        ]
      },
      { 
        level: 'Gold', 
        requirement: 20,
        referralBonuses: [
          { level: 1, percentage: 6 },
          { level: 2, percentage: 2.5 },
          { level: 3, percentage: 1 },
          { level: 4, percentage: 0.5 },
        ]
      },
      { 
        level: 'Platinum', 
        requirement: 50,
        referralBonuses: [
          { level: 1, percentage: 7 },
          { level: 2, percentage: 3 },
          { level: 3, percentage: 1.5 },
          { level: 4, percentage: 0.75 },
          { level: 5, percentage: 0.25 },
        ]
      },
      { 
        level: 'Diamond', 
        requirement: 100,
        referralBonuses: [
          { level: 1, percentage: 8 },
          { level: 2, percentage: 4 },
          { level: 3, percentage: 2 },
          { level: 4, percentage: 1 },
          { level: 5, percentage: 0.5 },
        ]
      }
    ];
    
    return tiers.reduce((prev, curr) => 
      referralCount >= curr.requirement ? curr : prev
    );
  };

  const ReferralBonusCard = ({ tier }: { tier: Tier }) => (
    <div className="bg-gray-100/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100/10 rounded-lg">
            <GiTrophyCup className="text-amber-400 text-xl" />
          </div>
          <span className="text-white font-medium">Referral Bonuses</span>
        </div>
        <span className="text-sm text-amber-400 font-medium">{tier.level}</span>
      </div>

      <div className="space-y-3">
        {tier.referralBonuses.map((bonus) => (
          <div 
            key={bonus.level}
            className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-gray-400">L{bonus.level}</span>
              </div>
              <span className="text-white">Level {bonus.level} Referral</span>
            </div>
            <span className="text-blue-400 font-medium">
              {bonus.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-400">
          Earn bonuses from up to {tier.referralBonuses.length} levels of referrals. 
          Higher tiers unlock more levels and better rewards!
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Tab Navigation */}
      <div className="bg-gray-800/50 rounded-xl mb-6 p-1.5">
        <div className="flex gap-2">
          {[
            { 
              id: 'invite', 
              label: 'Invite Friends', 
              icon: FaShareAlt,
              gradient: 'from-blue-500 to-blue-600',
            },
            { 
              id: 'leaderboard', 
              label: 'Leaderboard', 
              icon: GiTrophyCup,
              gradient: 'from-amber-500 to-amber-600',
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'invite' | 'leaderboard')}
              className={`
                flex-1 px-4 py-3 rounded-lg text-sm font-medium 
                transition-all duration-300
                ${activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white` 
                  : 'text-gray-400 hover:bg-gray-700/50'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'invite' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Current Rank</span>
                <span className="text-white font-medium mt-1">{getCurrentTier()?.level || 'Rookie'}</span>
              </div>
            </div>
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Friends Invited</span>
                <span className="text-white font-medium mt-1">{referralCount}</span>
              </div>
            </div>
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Rewards Earned</span>
                <span className="text-white font-medium mt-1">{referralCount * 100} 🦂</span>
              </div>
            </div>
          </div>

          {/* Add Referral Bonus Card after stats */}
          <ReferralBonusCard tier={getCurrentTier()} />

          {/* Progress Card */}
          <div className="bg-gray-100/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Progress to Next Tier</span>
              <span className="text-blue-400 text-sm font-medium">
                {getNextTier()?.reward ?? 'Max Level'}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((referralCount / (getNextTier()?.requirement ?? referralCount)) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {referralCount} / {getNextTier()?.requirement ?? 'MAX'} referrals needed
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleInviteFriend}
              className="bg-blue-500 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <FaShareAlt className="text-sm" />
              Invite Friend
            </button>
            <button
              onClick={copyToClipboard}
              className="bg-gray-100/5 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <FaCopy className="text-sm" />
              Copy Link
            </button>
          </div>

          {/* Next Reward Card */}
          {getNextTier() && (
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100/10 rounded-lg text-2xl">
                  {getNextTier()?.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">Next Reward</h3>
                  <p className="text-blue-400 text-sm mt-1">{getNextTier()?.reward}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(() => {
                      const nextTier = getNextTier();
                      return `Invite ${nextTier?.requirement ? nextTier.requirement - referralCount : 0} more friends`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Referrals List */}
          <div className="bg-gray-100/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100/10 rounded-lg">
                  <GiStarsStack className="text-blue-400 text-xl" />
                </div>
                <span className="text-white font-medium">Your Referrals</span>
              </div>
              <span className="text-sm text-gray-400">Total: {referrals.length}</span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {referrals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <p className="text-gray-400 mb-2">No referrals yet</p>
                  <p className="text-sm text-gray-500">Share your link to start earning rewards!</p>
                </div>
              ) : (
                [...referrals].reverse().map((referral) => (
                  <div
                    key={referral.id}
                    className="flex justify-between items-center p-4 bg-gray-100/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100/10 rounded-full flex items-center justify-center text-white">
                        {referral.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white font-medium">{referral.username}</span>
                        {referral.is_premium && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                            PREMIUM
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-blue-400 font-medium">
                      +{referral.is_premium ? '400' : '150'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {/* Leaderboard Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Total Referrals</span>
                <span className="text-white font-medium mt-1">{totalReferrals}</span>
              </div>
            </div>
            <div className="bg-gray-100/5 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">Your Position</span>
                <span className="text-white font-medium mt-1">
                  #{leaderboardData.findIndex(entry => entry.username === user?.username) + 1 || '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="bg-gray-100/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100/10 rounded-lg">
                  <GiTrophyCup className="text-amber-400 text-xl" />
                </div>
                <span className="text-white font-medium">Top Referrers</span>
              </div>
            </div>

            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.username}
                  className="flex justify-between items-center p-4 bg-gray-100/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center">
                      {index < 3 ? (
                        <span className="text-lg">
                          {['🥇', '🥈', '🥉'][index]}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100/10 rounded-full flex items-center justify-center text-white">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">
                        {entry.username}
                      </span>
                    </div>
                  </div>
                  <div className="text-blue-400 font-medium">
                    {entry.referral_count} refs
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {isSnackbarVisible && (
        <Snackbar
          onClose={() => setIsSnackbarVisible(false)}
          duration={3000}
          description={snackbarMessage}
        />
      )}
    </div>
  );
};

export default InviteComponent;