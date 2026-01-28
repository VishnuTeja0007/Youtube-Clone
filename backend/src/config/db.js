import mongoose from "mongoose";


//comment
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

export default connectDB;

