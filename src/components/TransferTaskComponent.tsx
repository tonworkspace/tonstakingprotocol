import { useState } from "react";
import { Address, toNano } from "@ton/ton";
import { useTonConnect } from "../hooks/useTonConnect";

export function TransferTask() {
  const { sender, connected } = useTonConnect();
  const [tonAmount, setTonAmount] = useState("0.1");
  const [tonRecipient, setTonRecipient] = useState(
    "EQB9xp1OiZ7F30aaAhdzEJaS4Ac6DGM0aMH4u6VrtVyitlHD"
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-[#2c2d31] rounded-2xl p-6 border border-gray-800">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">🎯 First Transfer Challenge</h2>
            <p className="text-gray-400">Complete your first on-chain transfer to unlock achievements</p>
          </div>

          <div className="bg-[#1a1b1f] p-4 rounded-lg border border-gray-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 min-w-[80px]">Amount:</span>
                <input
                  type="number"
                  className="flex-1 bg-[#2c2d31] border border-gray-700 rounded-lg px-3 py-2 text-white"
                  value={tonAmount}
                  onChange={(e) => setTonAmount(e.target.value)}
                />
                <span className="text-gray-400">TON</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 min-w-[80px]">To:</span>
                <input
                  className="flex-1 bg-[#2c2d31] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                  value={tonRecipient}
                  onChange={(e) => setTonRecipient(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1b1f] p-4 rounded-lg border border-gray-800">
            <h3 className="text-white font-semibold mb-2">Task Requirements:</h3>
            <ul className="text-gray-400 space-y-2 ml-4">
              <li className="flex items-center gap-2">
                <span className="text-[#f48d2f]">•</span> Send exactly 0.1 TON
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#f48d2f]">•</span> To the specified address
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#f48d2f]">•</span> Confirm the transaction in your wallet
              </li>
            </ul>
          </div>

          <button
            disabled={!connected}
            onClick={async () => {
              sender.send({
                to: Address.parse(tonRecipient),
                value: toNano(tonAmount),
              });
            }}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              connected
                ? "bg-gradient-to-r from-[#f48d2f] to-[#fd744d] text-white hover:opacity-90"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {connected ? "Complete Transfer Task" : "Connect Wallet to Start"}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Complete this task to earn your first on-chain achievement!
          </p>
        </div>
      </div>
    </div>
  );
} 