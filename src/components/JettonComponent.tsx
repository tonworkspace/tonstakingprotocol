import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";

export function Jetton() {
  const { connected } = useTonConnect();
  const { mint, jettonWalletAddress, balance } = useFaucetJettonContract();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Faucet Jetton</h3>
        
        <div className="flex justify-between items-center">
          <span>Wallet</span>
          <span className="truncate max-w-[200px]">{jettonWalletAddress}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Balance</span>
          <div>{balance ?? "Loading..."}</div>
        </div>

        <button
          disabled={!connected}
          onClick={async () => {
            mint();
          }}
          className={`px-4 py-2 rounded-md transition-colors ${
            connected 
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Get jettons from faucet
        </button>
      </div>
    </div>
  );
}
