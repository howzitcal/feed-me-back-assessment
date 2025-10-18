import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!MONGO_URI || !MONGO_URI.startsWith("mongo")) {
    throw Error("MONGO_URI is either not defined or is invalid.");
  }

  await mongoose.connect(MONGO_URI);
};
