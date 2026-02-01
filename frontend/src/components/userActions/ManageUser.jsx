import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Users, 
  PlaySquare, 
  Home 
} from 'lucide-react';
import { useAuth } from '../contexts/userContext';

const UserLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');

  if (!user) return <div className="bg-yt-bg h-screen text-yt-text p-10">Please log in to view your library.</div>;

  // Tabs Configuration
  const tabs = [
    { name: 'History', icon: <History size={18} />, data: user.watchHistory || [] },
    { name: 'Subscriptions', icon: <Users size={18} />, data: user.subscribedChannels || [] },
    { name: 'Liked', icon: <ThumbsUp size={18} />, data: user.likedVideos || [] },
    { name: 'Disliked', icon: <ThumbsDown size={18} />, data: user.dislikedVideos || [] },
    { name: 'Watch Later', icon: <Clock size={18} />, data: user.watchLater || [] },
  ];

  const currentData = tabs.find(t => t.name === activeTab).data;

  return (
    <div className="bg-yt-bg min-h-screen text-yt-text transition-colors duration-300">
      {/* 1. Profile Header (Similar to Channel Header) */}
      <div className="max-w-7xl mx-auto px-4 xxs:px-8 pt-10">
        <div className="flex items-center gap-6 pb-8 border-b border-yt-border">
          <img 
            src={user.avatar} 
            className="w-20 h-20 xxs:w-28 xxs:h-28 rounded-full border-2 border-yt-border shadow-xl object-cover" 
            alt="Profile" 
          />
          <div>
            <h1 className="text-2xl xxs:text-3xl font-bold">{user.username}</h1>
            <p className="text-yt-muted text-sm">{user.email}</p>
            <div className="mt-3 flex gap-2">
               <span className="bg-yt-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-yt-border">
                 {user.watchHistory?.length || 0} Watched
               </span>
               <span className="bg-yt-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-yt-border">
                 {user.subscribedChannels?.length || 0} Subscriptions
               </span>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Tab Navigation */}
        <div className="flex gap-2 xxs:gap-6 mt-6 overflow-x-auto no-scrollbar border-b border-yt-border">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 pb-4 px-2 text-sm font-bold uppercase tracking-tighter transition-all whitespace-nowrap ${
                activeTab === tab.name 
                ? 'border-b-2 border-yt-text text-yt-text' 
                : 'text-yt-muted hover:text-yt-text'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* 3. Content Section */}
        <div className="py-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PlaySquare size={20} className="text-yt-primary" />
            Your {activeTab}
          </h2>

          {currentData.length > 0 ? (
            <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentData.map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  {/* Video Card Mockup (Assumes full data is fetched) */}
                  <div className="aspect-video bg-yt-surface rounded-xl overflow-hidden border border-yt-border relative">
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                           <Home size={24} className="text-white" />
                        </div>
                     </div>
                     {/* If it's history, display the date */}
                     {item.watchedAt && (
                        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                           {new Date(item.watchedAt).toLocaleDateString()}
                        </div>
                     )}
                  </div>
                  <h3 className="mt-2 font-semibold text-sm line-clamp-2">
                    {/* If item is just an ID, you'd show a skeleton or fetch details */}
                    {item.video ? `Video ID: ${item.video}` : `Content ID: ${item}`}
                  </h3>
                  <p className="text-yt-muted text-xs mt-1">Click to view details</p>
                </div>
              ))}
            </div>
          ) : (
            /* 4. Empty State */
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-24 h-24 bg-yt-surface rounded-full flex items-center justify-center text-yt-muted">
                 <PlaySquare size={40} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold">No {activeTab} yet</h3>
                <p className="text-yt-muted text-sm mt-1">Start exploring videos to fill up your library.</p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-yt-text text-yt-bg px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:opacity-90 transition-all"
              >
                <Home size={16} /> Go to Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;