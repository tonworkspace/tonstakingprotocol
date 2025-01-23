import React, { useState, useEffect } from 'react';
import ArrowBigRight from "@/icons/ArrowBigRight";
import { motion, AnimatePresence } from 'framer-motion';

interface CheckFootprintProps {
  user?: any;
  playerData?: any;
  showSnackbar?: (message: string, description: string) => void;
}

const newsItems = [
  {
    id: 1,
    text: "🎁 New Airdrop Coming Soon!",
    color: "#f48d2f",
    link: "https://t.me/scorpioncommunity_channel/65"
  },
  {
    id: 2,
    text: "🎁 Join the Scorpion World Trading Calls!",
    color: "#f48d2f",
    link: "https://t.me/scorpioncommunity_channel/71"
  },
  {
    id: 2,
    text: "🏆 Introducing SCORP the Web3 Token",
    color: "#10b981",
    link: "https://t.me/scorpioncommunity_channel/66"
  }
];

const CheckFootprint: React.FC<CheckFootprintProps> = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change news every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex justify-center w-full">
            <div className="w-full px-4 py-3 bg-[#151516] border border-orange-500/50  cursor-pointer rounded-xl mb-4">
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-between items-center pl-2"
                        style={{ borderLeft: `2px solid ${newsItems[currentIndex].color}` }}
                    >
                        <div className="flex items-center space-x-2">
                            <motion.div 
                                className="text-xs text-white font-medium"
                                animate={{ color: newsItems[currentIndex].color }}
                            >
                                <a href={newsItems[currentIndex].link} target="_blank" rel="noopener noreferrer">
                                    {newsItems[currentIndex].text}
                                </a>
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: newsItems[currentIndex].color }}
                            />
                        </div>
                        <button 
                            className="rounded-full px-2 py-1 transition-colors duration-200"
                            style={{ 
                                backgroundColor: newsItems[currentIndex].color,
                                opacity: 0.9
                            }}
                            onClick={() => {
                                setCurrentIndex((prevIndex) => 
                                    prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
                                );
                            }}
                        >
                             <a href={newsItems[currentIndex].link} target="_blank" rel="noopener noreferrer">
                             <ArrowBigRight className="w-5 h-5 text-white" />
                                </a>
                        </button>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default CheckFootprint;