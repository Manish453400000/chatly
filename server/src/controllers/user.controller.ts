import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userRolesEnum } from "../utils/constants.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cloudinaryUpload } from '../utils/cloudinary.js';
import { CookieOptions } from 'express';

const generateTokens = async (userId: Types.ObjectId) => {
  try {
    const user:any = await User.findById(userId);
    
    const accessToken = await user.generateAccessToken(); //err in this part
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };

  } catch (err) {
    throw new ApiError(500, "Somthing went wrong while generating tokens")
  }
}
//controllers start here
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{username}, {email}],
  })
  if(existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
    role: role || userRolesEnum.USER,
  })
  const {accessToken, refreshToken} = await generateTokens(user._id)
  if(!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens")
  }
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  const options:CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  }
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(201, { user: createdUser, accessToken, refreshToken}, "User created successfully", true) 
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    throw new ApiError(403, "username or password is required")
  }
  
  const user:any = await User.findOne({username})
  if(!user) {
    throw new ApiError(400, "User not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    throw new ApiError(400, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);
  
  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options:CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'none'
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {user: logedInUser, accessToken, refreshToken},
      "User loged in successfully",
      true
    )
  )
})

const logoutUser = asyncHandler(async (req, res) => {
  const { user } = req.body;
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: '',
      }
    },
    { new: true }
  )

  const options:CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production', 
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(
      200,
      {},
      "User logged out successfully",
      true
    )
  )
})

const uploadAvatar = asyncHandler(async (req, res) => {
  const { user } = req.body;

  console.log(req.file);
  
  const avatarOnLocalPath = req.file?.path;
  if(!avatarOnLocalPath){
    throw new ApiError(401, "avatar is required");
  }
  
  const avatar:any = await cloudinaryUpload(avatarOnLocalPath);
  if(!avatar.url) {
    throw new ApiError(500, "somthing went wrong while uploading avatar")
  }
  

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        avatar: {
          localPath: "",
          url: avatar?.url,
        }
      }
    },
    {
      new: true,
    }
  ).select(" -password -refreshToken");
  if(!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating avatar")
  }

  //send res
  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      {
        user: updatedUser
      },
      "avatar updated successfully",
      true
    )
  )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }
  
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if(!refreshTokenSecret) {
    throw new ApiError(500, "Somthing went wrong accessing server secret")
  }
  const decodedToken:any = jwt.verify(
    incomingRefreshToken,
    refreshTokenSecret,
  )

  const user = await User.findById(decodedToken?._id)
  if(!user) {
    throw new ApiError(401, "Invalid refresh token")
  }

  // cheack if the refresh token has expired or used
  if(incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token has expired or used")
  }
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };; 

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id)

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        accessToken, refreshToken: newRefreshToken
      },
      "Access Token refreshed",
      true
    )
  )
})

const getUser = asyncHandler(async(req, res) => {
  const { user } = req.body;
  const { accessToken, refreshToken } = await generateTokens(user._id);
  const refreshdUser = await User.findByIdAndUpdate(user._id, {refreshToken: refreshToken,}).select("-password -refreshToken")
  const options:CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200, 
      {user: refreshdUser, accessToken: accessToken, refreshToken: refreshToken}, 
      "user successfully authenticated", 
      true
    )
  )
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, getUser, uploadAvatar }