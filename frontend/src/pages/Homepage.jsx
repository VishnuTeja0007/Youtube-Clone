// In parent component (e.g., HomePage.jsx)
import VideoGrid from '../components/VideoGrid';
import { useEffect, useState } from 'react';
import axios from 'axios';
const HomePage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch from your MongoDB API endpoint
    async function fetchData(){
      const videos=await axios.get('http://localhost:3000/api/videos')
      console.log(videos)
      setVideos(videos.data)
    }
    fetchData()
  }, []);

  return (
    <div className="min-h-screen bg-yt-bg">
      <VideoGrid videos={videos} />
    </div>
  );
};

export default HomePage;