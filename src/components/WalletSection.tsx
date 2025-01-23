import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@telegram-apps/telegram-ui';
import { WalletIcon, Wallet2Icon, CoinsIcon } from 'lucide-react';

export type WalletType = 'SOL' | 'TON' | 'EVM';

interface WalletSectionProps {
  wallets?: { [key in WalletType]?: string };
  onSave: (type: WalletType, address: string) => Promise<void>;
  showSnackbar: (message: string, description: string) => void;
  className?: string;
}

export const walletConfigs = {
  SOL: {
    name: 'Solana',
    icon: <CoinsIcon className="w-4 h-4" />,
    pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    placeholder: 'Enter Solana wallet address (e.g., rYYoG...Zp6)',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50'
  },
  TON: {
    name: 'TON',
    icon: <Wallet2Icon className="w-4 h-4" />,
    pattern: /^UQ[A-Za-z0-9\-_]{46}$/,
    placeholder: 'Enter TON wallet address (e.g., UQCP06...mye2H)',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50'
  },
  EVM: {
    name: 'EVM',
    icon: <WalletIcon className="w-4 h-4" />,
    pattern: /^0x[a-fA-F0-9]{40}$/,
    placeholder: 'Enter EVM wallet address (e.g., 0x9774...F843)',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50'
  }
};

export const WalletSection: React.FC<WalletSectionProps> = ({ 
  wallets = {}, 
  onSave, 
  showSnackbar,
  className = ''
}) => {
  const [activeType, setActiveType] = useState<WalletType>('SOL');
  const [isEditing, setIsEditing] = useState<WalletType | null>(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAddress = (type: WalletType, address: string): boolean => {
    return walletConfigs[type].pattern.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    if (!validateAddress(isEditing, address)) {
      showSnackbar('Error', `Invalid ${walletConfigs[isEditing].name} address format`);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(isEditing, address);
      setIsEditing(null);
      setAddress('');
      showSnackbar('Success', `${walletConfigs[isEditing].name} wallet address saved!`);
    } catch (error) {
      showSnackbar('Error', 'Failed to save wallet address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={`mt-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-orange-700/50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <WalletIcon className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h4 className="text-white font-bold">Wallet Addresses</h4>
            <p className="text-sm text-gray-400">Connect your wallets to receive rewards</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {Object.entries(walletConfigs).map(([type, config]) => (
          <motion.button
            key={type}
            onClick={() => setActiveType(type as WalletType)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              activeType === type 
                ? `${config.bgColor} ${config.color}`
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {config.icon}
            <span>{config.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(walletConfigs).map(([type, config]) => (
          <AnimatePresence key={type} mode="wait">
            {activeType === type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <span className={`font-medium ${config.color}`}>{config.name}</span>
                  </div>
                  {wallets[type as WalletType] && !isEditing && (
                    <Button
                      size="s"
                      onClick={() => {
                        setIsEditing(type as WalletType);
                        setAddress(wallets[type as WalletType] || '');
                      }}
                      className={`${config.bgColor} ${config.color}`}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {isEditing === type ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={config.placeholder}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isLoading || !address}
                        className={`flex-1 ${config.bgColor} hover:opacity-90 disabled:opacity-50`}
                      >
                        {isLoading ? 'Saving...' : 'Save Address'}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setIsEditing(null);
                          setAddress('');
                        }}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : wallets[type as WalletType] ? (
                  <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                    <p className="text-gray-300 font-mono break-all">
                      {wallets[type as WalletType]}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(type as WalletType)}
                    className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                  >
                    + Add {config.name} Wallet
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </motion.div>
  );
}; 