import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, X } from 'lucide-react';

 const SecureDeleteChannel = ({ channelId, onClose }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(channelId)


  const handleDelete = async () => {
    const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/channels/${channelId}`,
      
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: {
        uniqueDeleteKey: key  // Sending key in body as per your controller
      }
      },
       );
      window.location.href = '/'; // Redirect to home after total deletion
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Key");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-yt-bg border border-yt-border w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-6">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>
          <button onClick={onClose} className="text-yt-muted hover:text-yt-text"><X /></button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-yt-text uppercase tracking-tight">Extreme Action</h3>
          <p className="text-yt-muted text-sm">
            Deleting your channel will remove **all videos** and **subscribers** permanently.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-yt-muted uppercase">Enter Unique Delete Key</label>
          <input 
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl text-yt-text outline-none focus:border-yt-primary"
            placeholder="••••••••"
          />
        </div>

        <button 
          onClick={handleDelete}
          disabled={!key || loading}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Confirm Permanent Deletion"}
        </button>
      </div>
    </div>
  );
};
export default SecureDeleteChannel