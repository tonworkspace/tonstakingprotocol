import { useEffect, useState } from 'react';
import { Address } from '@ton/core';
import { TonApi, Item } from '../utility/ton-api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NFTListProps {
  address: Address;
}

export const NFTList: React.FC<NFTListProps> = ({ address }) => {
  const [nfts, setNfts] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tonApi = new TonApi();

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch NFTs using your TonApi client
        const nftItems = await tonApi.searchItemsFromUser(address.toString());
        if (nftItems) {
          setNfts(nftItems.nft_items);
        }
        
      } catch (err) {
        console.error('Failed to fetch NFTs:', err);
        setError('Failed to load NFTs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  const nextNFT = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 === nfts.length ? 0 : prevIndex + 1
    );
  };

  const previousNFT = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? nfts.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm py-4">
        {error}
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#2e3b52] rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-400 text-lg mb-2">No NFTs Found</p>
        <p className="text-gray-500 text-sm">Your NFT collection is empty</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* NFT Counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <p className="text-sm text-white">
          {currentIndex + 1} / {nfts.length}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-900/20 to-orange-900/20 border border-orange-500/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="h-full">
              {/* NFT Image Container */}
              <div className="relative h-3/5 bg-gradient-to-br from-orange-500/10 to-purple-500/10">
                {nfts[currentIndex]?.metadata?.image ? (
                  <img 
                    src={nfts[currentIndex].metadata.image} 
                    alt={nfts[currentIndex].metadata?.name || 'NFT'} 
                    className="w-full h-full object-cover"
                  />
                ) : nfts[currentIndex]?.previews?.[0]?.url ? (
                  <img 
                    src={nfts[currentIndex]?.previews?.[0]?.url} 
                    alt={nfts[currentIndex]?.metadata?.name || 'NFT'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* NFT Details */}
              <div className="h-2/5 p-6 bg-[#1E1E1E]/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {nfts[currentIndex]?.metadata?.name || 'Unnamed NFT'}
                    </h3>
                    {nfts[currentIndex]?.collection?.name && (
                      <p className="text-orange-400 mt-1">
                        {nfts[currentIndex]?.collection?.name}
                      </p>
                    )}
                  </div>
                  {nfts[currentIndex]?.verified && (
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {nfts[currentIndex]?.metadata?.description && (
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {nfts[currentIndex].metadata.description}
                  </p>
                )}

                {nfts[currentIndex]?.sale?.price && (
                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-gray-400">
                      Price: <span className="text-white font-medium">
                        {nfts[currentIndex]?.sale?.price?.value} {nfts[currentIndex]?.sale?.price?.token_name}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={previousNFT}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextNFT}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {nfts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-orange-500 w-4' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};