import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft } from 'lucide-react';
import Toast from '../Toaster';

const UpdateVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  
  // Extract video data passed from the ChannelProfile
  const videoData = location.state?.video;
  
  const [formData, setFormData] = useState({
    title: videoData?.title || '',
    description: videoData?.description || '',
    thumbnailUrl: videoData?.thumbnailUrl || '',
    videoUrl: videoData?.videoUrl || '',
    category: videoData?.category || ''
  });

  // Redirect if no video data is present (security check)
  useEffect(() => {
    if (!videoData) {
      navigate(-1);
    }
  }, [videoData, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
 const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/videos/${videoData._id}`, formData, getAuthHeader());
      setToast({ title: "Updated", message: "Video refreshed successfully!" });
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setToast({ title: "Error", message: "Failed to update video details." });
    }
  };

  return (
    <div className="bg-yt-bg min-h-screen p-6">
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-2xl mx-auto bg-yt-surface border border-yt-border rounded-2xl p-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-6 transition-colors font-bold text-sm uppercase">
          <ArrowLeft size={16} /> Back to Channel
        </button>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Edit3 className="text-yt-primary" /> Edit Video Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 aspect-video bg-yt-bg rounded-xl border border-yt-border overflow-hidden">
              <img src={formData.thumbnailUrl} className="w-full h-full object-cover" alt="Current Thumbnail" />
            </div>
            <div className="flex-1 space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-yt-muted uppercase">Thumbnail URL</label>
                 <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-2 rounded-lg text-sm outline-none focus:border-yt-primary" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-yt-muted uppercase">Video URL</label>
                 <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-2 rounded-lg text-sm outline-none focus:border-yt-primary" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-yt-muted uppercase">Category</label>
                 <input name="category" value={formData.category} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-2 rounded-lg text-sm outline-none focus:border-yt-primary" />
               </div>
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-yt-muted uppercase">Title</label>
             <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl font-bold text-yt-text outline-none focus:border-yt-primary" />
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-yt-muted uppercase">Description</label>
             <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl h-40 text-sm outline-none focus:border-yt-primary" />
          </div>

          <button type="submit" className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVideo;