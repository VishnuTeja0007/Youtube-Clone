import React, { useState, useEffect } from 'react';
import { ListFilter, Pencil, Check, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const CommentSection = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  // Debug logs
  console.log("currentUser:", currentUser);
  console.log("currentUser type:", typeof currentUser);
  
  // Helper for Auth Headers
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/api/comments`, 
        { text: newComment, videoId: videoId },
        getAuthHeader()
      );
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/comments/${id}`,
        { text: editText },
        getAuthHeader()
      );

      // Update local state with the returned updated comment object
      setComments(prevComments => 
        prevComments.map(c => (c._id === id ? response.data : c))
      );
      
      // Close the edit input
      setEditingId(null);
      console.log("Comment updated successfully!");
    } catch (err) {
      console.error("Failed to update comment:", err.response?.data || err.message);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/comments/${id}`, getAuthHeader());
      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="mt-6 border-t border-yt-border pt-6 max-w-4xl bg-yt-bg text-yt-text transition-colors">
      {/* Header */}
      <div className="flex items-center gap-8 mb-6">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
        <button className="text-sm font-medium text-yt-text flex items-center gap-2 hover:bg-yt-surface px-3 py-1 rounded-full transition-colors">
          <ListFilter size={20} /> Sort by
        </button>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 mb-8">
        <img src={currentUser?.avatar} className="h-10 w-10 rounded-full border border-yt-border object-cover" alt="User" />
        <div className="flex-1 group">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-yt-border py-1 focus:border-yt-text outline-none transition-colors text-sm text-yt-text placeholder:text-yt-muted"
          />
          <div className="flex justify-end gap-3 mt-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <button 
              onClick={() => setNewComment("")} 
              className="px-4 py-2 text-sm font-bold text-yt-text hover:bg-yt-surface rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 text-sm font-bold bg-yt-primary text-white rounded-full disabled:bg-yt-surface disabled:text-yt-muted transition-colors"
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
            <img src={comment.user?.avatar} className="h-10 w-10 rounded-full object-cover bg-yt-surface" alt="" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-yt-text">@{comment.user?.username || "user"}</span>
                <span className="text-xs text-yt-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editingId === comment._id ? (
                <div className="flex items-center gap-2 bg-yt-surface p-2 rounded-md border border-yt-primary/30">
                  <input 
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-yt-text"
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(comment._id)}
                  />
                  <button onClick={() => saveEdit(comment._id)} className="text-green-500 hover:bg-green-500/10 p-1 rounded transition-colors">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-yt-primary hover:bg-yt-primary/10 p-1 rounded transition-colors">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="relative pr-10">
                  <p className="text-sm leading-relaxed text-yt-text">{comment.text}</p>
                  {console.log("Current user ID:", currentUser?.id, "Comment user ID:", comment.user?._id)}
                  {console.log(currentUser?.id === comment.user?._id )}
                  {(currentUser?.id === comment.user?._id ) && (
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(comment)}
                        className="p-2 text-yt-muted hover:text-yt-text hover:bg-yt-surface rounded-full transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-2 text-yt-muted hover:text-red-500 hover:bg-yt-surface rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-yt-muted font-bold">
                <button className="hover:text-yt-text transition-colors">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;