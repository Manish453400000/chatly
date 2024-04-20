"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.getUser = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = require("../models/user.model.js");
const apiError_js_1 = require("../utils/apiError.js");
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const constants_js_1 = require("../utils/constants.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const cloudinary_js_1 = require("../utils/cloudinary.js");
const generateTokens = async (userId) => {
    try {
        const user = await user_model_js_1.User.findById(userId);
        const accessToken = await user.generateAccessToken(); //err in this part
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new apiError_js_1.ApiError(500, "Somthing went wrong while generating tokens");
    }
};
//controllers start here
const registerUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { email, password, username, role } = req.body;
    const existedUser = await user_model_js_1.User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new apiError_js_1.ApiError(409, "User with email or username already exists", []);
    }
    const user = await user_model_js_1.User.create({
        email,
        password,
        username,
        isEmailVerified: false,
        role: role || constants_js_1.userRolesEnum.USER,
    });
    const { accessToken, refreshToken } = await generateTokens(user._id);
    if (!accessToken || !refreshToken) {
        throw new apiError_js_1.ApiError(500, "Failed to generate tokens");
    }
    const createdUser = await user_model_js_1.User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse_js_1.ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User created successfully", true));
});
exports.registerUser = registerUser;
const loginUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new apiError_js_1.ApiError(403, "username or password is required");
    }
    const user = await user_model_js_1.User.findOne({ username });
    if (!user) {
        throw new apiError_js_1.ApiError(400, "User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError_js_1.ApiError(400, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = await generateTokens(user._id);
    const logedInUser = await user_model_js_1.User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse_js_1.ApiResponse(200, { user: logedInUser, accessToken, refreshToken }, "User loged in successfully", true));
});
exports.loginUser = loginUser;
const logoutUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { user } = req.body;
    await user_model_js_1.User.findByIdAndUpdate(user._id, {
        $set: {
            refreshToken: '',
        }
    }, { new: true });
    const options = {
        httpOnly: true,
        SamSite: 'None',
        secure: process.env.NODE_ENV === 'production',
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse_js_1.ApiResponse(200, {}, "User logged out successfully", true));
});
exports.logoutUser = logoutUser;
const uploadAvatar = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { user } = req.body;
    console.log(req.file);
    const avatarOnLocalPath = req.file?.path;
    if (!avatarOnLocalPath) {
        throw new apiError_js_1.ApiError(401, "avatar is required");
    }
    const avatar = await (0, cloudinary_js_1.cloudinaryUpload)(avatarOnLocalPath);
    if (!avatar.url) {
        throw new apiError_js_1.ApiError(500, "somthing went wrong while uploading avatar");
    }
    const updatedUser = await user_model_js_1.User.findByIdAndUpdate(user?._id, {
        $set: {
            avatar: {
                localPath: "",
                url: avatar?.url,
            }
        }
    }, {
        new: true,
    }).select(" -password -refreshToken");
    if (!updatedUser) {
        throw new apiError_js_1.ApiError(500, "Something went wrong while updating avatar");
    }
    //send res
    return res
        .status(200)
        .json(new apiResponse_js_1.ApiResponse(200, {
        user: updatedUser
    }, "avatar updated successfully", true));
});
exports.uploadAvatar = uploadAvatar;
const refreshAccessToken = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new apiError_js_1.ApiError(401, "Unauthorized request");
    }
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        throw new apiError_js_1.ApiError(500, "Somthing went wrong accessing server secret");
    }
    const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, refreshTokenSecret);
    const user = await user_model_js_1.User.findById(decodedToken?._id);
    if (!user) {
        throw new apiError_js_1.ApiError(401, "Invalid refresh token");
    }
    // cheack if the refresh token has expired or used
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new apiError_js_1.ApiError(401, "Refresh token has expired or used");
    }
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new apiResponse_js_1.ApiResponse(200, {
        accessToken, refreshToken: newRefreshToken
    }, "Access Token refreshed", true));
});
exports.refreshAccessToken = refreshAccessToken;
const getUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { user } = req.body;
    const { accessToken, refreshToken } = await generateTokens(user._id);
    const refreshdUser = await user_model_js_1.User.findByIdAndUpdate(user._id, { refreshToken: refreshToken, }).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: false
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse_js_1.ApiResponse(200, { user: refreshdUser, accessToken: accessToken, refreshToken: refreshToken }, "user successfully authenticated", true));
});
exports.getUser = getUser;
