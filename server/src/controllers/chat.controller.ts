import { Chat } from "../models/chat.model";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { cloudinaryUpload } from "../utils/cloudinary";
import { messageCommonAggregation } from "./message.controller";
import  mongoose from "mongoose";

const AddParticipantsAggregation = (id:any) => {
  return [
    {
      $lookup: {
        from: "users",
        let: {participants: "$participants"},
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$participants"],
              }
            }
          },
          {
            $match: {
              _id:  {$ne: id}
            }
          },
          {
            $project: {
              username: 1,
              avatar: 1,
              isOnline: 1,
              about: 1,
              _id: 1,
            }
          }
        ],
        as: "participantDetails",
      }
    }
  ]
}

const getAllChats = asyncHandler(async (req, res) => {

  const chats = await Chat.aggregate([
    {
      $match: {
        participants: req.body.user._id
      }
    },
    {
      $lookup: {
        from: "messages",
        let: {id: "$_id"},
        pipeline:[
          {
            $match: {
              $expr: {$eq: ["$chat", "$$id"]}
            }
          },
          ...messageCommonAggregation(),
          {
            $sort: {
              createdAt: 1,
            }
          },
          {
            $addFields: {
              sendTime: {
                $dateToString : {
                  format: "%H:%M", 
                  date: "$createdAt",
                  timezone: "Asia/Kolkata"
                }
              }
            }
          }
        ],
        as: "messages"
      }
    },
    ...AddParticipantsAggregation(req.body.user._id),
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200, chats, "all chats retrieved successfully", true)
  )
})

const createGroupChat = asyncHandler(async(req, res) => {
  const { groupIds, name }= req.body;
  if(groupIds.length < 2) {
    throw new ApiError(400, "Atleast two members is required");
  }

  const participants = [...groupIds, req.body.user._id]
  const newGroupInstence = await Chat.create({
    isGroupChat: true,
    name: name,
    participants: participants,
    admin: req.body.user._id
  })

  const createdGroup = await Chat.aggregate([
    {
      $match: {
        _id: newGroupInstence._id,
      }
    },
    ...AddParticipantsAggregation(req.body.user._id),
    {
      $project: {
        __v: 0,
      }
    }
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(200, createdGroup, "groupCreated", true)
  )

})

const getAllGroupChats = asyncHandler(async(req, res) => {
  const userId = req.body.user._id;

  const groupChats = await Chat.aggregate([
    {
      $match: {
        isGroupChat: true,
        participants: {
          $elemMatch: {
            $eq: userId,
          }
        }
      }
    },
    ...AddParticipantsAggregation(userId),
  ])

  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      groupChats, 
      "groups fetched successfully", 
      true
    )
  )
})

const editGroupAvatar = asyncHandler(async(req, res) => {
  const { user } = req.body;
  const groupId = req.query.groupId;

  console.log(req.file);
  
  const avatarOnLocalPath = req.file?.path;
  if(!avatarOnLocalPath){
    throw new ApiError(401, "avatar is required");
  }
  
  const avatar:any = await cloudinaryUpload(avatarOnLocalPath);
  if(!avatar.url) {
    throw new ApiError(500, "somthing went wrong while uploading avatar")
  }
  

  const updatedGroupAvatar = await Chat.findByIdAndUpdate(
    groupId,
    {
      $set: {
        groupAvatar: {
          localPath: "",
          url: avatar?.url,
        }
      }
    },
    {
      new: true,
    }
  ).select(" -password -refreshToken");
  if(!updatedGroupAvatar) {
    throw new ApiError(500, "Something went wrong while updating avatar")
  }

  //send res
  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      {
        group: updatedGroupAvatar
      },
      "avatar updated successfully",
      true
    )
  )
})

export { getAllChats, createGroupChat, getAllGroupChats, editGroupAvatar }