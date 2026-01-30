async function toggleLikeController(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isAlreadyLiked = user.likedVideos.includes(videoId);
        let update;

        if (isAlreadyLiked) {
            // Simply remove the like
            update = { $pull: { likedVideos: videoId } };
        } else {
            // Add to liked AND ensure it's removed from disliked
            update = { 
                $addToSet: { likedVideos: videoId },
                $pull: { dislikedVideos: videoId } 
            };
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json({ 
            message: isAlreadyLiked ? "Like removed" : "Video liked", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating like", error: error.message });
    }
}
export default toggleLikeController