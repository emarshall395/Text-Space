// src/models/Message.ts
import mongoose, { Document, Schema } from 'mongoose';

// IMessage interface that extends Document from Mongoose
export interface IMessage extends Document {
  senderID: string;
  receiverID: string;
  messageID: string;
  content: string;
  createdAt: Date;
}

// Define the message schema
const messageSchema: Schema = new Schema({
  senderID: { type: String, required: true },
  receiverID: { type: String, required: true },
  messageID: { type: String, required: true }, // 
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // 
});

// Export the model
export default mongoose.model<IMessage>('Message', messageSchema);
