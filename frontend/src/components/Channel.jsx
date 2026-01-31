import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';

const ChannelProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const {channelId}=useParams();
console.log(channelId)
const {user,login}=useAuth();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/channels/${channelId}`);
        setData(response.data);
      } catch (err) {
        console.error("Error loading channel", err?.stack);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [channelId]);

  if (loading) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Loading...</div>;
  if (!data) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Channel not found.</div>;

  const { channel, videos } = data;
  // Check if current user is the owner
  const isOwner = user?.id === channel.owner._id;

  return (
    <div className="bg-yt-bg text-yt-text min-h-screen transition-colors duration-300">
      {/* 1. Channel Banner */}
      <div className="w-full h-40 md:h-56 bg-yt-surface overflow-hidden">
        {channel.channelBanner ? (
          <img src={channel.channelBanner} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-yt-border/30" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
          <div className="relative">
            <img 
              src={channel.owner.avatar} 
              alt="Avatar" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yt-bg object-cover" 
            />
          </div>
          
          <div className="flex-1 text-center md:text-left mt-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{channel.channelName}</h1>
            <p className="text-yt-muted text-sm font-medium mt-1">
              @{channel.owner.username} • {channel.subscribers} subscribers • {videos.length} videos
            </p>
            <p className="text-yt-text/80 mt-3 max-w-2xl line-clamp-2 text-sm md:text-base">
              {channel.description || "No description available."}
            </p>
            
            {/* 3. Conditional Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              {isOwner ? (
                <button className="bg-yt-text text-yt-bg px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-all">
                  Manage Videos
                </button>
              ) : (
                <>
                  <button className="bg-yt-text text-yt-bg px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-all">
                    Subscribe
                  </button>
                  {/* Show Create Channel only if visitor doesn't have one */}
                  {!user?.channel && (
                    <button className="flex items-center gap-2 bg-yt-surface text-yt-text border border-yt-border px-5 py-2 rounded-full font-semibold text-sm hover:bg-yt-border/50 transition-all">
                      <PlusCircle size={18} /> Create Your Own Channel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 4. Tab Navigation */}
        <div className="flex gap-6 mt-8 border-b border-yt-border">
          <button className="border-b-2 border-yt-text pb-3 px-2 text-sm font-bold uppercase tracking-wider">
            Videos
          </button>
          <button className="text-yt-muted pb-3 px-2 text-sm font-bold uppercase tracking-wider hover:text-yt-text transition-colors">
            Playlists
          </button>
          <button className="text-yt-muted pb-3 px-2 text-sm font-bold uppercase tracking-wider hover:text-yt-text transition-colors">
            About
          </button>
        </div>

        {/* 5. Video Section Only */}
        <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 py-8">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video._id} className="flex flex-col gap-2 group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-yt-surface rounded-xl overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                {/* Video Info */}
                <div className="flex flex-col pr-4">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 leading-snug text-yt-text">
                    {video.title}
                  </h3>
                  <div className="text-yt-muted text-xs md:text-sm mt-1">
                    <span>{video.views} views</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-yt-muted">
              This channel has no videos yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;