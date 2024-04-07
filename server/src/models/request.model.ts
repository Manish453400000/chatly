import { Schema, model, Types } from "mongoose";

const requestSchema = new Schema({
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"],
  },
  senderId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {timestamps: true})

export const Request = model('Request', requestSchema);