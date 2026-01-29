import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ThumbsUp, ThumbsDown, Share2, Download, 
  MoreHorizontal, UserCircle, ListFilter 
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetching specific video based on URL ID
        const response = await axios.get(`http://localhost:3000/api/videos/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
          <button className="ml-4 px-4 py-2 bg-yt-text text-yt-bg rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all">
            Subscribe
          </button>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {/* Like/Dislike Group */}
          <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-yt-border transition-colors border-r border-yt-border active:bg-yt-border/50">
              <ThumbsUp size={18} />
              <span className="text-sm font-bold">{video.likes?.toLocaleString()}</span>
            </button>
            <button className="px-4 py-2 hover:bg-yt-border transition-colors active:bg-yt-border/50">
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Secondary Actions */}
          <button className="flex items-center gap-2 px-4 py-2 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border transition-colors whitespace-nowrap active:scale-95">
            <Share2 size={18} />
            <span className="text-sm font-bold">Share</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border transition-colors whitespace-nowrap active:scale-95">
            <Download size={18} />
            <span className="text-sm font-bold">Download</span>
          </button>

          <button className="p-2 bg-yt-surface rounded-full border border-yt-border hover:bg-yt-border transition-colors active:scale-90">
            <MoreHorizontal size={18} />
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
      <div className="mt-6 border-t border-yt-border pt-6">
        <h2 className="text-xl font-bold flex items-center gap-6">
          Comments
          <span className="text-sm font-medium text-yt-muted cursor-pointer flex items-center gap-2 hover:text-yt-text transition-colors">
            <ListFilter size={20} />
            Sort by
          </span>
        </h2>
      </div>
    </div>
  );
};

export default VideoPage;