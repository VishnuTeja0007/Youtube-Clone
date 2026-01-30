import userModel from "../../models/userModel";

async function toggleLikeController(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user; // Assuming id comes from auth middleware

        // 1. Fetch the user to check existing likes
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check if the video is already liked
        // We use .some() for a boolean check (true/false)
        const isAlreadyLiked = user.likedVideos.some(video => video.id === videoId);

        let update;
        let statusMessage;

        if (isAlreadyLiked) {
            // Check version: If it exists, we REMOVE it (Toggle Off)
            update = { $pull: { likedVideos: { id: videoId } } };
            statusMessage = "Video unliked";
        } else {
            // Check version: If it doesn't exist, we ADD it (Toggle On)
            update = { $addToSet: { likedVideos: { id: videoId } } };
            statusMessage = "Video liked";
        }

        // 3. Apply the update
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            update, 
            { new: true }
        );

        res.status(200).json({ 
            message: statusMessage, 
            liked: !isAlreadyLiked,
            user: updatedUser 
        });

    } catch (error) {
        console.error("Like Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default toggleLikeController;