import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not Set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);  
  }
};
