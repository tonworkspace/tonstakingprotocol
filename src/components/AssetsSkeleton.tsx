export const AssetsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse flex items-center p-4 bg-gray-800/50 rounded-xl">
        <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
        <div className="ml-4 space-y-2 flex-1">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
); 