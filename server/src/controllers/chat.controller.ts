import { pipeline } from "stream";
import { Chat } from "../models/chat.model";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

const AddParticipantsAggregation = (id:any) => {
  return [
    {
      $lookup: {
        from: "users",
        // foreignField: "_id",
        // localField: "participants",
        let: {participants: "$Participants"},
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
        Participants: req.body.user._id
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
    Participants: participants,
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
        Participants: {
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

export { getAllChats, createGroupChat, getAllGroupChats }