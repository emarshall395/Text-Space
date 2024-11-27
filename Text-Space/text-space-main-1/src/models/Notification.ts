// src/models/Notification.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IMessage } from './Message';

export interface INotification extends Document {
  userID: string;
  messageID: IMessage['_id'];
  type: string; // e.g., 'mention'
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema({
  userID: { type: String, required: true },
  messageID: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', notificationSchema);

// src/utils/notificationService.ts
import Notification from '../models/Notification';
import Message from '../models/Message';

export const notifyOnMention = async (message: IMessage) => {
  const mentionedUserID = extractMentionedUser(message.content);
  if (mentionedUserID) {
    const notification = new Notification({
      userID: mentionedUserID,
      messageID: message._id,
      type: 'mention',
    });
    await notification.save();
    // Additional logic for push/email notifications can go here
  }
};

const extractMentionedUser = (content: string): string | null => {
  const mentionMatch = content.match(/@(\w+)/);
  return mentionMatch ? mentionMatch[1] : null;
};


