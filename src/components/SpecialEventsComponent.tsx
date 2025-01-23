import { useState } from 'react';
import { Bell, ExternalLink, X } from 'lucide-react';

const NewsShoutbox = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Scorpion World Testnet Launch!',
      content: 'Join us for the exciting launch of Scorpion World Testnet! During this special event, players will receive double rewards for catching scorpions. Help us test the game mechanics and earn exclusive rewards!',
      date: 'Just now',
      link: 'https://scorpionworldtoken.xyz/whitelist',
      isNew: true
    },
    // {
    //   id: 2,
    //   title: 'Community Update',
    //   content: 'New features coming soon! Stay tuned for our next major update.',
    //   date: '2 hours ago',
    //   isNew: false
    // }
  ]);

  const dismissAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="w-full max-w-2xlrounded-lg shadow-lg mb-4">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-white">Latest Updates</h2>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`relative p-4 rounded-lg border transition-all ${
              announcement.isNew 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <button
              onClick={() => dismissAnnouncement(announcement.id)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">
                {announcement.title}
              </h3>
              {announcement.isNew && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  New
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {announcement.content}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {announcement.date}
              </span>
              
              {announcement.link && (
                <button
                  onClick={() => window.open(announcement.link, '_blank')}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsShoutbox;