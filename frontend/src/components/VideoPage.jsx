import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ThumbsUp, ThumbsDown, Clock, UserCircle
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useAuth } from '../contexts/userContext';
import CommentSection from './CommentSection';

const VideoPage = () => {
  const { user, setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
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
          const historyRes = await axios.post(
            `http://localhost:3000/api/actions/watchhistory`, 
            { videoId: id }, 
            getAuthHeader()
          );
          if (historyRes.data.user) setUser(prev => ({ ...prev, ...historyRes.data.user }));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Check user interaction status
  const isLiked = useMemo(() => user?.likedVideos?.some(v => v._id === video?._id), [user, video]);
  const isDisliked = useMemo(() => user?.dislikedVideos?.some(v => v._id === video?._id), [user, video]);
  const isSubscribed = useMemo(() => user?.subscribedChannels?.some(c => c._id === video?.channel?._id), [user, video]);
  const isInWatchLater = useMemo(() => user?.watchLater?.some(v => v._id === video?._id), [user, video]);

  const handleLike = async () => {
    if (!user) return alert("Please login to like");
    try {
      console.log("like clicked");
      const res = await axios.post(
        `http://localhost:3000/api/actions/likes`,
        { videoId: video._id },
        getAuthHeader()
      );
      
      // Update User Context
      setUser(prev => ({ ...prev, ...res.data.user }));

      // Update Local Video State
      setVideo(prev => {
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
      setUser(prev => ({ ...prev, ...res.data.user }));
      
      // If was liked, decrease like count in UI
      if (isLiked) {
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
      setUser(prev => ({ ...prev, ...res.data.user }));
      
      // Update local subscriber count
      setVideo(prev => ({
        ...prev,
        channel: {
          ...prev.channel,
          subscribers: isSubscribed 
            ? prev.channel.subscribers - 1 
            : prev.channel.subscribers + 1
        }
      }));
    } catch (err) {
      console.error("Subscribe error:", err.response?.data?.message || err.message);
      if (err.response?.data?.message) alert(err.response.data.message);
    }
  };

  const handleWatchLater = async () => {
    if (!user) return alert("Please login to use Watch Later");
    try {
      const res = await axios.post(
        `http://localhost:3000/api/actions/watchlater`,
        { videoId: video._id },
        getAuthHeader()
      );
      setUser(prev => ({ ...prev, ...res.data.user }));
    } catch (err) {
      console.error("Watch Later error:", err?.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-pulse text-yt-muted font-medium">Loading video...</div>
      </div>
    );
  }

  if (!video) return <div className="p-10 text-center text-yt-text">Video not found.</div>;

  return (
    <div className="w-full flex flex-col gap-4 bg-yt-bg text-yt-text transition-colors duration-300">
      
      {/* Video Player Section */}
      <div className="w-full aspect-video bg-black overflow-hidden rounded-none sm:rounded-xl">
        <VideoPlayer src={video.videoUrl} />
      </div>

      {/* Video Info Container */}
      <div className="px-4 sm:px-0">
        {/* Video Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-yt-text line-clamp-2 mb-3">
          {video.title}
        </h1>

        {/* Channel & Actions Bar */}
        <div className="flex flex-col gap-3 py-2">
          {/* Top Row: Channel Info + Subscribe */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
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
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-base truncate text-yt-text">
                  {video.channel?.channelName || "Unknown Channel"}
                </h3>
                <p className="text-xs text-yt-muted">
                  {video.channel?.subscribers?.toLocaleString() || "0"} subscribers
                </p>
              </div>
            </div>

            {/* Subscribe Button */}
            <button 
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all whitespace-nowrap ${
                isSubscribed
                  ? "bg-yt-surface text-yt-text border border-yt-border"
                  : "bg-yt-text text-yt-bg"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Bottom Row: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Like/Dislike Group */}
            <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-yt-border transition-colors border-r border-yt-border active:bg-yt-border/50 ${
                  isLiked ? "text-yt-text bg-white/10" : ""
                }`}
              >
                <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-sm font-bold">{video.likes?.toLocaleString()}</span>
              </button>
              <button 
                onClick={handleDislike}
                className={`px-3 sm:px-4 py-2 hover:bg-yt-border transition-colors active:bg-yt-border/50 ${
                  isDisliked ? "text-yt-text bg-white/10" : ""
                }`}
              >
                <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Watch Later Button */}
            <button 
              onClick={handleWatchLater}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                isInWatchLater 
                  ? "bg-yt-surface text-yt-primary border-yt-primary" 
                  : "bg-yt-surface text-yt-text border-yt-border hover:bg-yt-border"
              }`}
            >
              <Clock size={18} className={isInWatchLater ? "fill-current" : ""} />
              <span className="hidden xs:inline whitespace-nowrap">Watch Later</span>
              <span className="xs:hidden">Later</span>
            </button>

            {/* View Channel Button */}
            <button 
              onClick={() => navigate(`/channel/${video.channel._id}`)} 
              className="px-3 sm:px-4 py-2 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border transition-colors active:scale-90 text-sm font-bold whitespace-nowrap"
            >
              <span className="hidden sm:inline">View Channel</span>
              <span className="sm:hidden">Channel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description Box */}
      <div className="mx-4 sm:mx-0 bg-yt-surface rounded-xl p-4 text-sm border border-yt-border hover:bg-yt-border/50 transition-colors cursor-pointer group">
        <div className="flex flex-wrap gap-2 sm:gap-3 font-bold mb-2 text-xs sm:text-sm">
          <span className="text-yt-text">{video.views?.toLocaleString()} views</span>
          <span className="text-yt-text">{new Date(video.createdAt).toLocaleDateString()}</span>
          <span className="text-yt-muted">#{video.category}</span>
        </div>
        <p className="whitespace-pre-line text-yt-text/90 line-clamp-3 leading-relaxed text-sm">
          {video.description}
        </p>
        <button className="mt-2 font-bold text-yt-text group-hover:underline text-sm">...more</button>
      </div>

      {/* Comments Section */}
      <div className="mx-4 sm:mx-0">
        <CommentSection currentUser={user} videoId={video._id} />
      </div>
    </div>
  );
};

export default VideoPage;
