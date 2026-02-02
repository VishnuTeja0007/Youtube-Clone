import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MoreVertical, Edit2, Trash2, Video as VideoIcon } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/userContext';
import SecureDeleteChannel from './channelForms/DeleteChannel';
import Loading from './Loading';

const ChannelProfile = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        await axios.delete(`http://localhost:3000/api/videos/${videoId}`, getAuthHeader());
        // Update local state to remove the video immediately
        setData(prev => ({
          ...prev,
          videos: prev.videos.filter(v => v._id !== videoId)
        }));
        setActiveMenu(null); // Close menu after delete
      } catch (err) {
        alert("Failed to delete video: " + err.message);
      }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  if (loading) return <Loading variant="spinner" size="full" text="Loading Channel..." />;
  if (!data) return <div className="bg-yt-bg text-yt-text p-10 h-screen">Channel not found.</div>;

  const { channel, videos } = data;
  const isOwner = user?.id === channel.owner._id;

  return (
    <div className="bg-yt-bg text-yt-text min-h-screen transition-colors duration-300">
      {/* Banner */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-yt-surface overflow-hidden">
        {channel.channelBanner && (
          <img 
            src={channel.channelBanner} 
            className="w-full h-full object-cover" 
            alt="Channel banner" 
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Channel Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mt-4 sm:mt-6 pb-6 sm:pb-8 border-b border-yt-border">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <img 
              src={channel.owner.avatar} 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-yt-border flex-shrink-0" 
              alt="Channel avatar" 
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-yt-text truncate">
                {channel.channelName}
              </h1>
              <p className="text-yt-muted text-xs sm:text-sm truncate">
                @{channel.owner.username} • {videos.length} Video{videos.length !== 1 ? 's' : ''}
              </p>
              <p className="text-yt-muted text-xs mt-1 hidden sm:block">
                {channel.subscribers?.toLocaleString() || 0} subscribers
              </p>
            </div>
          </div>

          {/* Owner Controls */}
          {isOwner && (
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/studio/updateChannel', { state: { channel } })}
                className="flex-1 sm:flex-none bg-yt-surface text-yt-text border border-yt-border px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-yt-border transition-all"
              >
                Edit Channel
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 sm:flex-none bg-yt-primary/10 text-yt-primary border border-yt-primary/20 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-yt-primary hover:text-white transition-all"
              >
                Delete Channel
              </button>
            </div>
          )}
        </div>

        {/* Render the Secure Delete Modal */}
        {isDeleteModalOpen && (
          <SecureDeleteChannel 
            channelId={channel._id} 
            onClose={() => setIsDeleteModalOpen(false)} 
          />
        )}

        {/* Videos Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <VideoIcon size={20} className="text-yt-primary" />
            {isOwner ? "Manage Your Videos" : "Videos"}
          </h2>
          
          {isOwner && (
            <button 
              onClick={() => navigate('/studio/CreateVideo')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yt-text text-yt-bg px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <PlusCircle size={18} /> Create Video
            </button>
          )}
        </div>

        {/* Video Grid: 1 col (default), 2 cols (sm), 3 cols (md+) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pb-10">
          {videos.map((video) => (
            <div key={video._id} className="flex flex-col gap-2 relative group">
              
              {/* Thumbnail Wrapper with Zoom Effect */}
              <div className="relative aspect-video bg-yt-surface rounded-lg sm:rounded-xl overflow-hidden border border-yt-border">
                {/* Clicking the image navigates to the video player */}
                <Link to={`/watch/${video._id}`}>
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
                  />
                </Link>
                
                {/* Action Menu (Owner Only) */}
                {isOwner && (
                  <div className="absolute top-2 right-2 z-20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMenu(activeMenu === video._id ? null : video._id);
                      }}
                      className="p-1.5 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeMenu === video._id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-36 bg-yt-surface border border-yt-border rounded-lg shadow-xl z-30 overflow-hidden"
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/studio/updateVideo', { state: { video } });
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-yt-border text-left text-yt-text transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(video._id);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-500 text-left transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Video Info with Title Link */}
              <div className="px-1">
                <Link to={`/watch/${video._id}`}>
                  <h3 className="font-bold text-sm sm:text-base line-clamp-2 leading-snug text-yt-text hover:text-yt-primary transition-colors">
                    {video.title}
                  </h3>
                </Link>
                <p className="text-yt-muted text-xs mt-1">
                  {video.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-16 text-yt-muted">
            <VideoIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No videos yet</p>
            {isOwner && (
              <p className="text-sm mt-2">Upload your first video to get started!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelProfile;