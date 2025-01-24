import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Zap, RefreshCw, ArrowUp, Percent, Users, Award } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { getLeaderboard, getPlayerRank, getTotalPlayers } from '@/playerSupabase';
import type { ScorpionMiner } from '@/playerSupabase';
import NewsShoutbox from './SpecialEventsComponent';


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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 mb-6 shadow-lg">
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

// Add new analytics component
const LeaderboardAnalytics = ({ totalPlayers, topPerformers }: {
  totalPlayers: number;
  topPerformers: ScorpionMiner[];
}) => {
  const getTopPlayerStats = () => {
    if (topPerformers.length < 3) return null;
    
    const top1Score = topPerformers[0].balance;
    const top2Score = topPerformers[1].balance;
    const percentageDiff = ((top1Score - top2Score) / top2Score) * 100;

    return {
      leadDifference: percentageDiff.toFixed(1),
      topScore: top1Score.toLocaleString(),
      averageScore: (topPerformers.slice(0, 10)
        .reduce((acc, player) => acc + player.balance, 0) / 10).toLocaleString()
    };
  };

  const stats = getTopPlayerStats();

  return (
    <div className="grid grid-cols-3 gap-2 mb-4 px-2">
      <div className="bg-gray-800/40 rounded-lg p-2.5 border border-gray-700/30">
        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
          <Users className="w-3 h-3" />
          <span className="text-xs">Miners</span>
        </div>
        <div className="text-sm font-semibold text-white">
          {totalPlayers.toLocaleString()}
        </div>
      </div>

      <div className="bg-gray-800/40 rounded-lg p-2.5 border border-gray-700/30">
        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
          <Award className="w-3 h-3" />
          <span className="text-xs">Top</span>
        </div>
        <div className="text-sm font-semibold text-white">
          {stats?.topScore || '0'} 🦂
        </div>
      </div>

      <div className="bg-gray-800/40 rounded-lg p-2.5 border border-gray-700/30">
        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
          <Percent className="w-3 h-3" />
          <span className="text-xs">Lead</span>
        </div>
        <div className="text-sm font-semibold text-white flex items-center gap-1">
          {stats?.leadDifference || '0'}%
          <ArrowUp className="w-3 h-3 text-green-400" />
        </div>
      </div>
    </div>
  );
};

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
    <div className="w-full max-w-4xl mx-auto bg-gray-900/95 p-custom sm:p-6 rounded-2xl shadow-2xl border border-gray-800/50">
      {/* Enhanced Header */}
      <div className="relative mb-8">
        {/* Decorative Background Elements */}
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative flex justify-between items-start">
          <div>
            {/* Main Title with Enhanced Gradient */}
            <h1 className="relative text-4xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-purple-600 
                bg-clip-text text-transparent drop-shadow-sm">
                GLOBAL RANKINGS
              </span>
              <div className="absolute -top-1 -right-2 w-3 h-3 rounded-full 
                bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse" />
            </h1>

            {/* Subtitle with Enhanced Design */}
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 
                bg-clip-text text-transparent">
                TOP MINERS
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-400 font-medium">
                  COMPETING WORLDWIDE
                </span>
                <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>
            </div>
          </div>

          {/* Refresh Button with Enhanced Styling */}
          <button 
            onClick={fetchLeaderboard}
            className="relative group p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
              border border-gray-700/30 backdrop-blur-sm transition-all duration-300
              hover:from-gray-700/50 hover:to-gray-800/50 hover:border-gray-600/30"
          >
            <RefreshCw className="w-5 h-5 text-blue-400 group-hover:text-blue-300 
              transition-all duration-300 group-hover:rotate-180" />
            <div className="absolute inset-0 bg-blue-400/10 rounded-xl opacity-0 
              group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <LeaderboardAnalytics 
            totalPlayers={totalPlayers} 
            topPerformers={topPerformers}
          />
          
          {user && playerData && (
            <div className="px-2 sm:px-0">
              <PlayerStats 
                playerData={playerData} 
                playerRank={playerRank || 0}
              />
            </div>
          )}
          <NewsShoutbox/>
          <div className="rounded-xl border border-gray-700/50 overflow-hidden">
            {/* Optional: Add table headers for larger screens */}
            <div className="hidden sm:grid grid-cols-[auto,1fr,auto] gap-4 px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
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
    </div>
  );
};

export default LeaderboardUI;