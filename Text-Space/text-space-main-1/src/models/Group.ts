// src/models/Group.ts
import mongoose, { Document, Schema } from 'mongoose';
 
export interface IGroup extends Document {
  groupID: string;
  senderID: string;
  chatMembers: [string];
  content: [string];
  createdAt: Date;
}
 
const groupSchema: Schema = new Schema({
  groupID: { type: String, required: true},
  senderID: { type: String, required: true },
  chatMembers: { type: [String], required: true },
  content: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});
 
export default mongoose.model<IGroup>('Group', groupSchema);
