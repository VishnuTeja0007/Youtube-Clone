import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPen, Mail, AtSign, ArrowLeft,ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/userContext'; // Adjust based on your context path
import Toast from '../Toaster';

const UpdateProfile = () => {
  const { user, setUser } = useAuth(); // 'login' usually updates the local user state
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/api/auth/update', formData, {
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });

      setToast({ title: "Success", message: "Profile updated successfully!" });
      
      // Update global context so the header avatar changes immediately
      if (setUser) setUser(res.data.user); 

      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setToast({ 
        title: "Update Error", 
        message: err.response?.data?.message || "Failed to update profile." 
      });
    }
  };

  return (
    <div className="bg-yt-bg min-h-screen p-4 xs:p-8 transition-colors duration-300">
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-6 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Cancel
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-3xl p-6 xxs:p-10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-yt-text uppercase tracking-tighter">
            <UserPen className="text-yt-primary" size={28} /> Personal Info
          </h2>

          {/* Live Preview Circle */}
          <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="relative group">
              <img 
                src={formData.avatar || 'https://via.placeholder.com/150'} 
                className="w-28 h-28 rounded-full border-4 border-yt-bg object-cover shadow-xl transition-transform group-hover:scale-105"
                alt="Avatar Preview" 
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <span className="text-[10px] text-white font-black uppercase">Preview</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-yt-text font-bold text-lg">{formData.username || "Username"}</p>
              <p className="text-yt-muted text-xs">{formData.email || "email@example.com"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yt-muted uppercase ml-1 flex items-center gap-2">
                <AtSign size={14} /> Display Name
              </label>
              <input 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium"
                placeholder="How should we call you?"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yt-muted uppercase ml-1 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium"
                placeholder="yourname@example.com"
              />
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-yt-muted uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={14} /> Avatar Image URL
              </label>
              <input 
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-2xl outline-none focus:border-yt-primary text-yt-text font-medium"
                placeholder="https://images.com/my-photo.png"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-yt-text text-yt-bg font-black py-5 rounded-2xl hover:opacity-90 transition-all uppercase tracking-[0.2em] mt-4 shadow-lg shadow-black/10"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;