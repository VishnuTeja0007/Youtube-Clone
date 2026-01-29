import mongoose from "mongoose";
import channelModel from "../models/channelModel.js";
import commentModel from "../models/commentModel.js"
// import likeModel from "../models/likeModel.js"
import videoModel from "../models/videoModel.js"
//comment

const userId = "6979f90ec25d643bf2fbb348";

const connectDB = async () => {
  try {
    //comment
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    //comment
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    //comment
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

async function addData() {
  try {
    console.log("🚀 Starting data seeding...");

    // 1. Clear existing data (Optional: remove if you want to keep old data)
    await channelModel.deleteMany({ owner: userId });
    await videoModel.deleteMany({ uploader: userId });
    await commentModel.deleteMany({ user: userId });

    // 2. Create Channels
    const channels = await channelModel.insertMany([
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb401"),
        channelName: "Siva Tech Reviews",
        description: "Unboxing the latest tech and gadgets in 2026.",
        channelBanner: "https://picsum.photos/id/1/1200/300",
        subscribers: 12500,
        owner: userId,
      },
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb402"),
        channelName: "Siva Vlogs",
        description: "Daily life, travel, and behind the scenes.",
        channelBanner: "https://picsum.photos/id/2/1200/300",
        subscribers: 4300,
        owner: userId,
      }
    ]);

    console.log("✅ Channels created");

    // 3. Create Videos
    const videos = await videoModel.insertMany([
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb501"),
        title: "React 19 & Tailwind 4: The Ultimate Guide",
        description: "Everything you need to know about the new v4.1 engine.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/id/180/640/360",
        category: "Education",
        views: 45600,
        likes: 3200,
        channel: channels[0]._id,
        uploader: userId
      },
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb502"),
        title: "24 Hours in Dharmavaram - Travel Vlog",
        description: "Exploring local landscapes.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnailUrl: "https://picsum.photos/id/10/640/360",
        category: "Travel",
        views: 1200,
        likes: 450,
        channel: channels[1]._id,
        uploader: userId
      },
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb503"),
        title: "LIVE: Coding a YouTube Clone with Gemini 3",
        description: "Real-time coding session.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/id/60/640/360",
        category: "Education | LIVE",
        views: 890,
        likes: 120,
        channel: channels[0]._id,
        uploader: userId
      },
      {
        _id: new mongoose.Types.ObjectId("6979f90ec25d643bf2fbb504"),
        title: "My Morning Routine in 2026",
        description: "Productivity hacks.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnailUrl: "https://picsum.photos/id/20/640/360",
        category: "Vlog",
        views: 25000,
        likes: 1800,
        channel: channels[1]._id,
        uploader: userId
      }
    ]);

    console.log("✅ Videos created");

    // 4. Create Comments
    await commentModel.insertMany([
      { text: "Great tutorial! The transition to v4.1 was so easy.", video: videos[0]._id, user: userId },
      { text: "Thanks for joining the stream everyone!", video: videos[2]._id, user: userId },
      { text: "The camera quality on this vlog is insane.", video: videos[1]._id, user: userId },
      { text: "Morning routines are the best.", video: videos[3]._id, user: userId }
    ]);

    console.log("✅ Comments created");
    console.log("✨ Seeding complete!");

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  }
}

// addData()

export default connectDB;

