import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { Counter } from "./CounterComponent";
import { Jetton } from "./JettonComponent";
import { TransferTon } from "./TransferTonComponent";
import { useTonConnect } from "@/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import { ProfileHeader } from "./ProfileHeader";
import useAuth from "@/hooks/useAuth";
import "@twa-dev/sdk";

function OnchainComponent() {
  const { network } = useTonConnect();
  const wallet = useTonWallet();
  const { user, playerData, isLoading, error } = useAuth();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading TON Features...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-400">
          <p>Error loading TON features: {error}</p>
        </div>
      </div>
    );
  }

  // Handle wallet connection state
  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md w-full space-y-8 p-custom">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Welcome, {user?.firstName}!</h2>
              <h3 className="text-xl text-blue-400 font-medium">Connect Your TON Wallet</h3>
              <p className="text-gray-400 text-lg mb-8">
                Connect your wallet to access TON blockchain features
              </p>
              {playerData && (
                <p className="text-gray-400">
                  Your Game Balance: {playerData.balance} 🦂
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#2c2d31] rounded-2xl p-6 shadow-xl border border-gray-800">
            <div className="flex justify-center p-4">
              <div className="w-full touch-manipulation">
                <center>
                  <TonConnectButton className="!min-h-[48px] !px-6 !py-3" />
                </center>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              New to TON? {' '}
              <a href="https://ton.org/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
                Learn more about Web3 wallets
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      <div className="max-w-[900px] mx-auto">
        {/* Profile Header with combined data */}
        {'imageUrl' in wallet && (
          <ProfileHeader
            photoUrl={user?.photoUrl || wallet.imageUrl}
            username={user?.username || wallet.name}
            customButton={
              <div className="touch-manipulation">
                <TonConnectButton className="!px-4 !py-2 !text-sm" />
              </div>
            }
          />
        )}

        {/* Player Stats */}
        {playerData && (
          <div className="bg-[#2c2d31] rounded-2xl p-4 mt-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Game Balance</span>
              <span className="text-yellow-400">{playerData.balance} 🦂</span>
            </div>
          </div>
        )}

        {/* Network Status */}
        <div className="bg-[#2c2d31] rounded-2xl p-4 mt-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Network</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              network === CHAIN.MAINNET 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {network ? network === CHAIN.MAINNET ? "Mainnet" : "Testnet" : "N/A"}
            </span>
          </div>
        </div>

        {/* TON Components */}
        <div className="flex flex-col gap-4 mt-4">
          <TONComponentWrapper title="Counter Contract">
            <Counter />
          </TONComponentWrapper>

          <TONComponentWrapper title="Transfer TON">
            <TransferTon />
          </TONComponentWrapper>

          <TONComponentWrapper title="Jetton Operations">
            <Jetton />
          </TONComponentWrapper>
        </div>
      </div>
    </div>
  );
}

interface TONComponentWrapperProps {
  title: string;
  children: React.ReactNode;
}

function TONComponentWrapper({ title, children }: TONComponentWrapperProps) {
  return (
    <div className="bg-[#2c2d31] rounded-2xl p-4 border border-gray-800">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default OnchainComponent;
