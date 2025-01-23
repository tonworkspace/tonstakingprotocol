import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Zap, RefreshCw, Users, Award } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getLeaderboard, getPlayerRank, getTotalPlayers } from '@/playerSupabase';
import type { ScorpionMiner } from '@/playerSupabase';

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

// Custom Progress Component
const Progress = ({ value = 0 }: { value?: number }) => (
  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
    <div 
      className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

const PlayerStats = React.memo(({ playerData, playerRank }: { 
  playerData: ScorpionMiner; 
  playerRank: number;
}) => {
  const formatScore = (score: number): string => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-100">Your Rank</div>
            <div className="text-white text-2xl font-bold mt-1">
              #{playerRank > 0 ? playerRank.toLocaleString() : '--'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-100">Your Score</div>
            <div className="text-white text-2xl font-bold mt-1">
              {formatScore(playerData.balance)} 🦂
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Progress value={(playerData.balance % 1000) / 10} />
          <div className="flex justify-between text-xs text-blue-100">
            <span>Level {playerData.miningLevel}</span>
            <span>Next: {formatScore(Math.ceil(playerData.balance / 1000) * 1000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced LeaderboardRow component
const LeaderboardRow = React.memo(({ player, index, isCurrentUser, topScore }: { 
  player: ScorpionMiner;
  index: number;
  isCurrentUser: boolean;
  topScore: number;
}) => {
  const percentageOfTop = ((player.balance / topScore) * 100).toFixed(1);
  
  return (
    <div className={`
      relative group px-2 sm:px-4 py-3 
      ${isCurrentUser ? 'bg-blue-500/10' : 'hover:bg-gray-800/50'}
      ${index === 0 ? 'bg-gradient-to-r from-amber-500/10 to-transparent' : ''}
      border-b border-gray-700/50 transition-all duration-200
    `}>
      <div className="relative flex items-center gap-2 sm:gap-4">
        {/* Rank - Simplified for mobile */}
        <div className="w-8 sm:w-12 flex-shrink-0 text-center">
          {index < 3 ? (
            <span className="text-lg">{['🥇', '🥈', '🥉'][index]}</span>
          ) : (
            <span className="text-gray-400 text-sm font-medium">#{index + 1}</span>
          )}
        </div>

        {/* Player Info - Responsive layout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <img
            src={player.photoUrl || 'https://xelene.me/telegram.gif'}
            alt={player.username}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-700/50"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white flex items-center gap-1 sm:gap-2">
              <span className="truncate text-sm sm:text-base">
                {player.username}
              </span>
              {player.miningLevel >= 10 && (
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-amber-400" />
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Level {player.miningLevel}
            </div>
          </div>
        </div>

        {/* Score - Compact for mobile */}
        <div className="text-right flex-shrink-0">
          <div className="font-medium text-white text-sm sm:text-base whitespace-nowrap">
            {player.balance.toLocaleString()} 🦂
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            {percentageOfTop}% of top
          </div>
        </div>
      </div>
    </div>
  );
});

// Add this new component for skeleton loading
const SkeletonLoader = () => (
  <>
    {/* Skeleton for Stats Card */}
    <div className="mt-4 p-4 rounded-2xl bg-[#151516] border border-[#222622] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-700/50" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-700/50 rounded" />
          <div className="h-3 w-32 bg-gray-700/50 rounded mt-2" />
        </div>
        <div className="text-right">
          <div className="h-4 w-20 bg-gray-700/50 rounded" />
          <div className="h-3 w-16 bg-gray-700/50 rounded mt-2" />
        </div>
      </div>
    </div>

    {/* Skeleton for Leaderboard Rows */}
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className={`p-4 border-b-[1px] border-[#222622] ${
          index === 0 ? 'bg-[#2d2b1b]/50' :
          index === 1 ? 'bg-[#272728]/50' :
          index === 2 ? 'bg-[#2d241b]/50' :
          'bg-[#151515]'
        } animate-pulse`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700/50" />
            <div>
              <div className="h-4 w-32 bg-gray-700/50 rounded" />
              <div className="h-3 w-24 bg-gray-700/50 rounded mt-2" />
            </div>
          </div>
          <div className="h-6 w-6 bg-gray-700/50 rounded" />
        </div>
      </div>
    ))}
  </>
);

const LeaderboardUI: React.FC = () => {
  const { user, playerData } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<ScorpionMiner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRank, setCurrentRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLeaderboard = useCallback(async () => {
    try {
      const [data, total] = await Promise.all([
        getLeaderboard(100),
        getTotalPlayers()
      ]);
      
      if (JSON.stringify(data) !== JSON.stringify(leaderboardData) || 
          new Date().getTime() - lastUpdate.getTime() > 300000) {
        const processedData = data.map(player => ({
          ...player,
          username: player.username || 'Anonymous',
          photoUrl: player.photoUrl || 'https://xelene.me/telegram.gif'
        })) as ScorpionMiner[];
        
        setLeaderboardData(processedData);
        setTotalPlayers(total);
        setLastUpdate(new Date());
      }

      if (user?.id) {
        const rank = await getPlayerRank(user.id);
        setCurrentRank(rank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, leaderboardData, lastUpdate]);

  useEffect(() => {
    fetchLeaderboard();
    // Increase interval to 2 minutes (120000ms)
    const interval = setInterval(fetchLeaderboard, 120000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const playerRank = useMemo(() => {
    if (currentRank !== null) {
      return currentRank;
    }
    const index = leaderboardData.findIndex(p => p.id === user?.id);
    return index !== -1 ? index + 1 : null;
  }, [currentRank, leaderboardData, user?.id]);

  const topPerformers = useMemo(() => {
    return leaderboardData
      .slice()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10); // Top 10 performers
  }, [leaderboardData]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">Compete with other miners to reach the top</p>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          {/* Player Stats Card */}
          {playerData && (
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-4">
              <PlayerStats playerData={playerData} playerRank={playerRank || 0} />
            </div>
          )}

          {/* Analytics Pills */}
          <div className="relative mb-4">
            <div className="overflow-x-auto hide-scrollbar-x">
              <div className="flex items-center bg-gray-800/30 rounded-full p-2 border border-gray-700/50 whitespace-nowrap min-w-fit">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Users className="text-blue-500 flex-shrink-0 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium text-blue-500">
                      {totalPlayers.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Total Stakers</div>
                  </div>
                </div>

                <div className="h-4 w-px bg-gray-700/50 mx-2 flex-shrink-0" />

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Award className="text-amber-500 flex-shrink-0 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium text-amber-500">
                      {topPerformers[0]?.balance.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-400">Top Share</div>
                  </div>
                </div>

                <div className="h-4 w-px bg-gray-700/50 mx-2 flex-shrink-0" />

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <RefreshCw className="text-green-500 flex-shrink-0 w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium text-green-500">
                      {formatTimeAgo(lastUpdate.getTime())}
                    </div>
                    <div className="text-xs text-gray-400">Last Update</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-[auto,1fr,auto] gap-4 px-6 py-4 bg-gray-800/50 border-b border-gray-700/50">
              <div className="text-sm font-medium text-gray-400 w-12">Rank</div>
              <div className="text-sm font-medium text-gray-400">Player</div>
              <div className="text-sm font-medium text-gray-400 text-right w-32">Score</div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {leaderboardData.map((player, index) => (
                <LeaderboardRow
                  key={player.id}
                  player={player}
                  index={index}
                  isCurrentUser={player.id === user?.id}
                  topScore={leaderboardData[0]?.balance || 0}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .hide-scrollbar-x {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }

        .hide-scrollbar-x::-webkit-scrollbar {
          display: none;
        }

        @media (hover: none) {
          .hide-scrollbar-x {
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
          }
          
          .hide-scrollbar-x > div {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardUI;