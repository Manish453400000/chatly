"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editGroupAvatar = exports.getAllGroupChats = exports.createGroupChat = exports.getAllChats = void 0;
const chat_model_1 = require("../models/chat.model");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiError_1 = require("../utils/apiError");
const cloudinary_1 = require("../utils/cloudinary");
const message_controller_1 = require("./message.controller");
const AddParticipantsAggregation = (id) => {
    return [
        {
            $lookup: {
                from: "users",
                let: { participants: "$participants" },
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
                            _id: { $ne: id }
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
    ];
};
const getAllChats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chats = await chat_model_1.Chat.aggregate([
        {
            $match: {
                participants: req.body.user._id
            }
        },
        {
            $lookup: {
                from: "messages",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$chat", "$$id"] }
                        }
                    },
                    ...(0, message_controller_1.messageCommonAggregation)(),
                    {
                        $sort: {
                            createdAt: 1,
                        }
                    },
                    {
                        $addFields: {
                            sendTime: {
                                $dateToString: {
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
    ]);
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, chats, "all chats retrieved successfully", true));
});
exports.getAllChats = getAllChats;
const createGroupChat = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { groupIds, name } = req.body;
    if (groupIds.length < 2) {
        throw new apiError_1.ApiError(400, "Atleast two members is required");
    }
    const participants = [...groupIds, req.body.user._id];
    const newGroupInstence = await chat_model_1.Chat.create({
        isGroupChat: true,
        name: name,
        participants: participants,
        admin: req.body.user._id
    });
    const createdGroup = await chat_model_1.Chat.aggregate([
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
    ]);
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, createdGroup, "groupCreated", true));
});
exports.createGroupChat = createGroupChat;
const getAllGroupChats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.body.user._id;
    const groupChats = await chat_model_1.Chat.aggregate([
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
    ]);
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, groupChats, "groups fetched successfully", true));
});
exports.getAllGroupChats = getAllGroupChats;
const editGroupAvatar = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user } = req.body;
    const groupId = req.query.groupId;
    console.log(req.file);
    const avatarOnLocalPath = req.file?.path;
    if (!avatarOnLocalPath) {
        throw new apiError_1.ApiError(401, "avatar is required");
    }
    const avatar = await (0, cloudinary_1.cloudinaryUpload)(avatarOnLocalPath);
    if (!avatar.url) {
        throw new apiError_1.ApiError(500, "somthing went wrong while uploading avatar");
    }
    const updatedGroupAvatar = await chat_model_1.Chat.findByIdAndUpdate(groupId, {
        $set: {
            groupAvatar: {
                localPath: "",
                url: avatar?.url,
            }
        }
    }, {
        new: true,
    }).select(" -password -refreshToken");
    if (!updatedGroupAvatar) {
        throw new apiError_1.ApiError(500, "Something went wrong while updating avatar");
    }
    //send res
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, {
        group: updatedGroupAvatar
    }, "avatar updated successfully", true));
});
exports.editGroupAvatar = editGroupAvatar;
