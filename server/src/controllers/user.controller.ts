import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const user = req.body;
})

export { registerUser }