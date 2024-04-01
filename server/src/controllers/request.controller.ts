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

export { searchUsers }