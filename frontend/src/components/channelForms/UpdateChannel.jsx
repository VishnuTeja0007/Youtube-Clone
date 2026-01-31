import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Toast from '../Toaster';

const UpdateChannel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // Extract channel data passed from the ChannelProfile state
  const channelData = location.state?.channel;

  const [formData, setFormData] = useState({
    channelName: channelData?.channelName || '',
    description: channelData?.description || '',
    channelBanner: channelData?.channelBanner || '',
  });

  // Security: Redirect if accessed without channel data
  useEffect(() => {
    if (!channelData) {
      navigate(-1);
    }
  }, [channelData, navigate]);
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Logic matches your updateChannel controller (PUT /api/channels/:id)
      await axios.put(`http://localhost:3000/api/channels/${channelData._id}`, formData, getAuthHeader(), {
        withCredentials: true
      });
      
      setToast({ title: "Updated", message: "Channel details refreshed successfully!" });
      
      // Return to the channel profile after a brief delay to show success
      setTimeout(() => navigate(`/channel/${channelData._id}`), 1500);
    } catch (err) {
      setToast({ 
        title: "Update Error", 
        message: err.response?.data?.message || "Failed to save changes." 
      });
    }
  };

  return (
    <div className="bg-yt-bg min-h-screen p-4 xs:p-8 transition-colors duration-300">
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-2xl p-6 xxs:p-10 shadow-xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-yt-text uppercase tracking-tighter">
            <Edit3 className="text-yt-primary" size={28} /> Customize Channel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Banner Preview & Input */}
            <div className="space-y-3">
              <label className="text-xs font-black text-yt-muted uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={14} /> Channel Banner URL
              </label>
              <div className="relative w-full h-32 xxs:h-48 bg-yt-bg rounded-xl overflow-hidden border border-yt-border group">
                {formData.channelBanner ? (
                  <img 
                    src={formData.channelBanner} 
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" 
                    alt="Banner Preview" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yt-muted text-[10px] font-bold">NO BANNER SET</div>
                )}
              </div>
              <input 
                name="channelBanner"
                value={formData.channelBanner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl text-sm outline-none focus:border-yt-primary text-yt-text"
              />
            </div>

            {/* 2. Channel Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yt-muted uppercase ml-1">Channel Name</label>
              <input 
                name="channelName"
                value={formData.channelName}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl font-bold text-lg outline-none focus:border-yt-primary text-yt-text"
              />
            </div>

            {/* 3. Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yt-muted uppercase ml-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl h-40 text-sm outline-none focus:border-yt-primary text-yt-text leading-relaxed"
                placeholder="Describe your channel to your audience..."
              />
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              className="w-full bg-yt-text text-yt-bg font-black py-5 rounded-xl hover:opacity-90 transition-all uppercase tracking-[0.2em] shadow-lg shadow-black/10"
            >
              Update Channel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateChannel;