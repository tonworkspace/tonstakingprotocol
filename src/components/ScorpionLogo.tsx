import { motion } from 'framer-motion';

const ScorpionLogo = () => {
  return (
    <motion.div
      className="flex justify-center items-center"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg className="w-32 h-32 md:w-48 md:h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body - with gradient fill */}
        <motion.path
          d="M30 50C30 45 35 40 40 40C45 40 48 42 50 45C52 42 55 40 60 40C65 40 70 45 70 50C70 60 60 70 50 70C40 70 30 60 30 50Z"
          fill="url(#scorpionGradient)"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Tail - with same gradient */}
        <motion.path
          d="M50 70C50 70 45 75 45 80C45 85 50 90 50 90C50 90 55 85 55 80C55 75 50 70 50 70Z"
          fill="url(#scorpionGradient)"
          initial={{ rotate: -3 }}
          animate={{ rotate: 3 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Claws - with same gradient */}
        <motion.path
          d="M25 45C20 45 15 50 15 55C15 60 20 62 25 60C30 58 30 50 25 45Z"
          fill="url(#scorpionGradient)"
          initial={{ rotate: -3 }}
          animate={{ rotate: 3 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M75 45C80 45 85 50 85 55C85 60 80 62 75 60C70 58 70 50 75 45Z"
          fill="url(#scorpionGradient)"
          initial={{ rotate: 3 }}
          animate={{ rotate: -3 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Eyes - with glow effect */}
        <circle cx="43" cy="45" r="2" fill="#ffffff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="57" cy="45" r="2" fill="#ffffff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Stinger - with bright red glow */}
        <motion.path
          d="M50 90L48 95L50 98L52 95L50 90"
          fill="#ff4444"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          style={{ filter: 'drop-shadow(0 0 2px #ff0000)' }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="scorpionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f97316' }} />
            <stop offset="100%" style={{ stopColor: '#ea580c' }} />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default ScorpionLogo; 