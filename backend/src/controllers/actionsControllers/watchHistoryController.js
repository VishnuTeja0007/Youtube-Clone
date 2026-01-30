import userModel from "../../models/userModel.js";

async function setWatchHistory(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required" });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if video is already in watch history
        const existingEntry = user.watchHistory.find(
            entry => entry.video.toString() === videoId
        );

        if (existingEntry) {
            // Update the watchedAt timestamp for existing entry
            existingEntry.watchedAt = new Date();
            await user.save();
        } else {
            // Add new entry to watch history
            user.watchHistory.push({
                video: videoId,
                watchedAt: new Date()
            });
            await user.save();
        }

        res.status(200).json({
            message: "Watch history updated successfully",
            watchHistory: user.watchHistory
        });

    } catch (error) {
        console.error("Watch History Error:", error);
        res.status(500).json({ message: "Error updating watch history", error: error.message });
    }
}

async function removeFromWatchHistory(req, res) {
    try {
        const { videoId } = req.body;
        const { id } = req.user;

        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $pull: { watchHistory: { video: videoId } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Video removed from watch history",
            watchHistory: updatedUser.watchHistory
        });

    } catch (error) {
        console.error("Remove Watch History Error:", error);
        res.status(500).json({ message: "Error removing from watch history", error: error.message });
    }
}

export default setWatchHistory;
export { removeFromWatchHistory };