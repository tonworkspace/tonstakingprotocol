export interface StakingTier {
  name: string;
  minDeposit: number;
  dailyROI: number;
  duration: number;
}

export interface ReferralTier {
  level: number;
  percentage: number;
}

export interface RankingTier {
  name: string;
  requiredTeamVolume: number;
  requiredDeposit: number;
  requiredDirects: number;
  weeklyReward: number;
}

export interface StakingStats {
  totalStaked: number;
  currentROI: number;
  stakingStartTime: number;
  lastClaimTime: number;
  stakingDuration: number;
  referralCount: number;
  teamVolume: number;
  currentRank: string;
  referralEarnings: number;
  totalEarnings: number;
  rewardsDistribution: {
    wallet: number;
    restake: number;
    sbt: number;
  };
} 