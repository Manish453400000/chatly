import { request } from "http";
import { Request } from "../models/request.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Types } from "mongoose";


const searchUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const friendList:string[] = req.body.user.friends;
  const pipeline = [
    {
      $match: {
        username: {$regex: `${searchQuery}`, $options: "i", $ne: req.body.user.username }
      }
    },
    {
      $addFields: {
        isFriend: {
          $cond: {
            if: { $in: ["$_id", friendList] }, // Check if _id exists in alreadyfriend array
            then: true, // If it exists, user is a friend
            else: false // If it doesn't exist, user is not a friend
          }
        }
      }
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        about: 1,
        _id: 1,
        isFriend: 1,
      }
    },
    {
      $limit: 20,
    }
  ]
  const results = await User.aggregate(pipeline).exec()
  const statusCode = results.length < 1 ? 204 : 200;
  const message = results.length < 1 ? "user not found": "search query successfull"
  return res
  .status(200)
  .json(
    new ApiResponse(statusCode, results, message, true)
  )
})

const sentRequest = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const {_id, username, about, avatar} = req.body?.user;
  const { receiverId } = req.body;

  if(_id && !receiverId) {
    throw new ApiError(400, "ReceiverId is required")
  }

  const existingRequest = await Request.findOne({
    $or: [
      { senderId: _id},
      { receiverId: receiverId}
    ]
  })
  if(existingRequest) {
    throw new ApiError(400, "Request already exists...")
  }

  const receiver = await User.findById(receiverId);
  if(!receiver) {
    throw new ApiError(400, "Invalid receiver id")
  }

  const newRequest = await Request.create(
    {
      senderId: _id,
      receiverId: receiverId,
    }
  )

  const requestData = {
    status: newRequest.status,
    requestId: newRequest._id,
    sender: {
      _id,
      username,
      about,
      avatar,
    }
  }

  io.to(receiverId.toString()).emit('requestReceived', requestData);

  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, "Friend Request Sent", true)
  )
})

const getAllRequest = asyncHandler(async (req, res) => {
  const { _id } = req.body.user;

  const pipeline: any[] = [
    {
      $match: {
        receiverId: _id,
      }
    },
    {
      $addFields: {
        senderObjectId: { $toObjectId: "$senderId" },
      }
    },
    {
      $lookup: {
        from: "users", // collection name
        let: { senderId: "$senderObjectId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$senderId"]}
              // username: {$regex: /manish9062/i}
            }
          }
        ],
        as: "senderInfo", // Alias for the joined documents
      }
    },
    {
      $unwind: "$senderInfo" //unwind the array created by lookup
    },
    {
      $project: {
        status: "$status",
        requestId: "$_id",
        _id: 0,
        sender: {
          username: "$senderInfo.username",
          avatar: "$senderInfo.avatar",
          about: "$senderInfo.about",
          _id: "$_id",
        }
        // "senderInfo.username": 1, // Project fields from senderInfo object
        // "senderInfo.avatar": 1,
        // "senderInfo.about": 1,
        // "senderInfo._id": 1
      }
    }
  ]

  const results = await Request.aggregate(pipeline).exec();
  
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      results,
      "requests fetched successfully",
      true,
    )
  )

})

const acceptRequest = asyncHandler(async (req, res) => {
  const io = req.app.get('io');
  const requestId = req.query.requestId;

  // res.json({requestId})

  const request:any = await Request.findById(requestId);
  // if(!request){
  //   throw new ApiError(400, "Request not found")
  // }

  const receiver = await User.updateOne(
    {_id: request.receiverId},
    {$push: {friends: request.senderId}},
    {new: true}
  ).select("username, avatar, about, _id")
  const sender = await User.updateOne(
    {_id: request.senderId},
    {$push: {friends: request.receiverId}},
    {new: true}
  ).select("username, avatar, about, _id")

  io.to(request.senderId).emit('requestAccepted', receiver)
  io.to(request.receiverId).emit('requestAccepted', sender);

  const dreq = await Request.findOneAndDelete({_id: requestId})

  return res.status(200)
  .json(
    new ApiResponse(
      200,
      {dreq},
      "Request accepted",
      true
    )
  )
  
})

const rejectRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.requestId;

  await Request.findOneAndDelete({_id: requestId});
  res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "requset Rejected",
      true
    )
  )
})

const getAllFriends = asyncHandler(async (req, res) => {
  const friendId = req.body.user.friends;
  if(friendId.length < 1) {
    return res.json(
      new ApiResponse(
        200,
        [],
        "You dont have friends",
        true
      )
    )
  }

  const pipeline = [
    {
      $match: {
        _id: { $in: friendId}
      }
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        about: 1,
        _id: 1
      }
    }
  ]
  const friends = await User.aggregate(pipeline).exec();
  
  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      friends,
      "friends fetched successfully",
      true
    )
  )

})

export { searchUsers, sentRequest, acceptRequest, rejectRequest, getAllRequest, getAllFriends }