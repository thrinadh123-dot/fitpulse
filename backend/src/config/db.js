import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database connected successfully!"));
    mongoose.connection.on('error', (err) => console.log("Database connection error:", err));
    
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(`${process.env.MONGODB_URI}/fitpulse`, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    // Don't exit process, let the server start even if DB fails (optional, but good for debugging)
  }
};

export default connectDB;
