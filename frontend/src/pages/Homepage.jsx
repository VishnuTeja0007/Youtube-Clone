import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import VideoGrid from '../components/VideoGrid';
import { useOutletContext } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import Loading from '../components/Loading';

const HomePage = () => {
  const { searchTerm = "" } = useOutletContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Education", "Travel", "Vlog", "LIVE"];

  useEffect(() => {
    const fetchData = async () => {
      const CACHE_KEY = 'yt_videos_cache';
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedData) {
        setVideos(JSON.parse(cachedData));
        // Optional: Trigger a background fetch to update the cache silently
      }

      try {
        const { data } = await axios.get('http://localhost:3000/api/videos');
        setVideos(data);
        // Save to localStorage (must stringify objects)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVideos = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return videos.filter((video) => {
      const matchesCategory = activeCategory === "All" || 
                              video.category.toUpperCase() === activeCategory.toUpperCase();
      const matchesQuery = video.title.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesQuery;
    });
  }, [videos, activeCategory, searchTerm]);

  if (loading && videos.length === 0) {
    return <Loading variant="skeleton" type="video" />;
  }

  return (
    <div className="min-h-screen bg-yt-bg transition-colors duration-300">
      
      {/* Sticky Category Bar */}
      <div className="sticky top-0 z-30 w-full bg-yt-bg/95 backdrop-blur-sm border-b border-yt-border px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[1400px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeCategory === cat 
                  ? "bg-yt-text text-yt-bg shadow-md" // Inverse colors for active tab
                  : "bg-yt-surface text-yt-text border border-yt-border hover:bg-yt-border"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] h-auto  relative mx-auto">
        <VideoGrid videos={filteredVideos} />
      </div>
    </div>
  );
};

export default HomePage;