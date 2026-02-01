import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, UserCircle, CheckCircle2 } from 'lucide-react';

const VideoSideBar = () => {
  const { id } = useParams();
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchPageData = () => {
      try {
        const videos=localStorage.getItem("yt_videos_cache")
        console.log(JSON.parse(videos))
        setVideo(JSON.parse(videos));
  
       
      } catch (error) {
        console.error("Error loading page data", error);
      }
    };
    fetchPageData();
  }, [id]);

//   if (loading) return <div className="p-10 text-yt-muted animate-pulse">Loading...</div>;

  return (
<div className="w-full lg:w-[400px] flex flex-col gap-3 mt-4 bg-yt-bg text-yt-text transition-colors duration-300">
  {video.slice(0,11).map((rec) => (
    <Link 
      to={`/watch/${rec._id}`} 
      key={rec._id} 
      className="flex gap-2 group cursor-pointer p-1 rounded-xl hover:bg-yt-surface/50 transition-colors"
    >
      {/* Thumbnail Section */}
      <div className="relative flex-shrink-0 w-40 h-24 overflow-hidden rounded-lg bg-yt-surface">
        <img 
          src={rec.thumbnailUrl} 
          alt={rec.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Timestamp Overlay */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-bold text-white px-1 rounded">
          12:45
        </div>
      </div>

      {/* Meta Data Section */}
      <div className="flex flex-1 flex-col pr-1 overflow-hidden">
        {/* Title: Uses the primary theme color on group hover */}
        <h4 className="text-sm font-bold line-clamp-2 leading-snug group-hover:text-yt-primary transition-colors duration-200">
          {rec.title}
        </h4>
        
        {/* Channel Info: Uses muted theme text */}
        <p className="text-[12px] text-yt-muted mt-1 flex items-center gap-1 hover:text-yt-text transition-colors">
          {rec.channel?.channelName} 
          <CheckCircle2 size={12} className="text-yt-muted" />
        </p>
        
        {/* Stats Row */}
        <div className="text-[12px] text-yt-muted flex items-center gap-1">
          <span>{rec.views > 1000 ? `${(rec.views/1000).toFixed(1)}K` : rec.views} views</span>
          <span>•</span>
          <span>1 day ago</span>
        </div>

        {/* Badge: Uses surface background for contrast */}
        <div className="mt-1">
          <span className="bg-yt-surface text-[10px] font-bold px-1.5 py-0.5 rounded text-yt-muted uppercase tracking-wider">
            New
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>
  );
};

export default VideoSideBar;