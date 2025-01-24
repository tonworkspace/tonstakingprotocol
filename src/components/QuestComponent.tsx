import React, { useState, useMemo, useEffect } from 'react';
import { FaTelegramPlane, FaTwitter, FaFacebook, FaYoutube, FaInstagram, FaSpinner, FaExternalLinkAlt, FaTrophy, FaGamepad, FaShare, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Task, LevelInfo } from '@/gameData';

interface QuestComponentProps {
  balance: number;
  tasks: Task[];
  levelInfo: LevelInfo;
  handleTaskComplete: (taskId: string) => Promise<void>;
  isSnackbarVisible: boolean;
  setSnackbarVisible: (visible: boolean) => void;
  snackbarMessage: string;
  snackbarDescription: string;
  loadingTaskId: string | null;
  linkClicked: { [key: string]: boolean };
  taskVerified: { [key: string]: boolean };
  handleLinkClick: (taskId: string) => void;
  showSnackbar: (message: string, description: string) => void;
  verificationAttempts: number;
  isVerifying: {};
  resetTasks: () => void;
}

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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

const QuestComponent: React.FC<QuestComponentProps> = ({
  // balance,
  tasks,
  levelInfo,
  handleTaskComplete,
  loadingTaskId,
  linkClicked,
  handleLinkClick,
  showSnackbar,
  resetTasks
}) => {
  const [activeTab, setActiveTab] = useState('social');

  const filteredAndSortedTasks = useMemo(() => {
    // Update filtering logic for just social and completed
    let filtered;
    
    switch (activeTab) {
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'social':
      default:
        filtered = tasks.filter(task => !!task.platform && !task.completed);
        break;
    }
    
    // Sort tasks
    return filtered.sort((a, b) => {
      if (activeTab === 'completed') {
        return b.reward - a.reward;
      }
      
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      return b.reward - a.reward;
    });
  }, [tasks, activeTab]);

  // // Add stats for the tabs
  // const tabStats = useMemo(() => {
  //   let totalTasks = 0;
  //   let completedCount = 0;
  //   let availableRewards = 0;
  //   let claimedRewards = 0;
    
  //   switch (activeTab) {
  //     case 'completed':
  //       const completedTasks = tasks.filter(task => task.completed);
  //       totalTasks = completedTasks.length;
  //       completedCount = totalTasks;
  //       claimedRewards = completedTasks.reduce((sum, task) => sum + task.reward, 0);
  //       break;
  //     case 'social':
  //       const socialTasks = tasks.filter(task => !!task.platform);
  //       totalTasks = socialTasks.length;
  //       completedCount = socialTasks.filter(task => task.completed).length;
  //       availableRewards = socialTasks.filter(task => !task.completed).reduce((sum, task) => sum + task.reward, 0);
  //       claimedRewards = socialTasks.filter(task => task.completed).reduce((sum, task) => sum + task.reward, 0);
  //       break;
  //     case 'in-game':
  //     default:
  //       const inGameTasks = tasks.filter(task => !task.platform);
  //       totalTasks = inGameTasks.length;
  //       completedCount = inGameTasks.filter(task => task.completed).length;
  //       availableRewards = inGameTasks.filter(task => !task.completed).reduce((sum, task) => sum + task.reward, 0);
  //       claimedRewards = inGameTasks.filter(task => task.completed).reduce((sum, task) => sum + task.reward, 0);
  //       break;
  //   }

  //   return {
  //     availableRewards,
  //     completedCount,
  //     totalCount: totalTasks,
  //     claimedRewards
  //   };
  // }, [tasks, activeTab]);

  const renderTaskIcon = (platform?: string) => {
    switch (platform) {
      case 'Telegram': return <FaTelegramPlane className="text-2xl text-blue-500" />;
      case 'Twitter': return <FaTwitter className="text-2xl text-blue-400" />;
      case 'Facebook': return <FaFacebook className="text-2xl text-blue-700" />;
      case 'YouTube': return <FaYoutube className="text-2xl text-red-600" />;
      case 'Instagram': return <FaInstagram className="text-2xl text-pink-500" />;
      default: return <FaGamepad className="text-2xl text-yellow-500" />;
    }
  };

  const handleClaimRewardSimulator = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    // Check level requirement
    if (task && task.requiredLevel && levelInfo.level < task.requiredLevel) {
      showSnackbar(
        'Level requirement not met!', 
        `You need to be level ${task.requiredLevel} to claim this reward. Current level: ${levelInfo.level}`
      );
      return;
    }

    // Check if link needs to be clicked first
    if (!linkClicked[taskId]) {
      showSnackbar(
        'You have not clicked the link!', 
        "Don't be lazy, try again by clicking the link first."
      );
      return;
    }

    showSnackbar('Verifying task...', 'Please wait 1-2 minutes while we verify your task completion.');
    
    // Generate random delay between 1-2 minutes (60000-120000 milliseconds)
    const randomDelay = Math.floor(Math.random() * (120000 - 60000 + 1) + 60000);
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    await handleTaskComplete(taskId);
  };

  const renderTaskCard = (task: Task) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-300"
    >
      <div className="p-4">
        {/* Platform Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
            ${task.completed 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-gray-700/50 border border-gray-600/30'}`}
          >
            {renderTaskIcon(task.platform)}
          </div>
          <span className="text-sm font-medium text-gray-400">
            {task.platform}
          </span>
          <div className="flex-1" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-500/10 
            text-amber-400 text-sm font-medium border border-amber-500/20">
            <FaTrophy className="mr-1.5 text-xs" />
            {formatNumber(task.reward)}
          </span>
        </div>

        {/* Task Description */}
        <div className="mb-4">
          <p className="text-base text-white leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(task.id)}
            className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
              ${linkClicked[task.id] 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'}`}
          >
            {linkClicked[task.id] ? (
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-xs" />
                Visited
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaExternalLinkAlt className="text-xs" />
                Start Task
              </span>
            )}
          </a>

          <button
            disabled={task.completed || loadingTaskId === task.id || !linkClicked[task.id]}
            onClick={() => handleClaimRewardSimulator(task.id)}
            className={`flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
              ${task.completed 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : !linkClicked[task.id]
                  ? 'bg-gray-700/50 text-gray-400'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:brightness-110'}`}
          >
            {loadingTaskId === task.id ? (
              <FaSpinner className="animate-spin" />
            ) : task.completed ? (
              <span className="flex items-center gap-2">
                <FaCheckCircle />
                Done
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaClipboardCheck />
                Verify
              </span>
            )}
          </button>
        </div>

        {/* Completion Status */}
        {task.completed && task.updated_at && (
          <div className="mt-3 text-xs text-green-400 flex items-center gap-1.5">
            <FaCheckCircle className="text-xs" />
            Completed {formatTimeAgo(new Date(task.updated_at).getTime())}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Add task reset functionality
  useEffect(() => {
    const RESET_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    
    // Check if it's time to reset
    const checkAndResetTasks = () => {
      const lastResetTime = localStorage.getItem('lastTaskResetTime');
      const currentTime = Date.now();
      
      if (!lastResetTime || currentTime - parseInt(lastResetTime) >= RESET_INTERVAL) {
        resetTasks();
        localStorage.setItem('lastTaskResetTime', currentTime.toString());
        showSnackbar('Tasks Reset', 'Social tasks have been reset and are available again!');
      }
    };

    // Check on component mount
    checkAndResetTasks();

    // Set up interval for checking
    const intervalId = setInterval(checkAndResetTasks, 60000); // Check every minute

    // Calculate time until next reset
    const updateTimeUntilReset = () => {
      const lastResetTime = parseInt(localStorage.getItem('lastTaskResetTime') || Date.now().toString());
      const nextResetTime = lastResetTime + RESET_INTERVAL;
      const timeLeft = nextResetTime - Date.now();
      
      if (timeLeft <= 0) {
        checkAndResetTasks();
      }
    };

    const timeUpdateInterval = setInterval(updateTimeUntilReset, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timeUpdateInterval);
    };
  }, [resetTasks, showSnackbar]);

  return (
    <div className="quest-component p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header with Reset Timer */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Social Tasks</h1>
        <p className="text-gray-400">Complete social media tasks to earn Scorpion rewards</p>
      </div>

      {/* Simplified Tab Navigation */}
      <div className="bg-gray-800/50 rounded-xl mb-6 p-1.5">
        <div className="flex gap-2">
          {[
            { 
              id: 'social', 
              label: 'Available', 
              icon: FaShare,
              gradient: 'from-blue-500 to-blue-600',
              count: tasks.filter(task => !task.completed).length
            },
            { 
              id: 'completed', 
              label: 'Completed', 
              icon: FaCheckCircle,
              gradient: 'from-green-500 to-green-600',
              count: tasks.filter(task => task.completed).length
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 rounded-lg text-sm font-medium 
                transition-all duration-300 relative
                ${activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.gradient} text-white` 
                  : 'text-gray-400 hover:bg-gray-700/50'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10">
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-8 p-custom">
        {filteredAndSortedTasks.map(renderTaskCard)}
      </div>

      {/* Responsive Pill-style Rewards Summary */}
      <div className="relative">
        
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
    </div>
  );
};

export default QuestComponent;