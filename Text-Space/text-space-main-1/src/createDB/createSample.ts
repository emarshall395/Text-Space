// Purpose: The purpose of this file is to generate multiple elements of
// messages into the data base. 
// createDB/createSample.ts
import mongoose from 'mongoose';
import connectDB from '../dbConnect'; // Import the connection module

// Connect to the 'messagesDB' database
const createSampleMessages = async () => {
  await connectDB(); // Connect to MongoDB

  // Define the Message schema to follow consistent structure.
  const messageSchema = new mongoose.Schema({
    senderID: { type: String, required: true },
    receiverID: { type: String, required: true },
    messageID: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  // Create the Message model
  const Message = mongoose.model('Message', messageSchema);

  try {
    await Message.deleteMany({}); // Clear any existing documents

    const messages = [
      {
        senderID: 'user123',
        receiverID: 'user456',
        messageID: 'msg002', // Use a unique messageID
        content: 'Hey, just checking in!',
        createdAt: new Date(),
      },
      {
        senderID: 'user456',
        receiverID: 'user123',
        messageID: 'msg003',
        content: "Hello! I'm doing well, thanks for asking.",
        createdAt: new Date(),
      },
      {
        senderID: 'user789',
        receiverID: 'user123',
        messageID: 'msg004',
        content: 'Are you free to catch up tomorrow?',
        createdAt: new Date(),
      },
    ];

    //Saves the messages into the data base.
    const savedMessages = await Message.insertMany(messages);
    console.log('Sample messages created:', savedMessages);
  } catch (error) {
    console.error('Error creating sample messages:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

createSampleMessages();
