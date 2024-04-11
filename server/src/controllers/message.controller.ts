import { Request, response } from "express";
import { Chat } from "../models/chat.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { getLocalPath, getStaticFilePath } from "../utils/helper";
import { Message } from "../models/message.model";
import mongoose from "mongoose";
import { emitSocketEvent } from "../socket";
import { ApiResponse } from "../utils/apiResponse";


const messageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        sender: {$first: "$sender"},
      }
    }
  ]
}

const sendMessage = asyncHandler(async (req:any | Request, res) => {
  const chatId = req.query.chatId;
  const { content } = req.body;

  if(!content && !req.files?.attachments?.length){
    throw new ApiError(400, "content is required")
  }

  const selectChat = await Chat.findById(chatId);
  if(!selectChat) {
    throw new ApiError(400, "Chat does not exist")
  }

  const messageFiles:any[] = [];

  if(req.files && req.files.attachments?.length > 0){
    req.files.attachments?.map((attachment:any) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      })
    })
  }
  
  const message = await Message.create({
    sender: new mongoose.Types.ObjectId(req.body.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(chatId),
    attachments: messageFiles,
  })

  
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      }
    },
    { new: true }
  )
  
  // return res.send('mooo');
  const messages = await Message.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id)
      }
    },
    ...messageCommonAggregation(),
  ])

  const receivedMessage = messages[0];

  if(!receivedMessage){
    throw new ApiError(500, "Internal server error")
  }

  chat?.Participants.forEach((participantId) => {
    if(participantId.toString() === req.body.user._id.toString()) return;

    emitSocketEvent(
      req,
      participantId.toString(),
      "messageReceived",
      receivedMessage
    )
  })

  return res
  .status(201)
  .json(new ApiResponse(201, receivedMessage, "message saved successfully", true))


})

const getAllMessages = asyncHandler(async (req:Request | any, res) => {
  const chatId:string = req.query.chatId;
  
  const seletedChat = await Chat.findById(chatId);
  if(!seletedChat) {
    throw new ApiError(400, "Chat does not exist")
  }

  if(!seletedChat.Participants?.includes(req.body.user?._id)){
    throw new ApiError(400, "user is not a part of this chat")
  }

  const messages = await Message.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      }
    },
    ...messageCommonAggregation(),
    {
      $sort: {
        createdAt: 1,
      }
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200, messages, "Messages fatched successfully", true)
  )

})

export {sendMessage, getAllMessages}