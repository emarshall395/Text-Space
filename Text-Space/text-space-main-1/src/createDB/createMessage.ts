// Purpose: The purpose of this file is to generate a message 
// into the database once a connection has been established.
// createDB/createMessage.ts
import mongoose from 'mongoose';
import connectDB from '../dbConnect'; // Import the connection module

// Connect to the 'messagesDB' database
const createMessage = async () => {
  await connectDB(); // Connect to MongoDB

  // Define the Message schema
  const messageSchema = new mongoose.Schema({
    senderID: { type: String, required: true },
    receiverID: { type: String, required: true },
    messageID: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  // Create the Message model for messages.
  const Message = mongoose.model('Message', messageSchema);

  try {
    // Follows the same schema of the message.
    const newMessage = new Message({
      senderID: 'user123',
      receiverID: 'user456',
      messageID: 'msg001', // Use a unique messageID
      content: 'Hello, this is a test message!',
      createdAt: new Date(),
    });

    //Saves the message into the data base.
    const savedMessage = await newMessage.save();
    console.log('Message created:', savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

createMessage();
