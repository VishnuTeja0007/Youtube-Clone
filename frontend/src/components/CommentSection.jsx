import React, { useState, useEffect } from 'react';
import { ListFilter, MoreVertical, Pencil, Check, X, UserCircle } from 'lucide-react';
import axios from 'axios';

const CommentSection = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch comments for this video
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      _id: Date.now().toString(), // Simulation
      text: newComment,
      user: currentUser,
      createdAt: new Date().toISOString()
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = (id) => {
    setComments(comments.map(c => c._id === id ? { ...c, text: editText } : c));
    setEditingId(null);
  };

  return (
    <div className="mt-6 border-t border-yt-border pt-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-8 mb-6">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
        <button className="text-sm font-medium text-yt-text flex items-center gap-2">
          <ListFilter size={20} /> Sort by
        </button>
      </div>

      {/* Input Section */}
      <div className="flex gap-4 mb-8">
        <img src={currentUser?.avatar} className="h-10 w-10 rounded-full border border-yt-border" alt="" />
        <div className="flex-1 group">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-yt-border py-1 focus:border-yt-text outline-none transition-colors text-sm"
          />
          <div className="flex justify-end gap-3 mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <button onClick={() => setNewComment("")} className="px-4 py-2 text-sm font-bold hover:bg-yt-surface rounded-full">Cancel</button>
            <button 
              onClick={handleAddComment}
              disabled={!newComment}
              className="px-4 py-2 text-sm font-bold bg-yt-primary text-white rounded-full disabled:bg-yt-surface disabled:text-yt-muted"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            <img src={comment.user?.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold">@{comment.user?.username || "user"}</span>
                <span className="text-xs text-yt-muted">1 day ago</span>
              </div>

              {editingId === comment._id ? (
                /* EDIT MODE: To-do list style with Tick and X */
                <div className="flex items-center gap-2 bg-yt-surface p-2 rounded-md border border-yt-primary/30">
                  <input 
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button onClick={() => saveEdit(comment._id)} className="text-green-500 hover:bg-green-500/10 p-1 rounded">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-yt-primary hover:bg-yt-primary/10 p-1 rounded">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                /* VIEW MODE */
                <div className="relative pr-10">
                  <p className="text-sm leading-relaxed text-yt-text">{comment.text}</p>
                  
                  {/* Edit Pencil - Visible on hover if it's the current user's comment */}
                  <button 
                    onClick={() => startEdit(comment)}
                    className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-yt-muted hover:text-yt-text"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}

              {/* Interaction simulation */}
              <div className="flex items-center gap-4 mt-2 text-xs text-yt-muted font-bold">
                <button className="hover:text-yt-text">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;