import { premiumScorpion, scorp, scorpion } from "@/images";

export interface SkinConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardMultiplier: number;
  animation?: {
    scale?: number[];
    rotate?: number[];
    duration?: number;
    glow?: string;
  };
}

export const SKINS: SkinConfig[] = [
  {
    id: 'default',
    name: 'Classic Scorpion',
    description: 'The original scorpion',
    price: 0,
    image: scorpion,
    rarity: 'common',
    rewardMultiplier: 2,
    animation: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      duration: 0.5,
    }
  },
  {
    id: 'golden',
    name: 'Golden Scorpion',
    description: 'A majestic golden scorpion',
    price: 10000,
    image: scorp,
    rarity: 'rare',
    rewardMultiplier: 25,
    animation: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      duration: 0.7,
      glow: '#FFD700'
    }
  },
  {
    id: 'premium',
    name: 'Premium Crystal Scorpion',
    description: 'A mystical scorpion forged from pure gold nuggets',
    price: 25000,
    image: premiumScorpion,
    rarity: 'epic',
    rewardMultiplier: 50,
    animation: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, -15, 0],
      duration: 1,
      glow: '#00FFFF'
    }
  },
  // Add more skins...
]; 