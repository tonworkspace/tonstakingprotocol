import React, { useState, useEffect } from 'react';
import { Button, Input } from '@telegram-apps/telegram-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaChartLine, FaCalendarAlt, FaPercent } from 'react-icons/fa';

interface StakingSimulatorProps {
  balance: number;
  stakedAmount: number;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
}

const StakingSimulator: React.FC<StakingSimulatorProps> = ({ balance, stakedAmount, onStake, onUnstake }) => {
  const [amount, setAmount] = useState<string>('');
  const [daysStaked, setDaysStaked] = useState<number>(0);
  const [dailyEarningRate, setDailyEarningRate] = useState<number>(0.01);
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stakedAmount > 0) {
        setDaysStaked(prev => prev + 1);
        const newEarnings = stakedAmount * dailyEarningRate;
        setEarnings(prev => prev + newEarnings);

        if (daysStaked % 5 === 0 && dailyEarningRate < 0.04) {
          setDailyEarningRate(prev => Math.min(prev + 0.005, 0.04));
        }
      }
    }, 86400000);

    return () => clearInterval(interval);
  }, [stakedAmount, daysStaked, dailyEarningRate]);

  const handleStake = () => {
    const stakeAmount = parseFloat(amount);
    if (stakeAmount >= 1 && stakeAmount <= balance) {
      onStake(stakeAmount);
      setAmount('');
      if (stakeAmount >= stakedAmount) {
        setDaysStaked(0);
        setDailyEarningRate(0.01);
      }
    }
  };

  const handleUnstake = () => {
    const unstakeAmount = parseFloat(amount);
    if (unstakeAmount > 0 && unstakeAmount <= stakedAmount) {
      onUnstake(unstakeAmount);
      setAmount('');
      if (unstakeAmount === stakedAmount) {
        setDaysStaked(0);
        setDailyEarningRate(0.01);
      }
    }
  };

  const progressPercentage = (stakedAmount / (balance + stakedAmount)) * 100;

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
        TON Staking Arena
      </h2>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-pink-300 font-semibold">Staked TON</span>
          <span className="text-yellow-300 font-bold">{stakedAmount.toFixed(2)} / {(balance + stakedAmount).toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {[
          { icon: FaCalendarAlt, label: "Days Staked", value: daysStaked, color: "text-yellow-400" },
          { icon: FaPercent, label: "Daily Rate", value: `${(dailyEarningRate * 100).toFixed(2)}%`, color: "text-green-400" },
          { icon: FaCoins, label: "Total Earnings", value: `${earnings.toFixed(2)} TON`, color: "text-purple-400" },
          { icon: FaChartLine, label: "Available Balance", value: `${balance.toFixed(2)} TON`, color: "text-blue-400" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 bg-opacity-50 p-6 rounded-2xl backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <item.icon className={`text-3xl ${item.color} mb-2`} />
            <p className="text-gray-400 mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter TON amount (min 1 TON)"
        className="mb-6 w-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-500 rounded-xl p-4 focus:ring-2 focus:ring-pink-500"
      />

      <div className="flex space-x-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Button
              onClick={handleStake}
              disabled={parseFloat(amount) < 1 || parseFloat(amount) > balance}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stake TON
            </Button>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Button
              onClick={handleUnstake}
              disabled={parseFloat(amount) > stakedAmount}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unstake TON
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StakingSimulator;

