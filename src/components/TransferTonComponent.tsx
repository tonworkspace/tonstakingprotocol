import { useState } from "react";
import { Address, toNano } from "@ton/ton";
import { useTonConnect } from "../hooks/useTonConnect";

export function TransferTon() {
  const { sender, connected } = useTonConnect();

  const [tonAmount, setTonAmount] = useState("0.01");
  const [tonRecipient, setTonRecipient] = useState(
    "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Transfer TON</h3>
        
        <div className="flex items-center gap-2">
          <label>Amount </label>
          <input
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            value={tonAmount}
            onChange={(e) => setTonAmount(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label>To </label>
          <input
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tonRecipient}
            onChange={(e) => setTonRecipient(e.target.value)}
          />
        </div>

        <button
          disabled={!connected}
          className={`mt-4 px-4 py-2 rounded-md transition-colors ${
            connected 
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={async () => {
            sender.send({
              to: Address.parse(tonRecipient),
              value: toNano(tonAmount),
            });
          }}
        >
          Transfer
        </button>
      </div>
    </div>
  );
}
