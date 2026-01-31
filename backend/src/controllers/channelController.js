import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

/**
 * @desc Create a new channel
 * @route POST /api/channels
 */
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    const userId = req.user.id;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "User already has a channel" });
    }

    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: userId,
    });

    const savedChannel = await newChannel.save();
    res.status(201).json(savedChannel);
  } catch (error) {
    res.status(500).json({ message: "Error creating channel", error: error.message });
  }
};

/**
 * @desc Get all channels
 * @route GET /api/channels
 */
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate("owner", "username avatar");
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
};

/**
 * @desc Get channel by ID
 * @route GET /api/channels/:id
 */

export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch the channel and populate the owner's details
    const channel = await Channel.findById(id).populate("owner", "username avatar email");

    // Check if channel exists
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // 2. Fetch all videos belonging to this channel
    // We sort by 'createdAt' descending so newest videos appear first
    const videos = await Video.find({ channel: id }).sort({ createdAt: -1 });

    // 3. Send the combined data
    res.status(200).json({
      success: true,
      channel, // This already contains 'owner' due to .populate()
      videos,
      videoCount: videos.length
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching channel details", 
      error: error.message 
    });
  }
};