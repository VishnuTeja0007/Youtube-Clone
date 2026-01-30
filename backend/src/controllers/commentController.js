import Comment from "../models/commentModel.js";

/**
 * @desc Get all comments for a specific video
 * @route GET /api/comments/:videoId
 */
export const getAllComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    // We find comments by video ID and 'populate' the user field 
    // to get the username and avatar for the UI.
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username avatar") 
      .sort({ createdAt: -1 }); // Newest comments first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

/**
 * @desc Handle inline comment edits (Pencil/Tick logic)
 * @route PATCH /api/comments/:id
 */
export const handleCommentEdits = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Update the comment text and return the updated document
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    ).populate("user", "username avatar");

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};