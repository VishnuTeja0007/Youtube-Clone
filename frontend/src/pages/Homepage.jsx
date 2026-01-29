import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import VideoGrid from '../components/VideoGrid';
import { useOutletContext } from 'react-router-dom';
const HomePage = () => {
  const { searchTerm } = useOutletContext()
console.log(searchTerm)
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");


  // 5 Tabs as requested
  const categories = ["All", "Education", "Travel", "Vlog", "LIVE"];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, []);

const filteredVideos = useMemo(() => {
  return videos.filter((video) => {
    const matchesCategory =
      activeCategory === "All" ||
      video.category.toUpperCase() === activeCategory.toUpperCase();

    const matchesQuery =
      !searchTerm ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesQuery;
  });
}, [videos, activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-yt-bg transition-colors duration-300">
      
      {/* Sticky Category Bar */}
      <div className="sticky top-14 z-40 w-full bg-yt-bg/95 backdrop-blur-sm border-b border-yt-border px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none max-w-[1400px] mx-auto">
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
      <main className="max-w-[1400px] mx-auto">
        <VideoGrid videos={filteredVideos} />
      </main>
    </div>
  );
};

export default HomePage;