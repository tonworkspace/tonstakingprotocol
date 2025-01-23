interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Understanding Your Assets</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-2">Tokens (Jettons)</h4>
            <p className="text-gray-400">
              Tokens are fungible digital assets that can be traded. Each token has the same value
              as another token of the same type.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-2">NFTs</h4>
            <p className="text-gray-400">
              NFTs (Non-Fungible Tokens) are unique digital assets. Each NFT is one-of-a-kind
              and can represent artwork, collectibles, or other digital items.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-blue-500/30 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
} 