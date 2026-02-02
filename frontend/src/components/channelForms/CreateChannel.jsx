import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, KeyRound } from 'lucide-react';
import Toast from '../Toaster';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/authSlice';

const CreateChannel = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    channelName: '', description: '', channelBanner: '', uniqueDeleteKey: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Send a POST request to create the new channel with the provided form data

    try {
      const res = await axios.post('http://localhost:3000/api/channels', formData,getAuthHeader(), { withCredentials: true });
      // Update user context to include the new channel ID
      if (user) {
        dispatch(updateUser({ channel: res.data._id }));
      }
      setToast({ title: "Success", message: "Channel created! Redirecting..." });
      setTimeout(() => navigate('/channels'), 1500);
    } catch (err) {
      setToast({ title: "Error", message: err.response?.data?.message || "Creation failed" });
    }
  };

  return (

    <div className="bg-yt-bg min-h-screen p-4 xxs:p-8">
      {/* Show feedback to the user via toast notifications */}
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Layout className="text-yt-primary"/> Start Your Journey</h2>
        
        {/* Banner Preview */}
        <div className="w-full h-32 xxs:h-48 bg-yt-surface rounded-2xl overflow-hidden border border-yt-border">
          {formData.channelBanner ? (
            <img src={formData.channelBanner} className="w-full h-full object-cover" alt="Banner Preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-yt-muted text-xs uppercase font-bold">Banner Preview</div>
          )}
        </div>
          {/* Form for entering channel details and security key */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="Channel Name*" 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none focus:border-yt-primary text-yt-text"
            onChange={(e) => setFormData({...formData, channelName: e.target.value})}
          />
          <textarea 
            placeholder="Tell us about your channel..." 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl h-24 outline-none text-yt-text"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input 
            placeholder="Banner Image URL" 
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none text-yt-text"
            onChange={(e) => setFormData({...formData, channelBanner: e.target.value})}
          />
          
          <div className="p-4 bg-yt-primary/5 border border-yt-primary/20 rounded-xl space-y-2">
            <label className="text-xs font-bold text-yt-primary flex items-center gap-1 uppercase">
              <KeyRound size={14}/> Security Key (For Deletion)
            </label>
            <input 
              type="password"
              placeholder="Enter a key you won't forget" 
              className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none text-yt-text"
              onChange={(e) => setFormData({...formData, uniqueDeleteKey: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest">
            Launch Channel
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateChannel