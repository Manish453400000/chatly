import { Request } from "../models/request.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const searchUsers = asyncHandler(async (req, res) => {
  const searchQuery = req.query.searchQuery;
  const pipeline = [
    {
      $match: {
        username: {$regex: `${searchQuery}`, $options: "i"}
      }
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        id: 1,
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
  const senderId = req.body?.user._id;
  const { receiverId } = req.body;
  if(senderId && !receiverId) {
    throw new ApiError(400, "ReceiverId is required")
  }

  const io = req.app.get("io");

  const receiver = await User.findById(receiverId);
  if(!receiver) {
    throw new ApiError(400, "Invalid receiver id")
  }

  const newRequest = await Request.create(
    {
      sender: senderId,
      receiver: receiverId,
    }
  )

  io.emit('requestReceived', newRequest );


  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, "Friend Request Sent", true)
  )
})
const acceptRequest = asyncHandler(async (req, res) => {

})
const rejectRequest = asyncHandler(async (req, res) => {

})

export { searchUsers, sentRequest, acceptRequest, rejectRequest }