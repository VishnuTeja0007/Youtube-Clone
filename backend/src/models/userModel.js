import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      // Remove whitespace from both ends of the name string
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Convert email to lowercase and remove whitespace for consistency
    },
    password: {
      type: String,
      required: true,
      select: false,
      // Prevent password from being included in query results by default for security
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

