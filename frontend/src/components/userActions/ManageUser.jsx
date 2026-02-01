import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  History, ThumbsUp, ThumbsDown, Clock, 
  Users, PlaySquare, Home, ChevronRight, Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/userContext';

const UserLibrary = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This will permanently delete your channel and all videos.")) {
      try {
        await axios.delete('http://localhost:3000/api/auth/delete', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        logout();
        navigate('/register');
      } catch (err) {
        console.error("Delete account error:", err);
        alert(err.response?.data?.message || "Failed to delete account");
      }
    }
  };

  const handleRemoveItem = async (e, videoId) => {
    e.preventDefault(); // Prevent navigation to video
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to remove this video from the list?")) return;

    try {
      let url = '';
      if (activeTab === 'History') url = 'http://localhost:3000/api/actions/watchhistory';
      if (activeTab === 'Watch Later') url = 'http://localhost:3000/api/actions/watchlater';

      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { videoId } // Send videoId in body for DELETE request
      });
      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Error removing item:", err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  if (!user) return <div className="bg-yt-bg min-h-screen text-yt-text p-10">Please log in.</div>;

  // Tabs Configuration with Populated Data Mapping
  const tabs = [
    { 
      fieldName:"watchHistory",
      name: 'History', 
      icon: <History size={18} />, 
      // Filter out null videos and map to a consistent structure
      data: (user.watchHistory || [])
        .filter(item => item.video !== null)
        .map(item => ({ ...item.video, watchedAt: item.watchedAt }))
    },
    { fieldName:"subscribedChannels",name: 'Subscriptions', icon: <Users size={18} />, data: user.subscribedChannels || [] },
    { fieldName:"likedVideos",name: 'Liked', icon: <ThumbsUp size={18} />, data: user.likedVideos || [] },
    { fieldName:"dislikedVideos",name: 'Disliked', icon: <ThumbsDown size={18} />, data: user.dislikedVideos || [] },
    { fieldName:"watchLater",name: 'Watch Later', icon: <Clock size={18} />, data: user.watchLater || [] },
  ];

  // Fix: Match by exact name instead of fieldName inclusion
  const currentTabObj = tabs.find(t => t.name === activeTab);
  const currentData = currentTabObj?.data || [];

  return (
    <div className="bg-yt-bg min-h-screen text-yt-text transition-colors duration-300 pb-20">
      <div className="max-w-7xl mx-auto px-4 xxs:px-8">
        
        {/* 1. Profile Summary Header */}
        <div className="flex flex-col xs:flex-row items-center gap-6 py-10 border-b border-yt-border">
          <img 
            src={user.avatar} 
            className="w-24 h-24 xxs:w-32 xxs:h-32 rounded-full border-4 border-yt-surface shadow-2xl object-cover" 
            alt="Profile" 
          />
          <div className="text-center xs:text-left">
            <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
            <p className="text-yt-muted text-sm mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center xs:justify-start gap-2">
               
               <button onClick={() => navigate("/studio/updateProfile")} className="bg-yt-surface hover:bg-yt-border/50 border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                 Customize Profile
               </button>
               <button onClick={() => { logout(); navigate('/'); }} className="bg-yt-surface hover:bg-yt-border/50 border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                 Sign Out
               </button>
               <button onClick={handleDeleteAccount} className="bg-yt-surface hover:bg-yt-border/50 border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                 Delete Account
               </button>
            </div>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex gap-4 xxs:gap-8 mt-4 overflow-x-auto no-scrollbar border-b border-yt-border">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 pb-4 px-1 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.name 
                ? 'border-b-2 border-yt-primary text-yt-text' 
                : 'text-yt-muted hover:text-yt-text'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* 3. Video Grid Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tighter">
              {currentTabObj.icon} {activeTab}
            </h2>
            <span className="text-yt-muted text-xs font-bold">
              {currentData.length} {activeTab === 'Subscriptions' ? 'Channels' : 'Videos'}
            </span>
          </div>

          {currentData.length > 0 ? (
            activeTab === 'Subscriptions' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentData.map((channel) => (
                  <Link 
                    to={`/channel/${channel._id}`} 
                    key={channel._id} 
                    className="flex items-center gap-4 p-4 bg-yt-surface rounded-xl border border-yt-border hover:border-yt-primary/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-yt-border flex-shrink-0 bg-yt-bg">
                      <img 
                        src={channel.channelBanner || `https://api.dicebear.com/7.x/initials/svg?seed=${channel.channelName}`} 
                        className="w-full h-full object-cover" 
                        alt={channel.channelName} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate group-hover:text-yt-primary transition-colors">{channel.channelName}</h3>
                      <p className="text-xs text-yt-muted">{channel.subscribers?.toLocaleString() || 0} subscribers</p>
                      {channel.description && <p className="text-xs text-yt-muted line-clamp-1 mt-1">{channel.description}</p>}
                    </div>
                    <ChevronRight className="text-yt-muted group-hover:text-yt-primary transition-colors" size={20} />
                  </Link>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {currentData.map((video) => (
                <Link to={`/watch/${video._id}`} key={video._id} className="flex flex-col gap-2 group relative">
                  {/* Thumbnail with Hover Zoom */}
                  <div className="relative aspect-video bg-yt-surface rounded-xl overflow-hidden border border-yt-border">
                    <img 
                      src={video.thumbnailUrl} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={video.title} 
                    />
                    {video.watchedAt && (
                       <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-white px-2 py-0.5 rounded font-bold uppercase">
                         Watched {new Date(video.watchedAt).toLocaleDateString()}
                       </div>
                    )}
                    
                    {/* Delete Button for History and Watch Later */}
                    {(activeTab === 'History' || activeTab === 'Watch Later') && (
                      <button 
                        onClick={(e) => handleRemoveItem(e, video._id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                        title="Remove from list"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Video Meta */}
                  <div className="pr-4">
                    <h3 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-yt-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-yt-muted text-xs mt-1 flex items-center gap-1">
                      <span>{video?.views?.toString()} views</span>
                      <span>•</span>
                      <span>{video.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )
          ) : (
            /* 4. Empty State UI */
            <div className="flex flex-col items-center justify-center py-24 bg-yt-surface/30 rounded-3xl border border-dashed border-yt-border">
              <div className="w-20 h-20 bg-yt-surface rounded-full flex items-center justify-center text-yt-muted mb-6">
                 <PlaySquare size={32} />
              </div>
              <h3 className="text-lg font-bold">Nothing in {activeTab} yet</h3>
              <p className="text-yt-muted text-sm mt-1 max-w-xs text-center">
                Your activity and saved videos will appear here once you start watching.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="mt-8 flex items-center gap-2 bg-yt-text text-yt-bg px-10 py-3 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-all shadow-lg"
              >
                <Home size={16} /> Explore Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;