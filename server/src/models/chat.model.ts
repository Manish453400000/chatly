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
  groupAvatar: {
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: `http://res.cloudinary.com/dwl9iesij/image/upload/v1712937945/hjrcp00xeqraszmdjdl1.png`,
      localPath: '',
    }
  },
  lastMessage: {
    type: Types.ObjectId,
    ref: "Message"
  },
  participants: [
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