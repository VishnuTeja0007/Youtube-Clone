import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ThumbsUp, ThumbsDown, Share2, Download, 
  MoreHorizontal, UserCircle, ListFilter 
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useAuth } from '../contexts/userContext';
import CommentSection from './CommentSection';
const VideoPage = () => {
  const { user, login } = useAuth();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper for Auth Headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/videos/${id}`);
        setVideo(response.data);
        
        // Add to watch history if user is logged in
        if (user && response.data) {
          await axios.post(
            `http://localhost:3000/api/actions/watchhistory`, 
            { videoId: id }, 
            getAuthHeader()
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]); // Removed user from dependency to avoid loop, handled inside

  const handleLike = async () => {
    if (!user) return alert("Please login to like");
    try {
        console.log("like clicked")
      const res = await axios.post(
        `http://localhost:3000/api/actions/likes`,
        { videoId: video._id },

        getAuthHeader()
      );
      
      // Update User Context
      login({ ...user, ...res.data.user });

      // Update Local Video State (Optimistic or based on logic)
      setVideo(prev => {
        const isLiked = user.likedVideos?.includes(video._id);
        const isDisliked = user.dislikedVideos?.includes(video._id);
        
        let newLikes = prev.likes;
        if (isLiked) newLikes--; // Removing like
        else newLikes++; // Adding like
        
        return { ...prev, likes: newLikes };
      });
    } catch (err) {
      console.error("Like error:", err?.message);
    }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please login to dislike");
    try {
      const res = await axios.post(
        `http://localhost:3000/api/actions/dislikes`,
        { videoId: video._id },
        getAuthHeader()
      );
      login({ ...user, ...res.data.user });
      
      // If was liked, we need to decrease like count in UI
      if (user.likedVideos?.includes(video._id)) {
        setVideo(prev => ({ ...prev, likes: prev.likes - 1 }));
      }
    } catch (err) {
      console.error("Dislike error:", err);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe");
    if (!video.channel) return;
    
    try {
      const res = await axios.post(
        `http://localhost:3000/api/actions/subscribe`,
        { channelId: video.channel._id },
        getAuthHeader()
      );
      login({ ...user, ...res.data.user });
      
      // Update local subscriber count
      setVideo(prev => ({
        ...prev,
        channel: {
          ...prev.channel,
          subscribers: res.data.subscribed 
            ? prev.channel.subscribers + 1 
            : prev.channel.subscribers - 1
        }
      }));
    } catch (err) {
      console.error("Subscribe error:", err.response?.data?.message || err.message);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse text-yt-muted font-medium">Loading video...</div>
      </div>
    );
  }

  if (!video) return <div className="p-10 text-center">Video not found.</div>;

  return (
    <div className="w-[70%] flex flex-col gap-4 p-4 lg:p-6 max-w-[1280px] mx-auto bg-yt-bg text-yt-text transition-colors duration-300">
      
      {/* 1. Video Player Section */}
      <div className="w-full bg-black">
        <VideoPlayer src={video.videoUrl} />
      </div>

      {/* 2. Video Title */}
      <h1 className="text-xl font-bold leading-tight lg:text-2xl mt-2 line-clamp-2">
        {video.title}
      </h1>

      {/* 3. Channel & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-transparent">
        <div className="flex items-center gap-3">
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            {video.channel?.owner?.avatar || video.uploader?.avatar ? (
              <img 
                src={video.channel?.owner?.avatar || video.uploader?.avatar} 
                className="h-10 w-10 rounded-full object-cover border border-yt-border" 
                alt="Channel" 
              />
            ) : (
              <UserCircle size={40} strokeWidth={1.5} className="text-yt-muted" />
            )}
          </div>
          
          {/* Channel Info */}
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-base truncate">
              {video.channel?.channelName || "Unknown Channel"}
            </h3>
            <p className="text-xs text-yt-muted">
              {video.channel?.subscribers?.toLocaleString() || "0"} subscribers
            </p>
          </div>

          {/* Subscribe Button */}
          <button 
            onClick={handleSubscribe}
            className={`ml-4 px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all ${
              user?.subscribedChannels?.includes(video.channel?._id)
                ? "bg-yt-surface text-yt-text border border-yt-border"
                : "bg-yt-text text-yt-bg"
            }`}
          >
            {user?.subscribedChannels?.includes(video.channel?._id) ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {/* Like/Dislike Group */}
          <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden shrink-0">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-yt-border transition-colors border-r border-yt-border active:bg-yt-border/50 ${
                user?.likedVideos?.includes(video._id) ? "text-white bg-white/10" : ""
              }`}
            >
              <ThumbsUp size={18} fill={user?.likedVideos?.includes(video._id) ? "currentColor" : "none"} />
              <span className="text-sm font-bold">{video.likes?.toLocaleString()}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`px-4 py-2 hover:bg-yt-border transition-colors active:bg-yt-border/50 ${
                user?.dislikedVideos?.includes(video._id) ? "text-white bg-white/10" : ""
              }`}
            >
              <ThumbsDown size={18} fill={user?.dislikedVideos?.includes(video._id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Secondary Actions */}
          <button className="p-2 px-4 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border transition-colors active:scale-90">
            <span>View Channel</span>
          </button>
        </div>
      </div>

      {/* 4. Description Box */}
      <div className="bg-yt-surface rounded-xl p-4 text-sm border border-yt-border hover:bg-yt-border/50 transition-colors cursor-pointer group">
        <div className="flex gap-3 font-bold mb-2">
          <span>{video.views?.toLocaleString()} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          <span className="text-yt-muted">#{video.category}</span>
        </div>
        <p className="whitespace-pre-line text-yt-text/90 line-clamp-3 leading-relaxed">
          {video.description}
        </p>
        <button className="mt-2 font-bold text-yt-text group-hover:underline">...more</button>
      </div>

      {/* 5. Comments Section Header */}
      <CommentSection currentUser={user} videoId={video._id} />
    </div>
  );
};

export default VideoPage;