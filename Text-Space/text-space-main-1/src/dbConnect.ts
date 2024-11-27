// Purpose: The purpose of dbConnect is to establish a connection
// for the messagesDB to which message data would be stored in.
// src/dbConnect.ts
import mongoose from 'mongoose';

// Boots up the the database, console shows if connection was a success or not.
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/messagesDB', {
    });
    console.log('MongoDB connected successfully yes');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
