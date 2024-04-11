import { pipeline } from "stream";
import { Chat } from "../models/chat.model";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

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

export { getAllChats }