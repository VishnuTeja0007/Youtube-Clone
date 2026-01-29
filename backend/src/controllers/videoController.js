import Video from "../models/videoModel.js";
export const getAllVideos = async (req,res) => {
     try {
        const videos = await Video.find()
      .populate("channel", "channelName")
      .populate("uploader", "username")
      .sort({ createdAt: -1 }); // newest first
    if(videos.length==0){
        return res.status(404).json({ message: "No videos found" });
    }
    return res.status(200).json(videos);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getVideoById = async (req,res) => {
    try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName description subscribers")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};