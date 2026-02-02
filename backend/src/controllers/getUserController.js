import User from "../models/userModel.js";
// Controller to get the current authenticated user's profile
const getUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch user data, excluding password, and populate all relevant relational data
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "likedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "dislikedVideos",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate("channel")
      .populate("subscribedChannels")
      .populate({
        path: "watchLater",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      })
      .populate({
        path: "watchHistory.video",
        populate: { path: "channel uploader", select: "channelName username avatar" },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure 'id' property is available for frontend compatibility
    const userData = user.toObject();
    userData.id = user._id;

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUserController;