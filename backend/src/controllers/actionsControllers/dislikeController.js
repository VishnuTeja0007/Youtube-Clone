async function toggleDislikeController(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isAlreadyDisliked = user.dislikedVideos.includes(videoId);
        let update;

        if (isAlreadyDisliked) {
            // Simply remove the dislike
            update = { $pull: { dislikedVideos: videoId } };
        } else {
            // Add to disliked AND ensure it's removed from liked
            update = { 
                $addToSet: { dislikedVideos: videoId },
                $pull: { likedVideos: videoId } 
            };
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json({ 
            message: isAlreadyDisliked ? "Dislike removed" : "Video disliked", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating dislike", error: error.message });
    }
}
export default toggleDislikeController