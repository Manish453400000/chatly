import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema({
  content: String,
  attachments: {
    type:[
      {
        url: String, // cloudinary url
        localPath: String,
      }
    ],
    default: [],
  },
  sender: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  chat: {
    type: Types.ObjectId,
    ref: 'Chat', 
    required: true
  },
}, {timestamps: true})

export const Message = model('Message', messageSchema);