import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Settings, Users } from 'lucide-react';
import { useAuth } from '../contexts/userContext';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
const {user}=useAuth();
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:3000/api/channels');
        setChannels(response.data);
      } catch (err) {
        console.error("Error fetching channels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  if (loading) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Loading Channels...</div>;

  return (
    <div className="bg-yt-bg min-h-screen text-yt-text p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Users className="text-yt-primary" />
          Explore Channels
        </h2>

        {/* Card Layout Stacking */}
        <div className="flex flex-col gap-4">
          {channels.map((channel) => {
            const isOwner = user?.id === (channel.owner._id || channel.owner);
            
            return (
              <div 
                key={channel._id} 
                className={`flex items-center p-4 rounded-xl border transition-all ${
                  isOwner 
                  ? 'border-yt-primary bg-yt-primary/5' 
                  : 'border-yt-border bg-yt-surface hover:bg-yt-border/20'
                }`}
              >
                {/* Channel Avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={channel.owner.avatar || "https://via.placeholder.com/150"} 
                    alt={channel.channelName} 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
                  />
                </div>

                {/* Channel Details */}
                <div className="ml-4 md:ml-6 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{channel.channelName}</h3>
                    {isOwner && (
                      <CheckCircle size={18} className="text-yt-primary" title="Your Channel" />
                    )}
                  </div>
                  
                  <p className="text-yt-muted text-sm line-clamp-1 mb-1">
                    @{channel.owner.username} • {channel.subscribers} subscribers
                  </p>
                  <p className="text-yt-text/70 text-xs md:text-sm line-clamp-1 italic">
                    {channel.description || "No description provided."}
                  </p>
                </div>

                {/* Action Button */}
                <div className="ml-2">
                  {isOwner ? (
                    <button className="flex items-center gap-1 bg-yt-text text-yt-bg px-4 py-2 rounded-full text-xs md:text-sm font-bold hover:opacity-80 transition-opacity">
                      <Settings size={14} /> Manage
                    </button>
                  ) : (
                    <button className="bg-yt-surface border border-yt-border text-yt-text px-4 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-yt-border/40 transition-colors">
                      View
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChannelList;