import React, { createContext, useContext } from 'react';
import { WalletType, WalletData } from '@/playerSupabase';
import { useWallets } from '@/hooks/useWallets';

interface WalletContextType {
  wallets: WalletData;
  isLoading: boolean;
  saveWallet: (type: WalletType, address: string) => Promise<void>;
  refreshWallets: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{
  children: React.ReactNode;
  userId: number;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}> = ({ children, userId, onError, onSuccess }) => {
  const walletState = useWallets({ userId, onError, onSuccess });

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}; 