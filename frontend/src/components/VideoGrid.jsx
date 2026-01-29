import React from 'react';
import { Eye, ThumbsUp, ThumbsDown, Play, MoreVertical, UserCircle } from 'lucide-react';
import Toast from './Toaster';
import { Link } from 'react-router-dom';
const VideoGrid = ({ videos = [], className = '' }) => {
  if (!videos.length) {
    return (
      <Toast title="500 Server Issue" message="No Videos Found. Try After Sometime" onClose={()=>{console.log("close")}} />
   
    );
  }

  return (
    <div 
      className={`
        /* Grid Layout: Start with 1, move to 2, cap at 3 for desktop */
        grid grid-cols-1 gap-x-6 gap-y-10 p-4
        xs:grid-cols-2 
        lg:grid-cols-3 
        
        /* 'Particular Dimension' Control */
        /* This prevents cards from stretching infinitely on ultra-wide screens */
        max-w-[1400px] mx-auto
        
        md:p-6 ${className}
      `}
    >
      {videos.map((video, index) => (
        <VideoCard key={video._id || index} video={video} index={index} />
      ))}
    </div>
  );
};

const VideoCard = ({ video, index }) => {
  // Destructuring based on your Mongoose Schema
  const { 
    title, 
    thumbnailUrl, 
    category, 
    views, 
    likes, 
    dislikes, 
    videoUrl, 
    channel,  // Populated from Channel Model
    uploader  // Populated from User Model
  } = video;

  const animationDelay = `${index * 50}ms`;

  return (
    <div 
      className="group animate-slide-up flex flex-col bg-yt-bg border border-yt-border transition-all duration-300 hover:shadow-xl hover:z-10"
      style={{ animationDelay }}
    >
      {/* Thumbnail Container - No rounded borders per your instruction */}
      <Link
        to={`/watch/${video._id}`}
        className="relative aspect-video w-full overflow-hidden bg-yt-surface border-b border-yt-border"
      >
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Playback Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-yt-primary p-3 rounded-full shadow-lg">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
             </div>
          </div>
        </div>
        
        <div className="absolute right-2 bottom-2 bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wider">
          12:45
        </div>

        {/* Live Indicator based on Category String */}
        {category?.toUpperCase().includes('LIVE') && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-yt-primary px-2 py-0.5 text-[10px] font-black text-white animate-live-pulse">
            <div className="h-1 w-1 rounded-full bg-white" />
            LIVE
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="flex gap-3 p-4 bg-yt-bg transition-colors group-hover:bg-yt-surface/30">
        
        {/* Channel/User Avatar */}
        <div className="flex-shrink-0">
          {/* Prioritizitoang uploader avatar as per typical YouTube behavior */}
          {uploader?.avatar || channel?.owner?.avatar ? (
            <img 
              src={uploader?.avatar || channel?.owner?.avatar} 
              className="h-9 w-9 rounded-full object-cover border border-yt-border" 
              alt="avatar" 
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yt-surface text-yt-muted border border-yt-border">
              <UserCircle size={24} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Text Metadata */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex justify-between items-start gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-yt-text group-hover:text-yt-primary transition-colors">
              {title}
            </h3>
            <button className="h-fit p-1 opacity-0 transition-opacity group-hover:opacity-100 text-yt-text hover:bg-yt-surface rounded-full">
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Accessing channelName from the Channel Schema */}
          <p className="mt-1 text-xs font-semibold text-yt-muted hover:text-yt-text cursor-pointer truncate transition-colors">
            {channel?.channelName || uploader?.username || 'Unknown Channel'}
          </p>

          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-yt-muted">
            <span className="whitespace-nowrap">{views?.toLocaleString()} views</span>
            <span className="opacity-40">•</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 group-hover:text-yt-primary transition-colors">
                <ThumbsUp size={12} />
                <span>{likes?.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown size={12} />
                <span>{dislikes?.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;