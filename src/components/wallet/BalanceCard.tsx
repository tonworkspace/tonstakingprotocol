import { motion } from "framer-motion";

interface BalanceCardProps {
  title: string;
  icon: React.ReactNode;
  amount: number | string;
  symbol: string;
  isLoading: boolean;
  gradient: string;
  subtitle?: string;
}

export function BalanceCard({
  title,
  icon,
  amount,
  symbol,
  isLoading,
  gradient,
  subtitle
}: BalanceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${gradient} bg-opacity-10 rounded-2xl p-6 border border-white/10`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-white/10 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/60">{title}</h3>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse h-8 bg-white/10 rounded w-32" />
      ) : (
        <div className="text-2xl font-bold text-white">
          {typeof amount === 'number' 
            ? new Intl.NumberFormat().format(amount)
            : amount
          }
          <span className="text-sm ml-2 text-white/60">{symbol}</span>
        </div>
      )}
    </motion.div>
  );
} 