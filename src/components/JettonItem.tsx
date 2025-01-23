import { JettonBalance } from "@ton-api/client";
import { toDecimals } from "../utility/decimals";

interface JettonItemProps {
  jettonBalance: JettonBalance;
  onSelect: (jetton: JettonBalance) => void;
  isImported?: boolean;
}

export const JettonItem = ({ jettonBalance, onSelect, isImported }: JettonItemProps) => {
  const { jetton, balance, jetton: { decimals } } = jettonBalance;

  const handleClick = () => {
    onSelect(jettonBalance);
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 hover:bg-[#1a2235] rounded-2xl transition-all duration-200 bg-[#1e2738]/50 backdrop-blur-sm border border-gray-800/50"
    >
      <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center ring-2 ring-gray-700/50 flex-shrink-0">
          {jetton.image ? (
            <img 
              src={jetton.image} 
              alt={jetton.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/48/1e2738/ffffff?text=${jetton.symbol?.[0] || '?'}`
              }}
            />
          ) : (
            <span className="text-base sm:text-lg font-bold text-white/90 tracking-wider">
              {jetton.symbol?.[0]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <p className="text-white font-semibold tracking-wide truncate">
              {jetton.name}
            </p>
            <span className="text-xs px-2 py-0.5 bg-gray-800/50 rounded-full text-gray-400 font-medium">
              {jetton.symbol}
            </span>
            {isImported && (
              <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full font-medium border border-blue-500/20">
                Imported
              </span>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <p className="text-gray-300 font-medium">
              {toDecimals(balance, decimals)}
            </p>
            <span className="text-gray-500 text-sm">
              ≈ $0.00
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-4 sm:mt-0 w-full sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
        <button
          className="flex-1 sm:flex-none text-gray-400 hover:text-white p-2.5 rounded-xl transition-colors hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          onClick={() => {/* Add receive functionality */}}
          aria-label="Receive tokens"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>
        <button
          className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <span>Send</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};