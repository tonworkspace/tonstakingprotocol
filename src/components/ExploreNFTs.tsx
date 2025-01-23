import { useEffect, useState } from 'react';
import { TonApi, Item } from '../utility/ton-api';

export const ExploreNFTs = () => {
  const [nfts, setNfts] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tonApi = new TonApi();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const nftItems = await tonApi.getAllNFTs();
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Explore NFTs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div 
            key={nft.address} 
            className="bg-[#2e3b52] rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="aspect-square w-full relative bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              {nft.metadata.image ? (
                <img 
                  src={nft.metadata.image} 
                  alt={nft.metadata.name || 'NFT'} 
                  className="w-full h-full object-cover"
                />
              ) : nft.previews && nft.previews.length > 0 ? (
                <img 
                  src={nft.previews[0].url} 
                  alt={nft.metadata.name || 'NFT'} 
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
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium">
                    {nft.metadata.name || 'Unnamed NFT'}
                  </h3>
                  {nft.collection && (
                    <p className="text-sm text-gray-400 mt-1">
                      {nft.collection.name}
                    </p>
                  )}
                </div>
                {nft.verified && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {nft.sale && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    Price: <span className="text-white font-medium">
                      {nft.sale.price.value} {nft.sale.price.token_name}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 