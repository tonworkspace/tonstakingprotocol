import { useState, useEffect, useCallback } from 'react';
import { WalletType, WalletData, saveWalletAddress, getWalletAddresses } from '@/playerSupabase';

interface UseWalletsProps {
  userId: number;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export const useWallets = ({ userId, onError, onSuccess }: UseWalletsProps) => {
  const [wallets, setWallets] = useState<WalletData>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedWallets = await getWalletAddresses(userId);
      setWallets(savedWallets);
    } catch (error) {
      onError?.('Failed to load wallet addresses');
      console.error('Error loading wallets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onError]);

  const saveWallet = useCallback(async (type: WalletType, address: string) => {
    try {
      setIsLoading(true);
      await saveWalletAddress(userId, type, address);
      setWallets(prev => ({
        ...prev,
        [type]: address
      }));
      onSuccess?.(`${type} wallet address saved successfully!`);
    } catch (error) {
      onError?.('Failed to save wallet address');
      console.error('Error saving wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, onSuccess, onError]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets,
    isLoading,
    saveWallet,
    refreshWallets: loadWallets
  };
}; 