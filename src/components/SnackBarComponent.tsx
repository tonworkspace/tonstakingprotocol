import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error' | 'info'; // Add types for different styles
  duration?: number; // Optional custom duration
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isVisible,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaCheckCircle className="text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 space-x-3"
        >
          {getIcon()}
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="text-white">
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Snackbar;
