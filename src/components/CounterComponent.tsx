import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

export function Counter() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className="container mx-auto p-4">
      <TonConnectButton />

      <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold">Counter</h3>
          
          <div className="flex justify-between items-center">
            <b>Address</b>
            <span className="truncate max-w-[200px]">{address}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <b>Value</b>
            <div>{value?.toString() ?? "Loading..."}</div>
          </div>

          <button
            disabled={!connected}
            className={`px-4 py-2 rounded-md transition-colors ${
              connected 
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
