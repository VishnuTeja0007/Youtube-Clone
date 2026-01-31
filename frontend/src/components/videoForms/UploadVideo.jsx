import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Film } from 'lucide-react';
import Toast from '../Toaster'; 

const CreateVideo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', videoUrl: '', thumbnailUrl: '', category: ''
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
 const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl) {
      return setToast({ title: "Validation Error", message: "Missing required fields." });
    }

    try {
      // The backend uses req.user.id and req.channelId from middleware
      await axios.post('http://localhost:3000/api/videos', formData, getAuthHeader(),{ withCredentials: true });
      setToast({ title: "Success", message: "Video published! Redirecting..." });
      
      // Navigate back to the studio/profile after a short delay
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setToast({ title: "Error", message: err.response?.data?.message || "Failed to upload." });
    }
  };

  return (
    <div className="bg-yt-bg min-h-screen p-6 transition-colors duration-300">
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-5xl mx-auto bg-yt-surface border border-yt-border rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-yt-text uppercase tracking-tighter">
          <Upload className="text-yt-primary" size={28} /> Create New Video
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl focus:border-yt-primary outline-none text-yt-text" placeholder="What's your video about?" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl h-32 outline-none text-yt-text" placeholder="Tell viewers about your video" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input name="videoUrl" placeholder="Video URL*" value={formData.videoUrl} onChange={handleChange} className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none text-yt-text" />
               <input name="thumbnailUrl" placeholder="Thumbnail URL*" value={formData.thumbnailUrl} onChange={handleChange} className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none text-yt-text" />
            </div>

            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl outline-none text-yt-text" />
            
            <button type="submit" className="w-full bg-yt-primary text-white font-black py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-yt-primary/20">
              Publish Video
            </button>
          </form>

          {/* Preview Card */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-yt-muted uppercase">Preview</p>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-yt-border flex items-center justify-center">
              {formData.videoUrl ? <video src={formData.videoUrl} controls className="w-full h-full" /> : <Film className="text-yt-muted" size={48} />}
            </div>
            <div className="p-4 bg-yt-bg rounded-xl border border-yt-border flex gap-4">
               <div className="w-12 h-12 rounded-full bg-yt-surface flex-shrink-0 overflow-hidden border border-yt-border">
                  {formData.thumbnailUrl && <img src={formData.thumbnailUrl} className="w-full h-full object-cover" alt="preview" />}
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-yt-text line-clamp-1">{formData.title || "Untitled Video"}</h4>
                  <p className="text-yt-muted text-xs uppercase font-bold mt-1">{formData.category || "General"}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVideo;