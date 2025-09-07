import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database connected successfully!"));
    await mongoose.connect(`${process.env.MONGODB_URI}/fitpulse`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;