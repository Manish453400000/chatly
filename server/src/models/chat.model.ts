import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  lastMessage: {
    type: Types.ObjectId,
    ref: "Message"
  },
  Participants: [
    {
      type: Types.ObjectId,
      ref: "User",
    }
  ],
  admin: {
    type: Types.ObjectId,
    ref: 'User'
  },
  
}, {timestamps: true})

export const Chat = model('Chat', chatSchema);