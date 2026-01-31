import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MoreVertical, Edit2, Trash2, Video as VideoIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';
            import { Link } from 'react-router-dom';

const ChannelProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null); // Track which video menu is open
  
  const { channelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/channels/${channelId}`);
        setData(response.data);
      } catch (err) {
        console.error("Error loading channel", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [channelId]);
 const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`http://localhost:3000/api/videos/${videoId}`,getAuthHeader());
        // Update local state to remove the video immediately
        setData(prev => ({
          ...prev,
          videos: prev.videos.filter(v => v._id !== videoId)
        }));
      } catch (err) {
        alert("Failed to delete video: " + err.message);
      }
    }
  };

  if (loading) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Loading...</div>;
  if (!data) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Channel not found.</div>;

  const { channel, videos } = data;
  const isOwner = user?.id === channel.owner._id;

  return (
    <div className="bg-yt-bg text-yt-text min-h-screen">
      {/* 1. Simplified Banner & Header */}
      <div className="w-full h-40 bg-yt-surface overflow-hidden">
        {channel.channelBanner && <img src={channel.channelBanner} className="w-full h-full object-cover" alt="banner" />}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-6 mt-6 pb-8 border-b border-yt-border">
          <img src={channel.owner.avatar} className="w-24 h-24 rounded-full border-2 border-yt-border" alt="avatar" />
          <div>
            <h1 className="text-2xl font-bold">{channel.channelName}</h1>
            <p className="text-yt-muted text-sm">@{channel.owner.username} • {videos.length} Videos</p>
          </div>
        </div>

        {/* 2. Simplified "Your Videos" Heading */}
        <div className="flex justify-between items-center mt-8 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <VideoIcon size={20} className="text-yt-primary" />
            {isOwner ? "Manage Your Videos" : "Videos"}
          </h2>
          
          {isOwner && (
            <button 
              onClick={() => navigate('/studio/CreateVideo')}
              className="flex items-center gap-2 bg-yt-text text-yt-bg px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all"
            >
              <PlusCircle size={18} /> Create Video
            </button>
          )}
        </div>

        {/* 3. Video Grid */}
        <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{videos.map((video) => (
  <div key={video._id} className="flex flex-col gap-2 relative group">
    
    {/* 1. Thumbnail Wrapper with Zoom Effect */}
    <div className="relative aspect-video bg-yt-surface rounded-xl overflow-hidden border border-yt-border">
      {/* Clicking the image navigates to the video player */}
      <Link to={`/watch/${video._id}`}>
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
        />
      </Link>
      
      {/* 2. Action Menu (Owner Only) */}
      {isOwner && (
        <div className="absolute top-2 right-2 z-20">
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevents Link navigation
              e.stopPropagation(); // Prevents bubbling
              setActiveMenu(activeMenu === video._id ? null : video._id);
            }}
            className="p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          
          {activeMenu === video._id && (
            <div className="absolute right-0 mt-2 w-32 bg-yt-surface border border-yt-border rounded-lg shadow-xl z-30 overflow-hidden">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/studio/updateVideo', { state: { video } });
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-yt-border/30 text-left"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(video._id);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 text-left"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    {/* 3. Video Info with Title Link */}
    <div className="pr-2">
      <Link to={`/video/${video._id}`}>
        <h3 className="font-bold text-sm line-clamp-2 leading-snug hover:text-yt-primary transition-colors">
          {video.title}
        </h3>
      </Link>
      <p className="text-yt-muted text-xs mt-1">
        {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;