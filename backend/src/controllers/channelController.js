import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";
import bcrypt from "bcryptjs"
/**
 * @desc Create a new channel
 * @route POST /api/channels
 */
export const createChannel = async (req, res) => {
  try {
    console.log(req.body)
    const { channelName, description, channelBanner, uniqueDeleteKey } = req.body;
    const userId = req.user.id;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    if (!uniqueDeleteKey) {
      return res.status(400).json({ message: "Unique delete key is required" });
    }

    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "User already has a channel" });
    }
    const hashedDeleteKey = await bcrypt.hash(uniqueDeleteKey, 10);
    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      uniqueDeleteKey: hashedDeleteKey,
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
    const videos = await Video.find({ channel: id })
      .sort({ createdAt: -1 })
      .populate("channel", "channelName description subscribers")
      .populate("uploader", "username avatar");

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

/**
 * @desc Delete channel
 * @route DELETE /api/channels/:id
 */
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { uniqueDeleteKey } = req.body;
    const userId = req.user.id;
  
    const channel = await Channel.findById(id);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this channel" });
    }

    if (!uniqueDeleteKey || !(await bcrypt.compare(uniqueDeleteKey, channel.uniqueDeleteKey))) {
      return res.status(403).json({ message: "Invalid delete key verification" });
    }

    await Video.deleteMany({ channel: id });
    await Channel.findByIdAndDelete(id);

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting channel", error: error.message });
  }
};

/**
 * @desc Update channel details
 * @route PUT /api/channels/:id
 */
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { channelName, description, channelBanner } = req.body;
    const userId = req.user.id;

    const channel = await Channel.findById(id);
    console.log(channel)
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.owner.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this channel" });
    }

    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner !== undefined) channel.channelBanner = channelBanner;

    const updatedChannel = await channel.save();
    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: "Error updating channel", error: error.message });
  }
};