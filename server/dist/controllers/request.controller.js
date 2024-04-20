"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFriends = exports.getAllRequest = exports.deleteFriendShip = exports.rejectRequest = exports.acceptRequest = exports.sentRequest = exports.searchUsers = void 0;
const request_model_1 = require("../models/request.model");
const user_model_1 = require("../models/user.model");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const chat_model_1 = require("../models/chat.model");
const socket_1 = require("../socket");
const message_model_1 = require("../models/message.model");
const searchUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const searchQuery = req.query.searchQuery;
    const friendList = req.body.user.friends;
    const pipeline = [
        {
            $match: {
                username: { $regex: `${searchQuery}`, $options: "i", $ne: req.body.user.username }
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
    ];
    const results = await user_model_1.User.aggregate(pipeline).exec();
    const statusCode = results.length < 1 ? 204 : 200;
    const message = results.length < 1 ? "user not found" : "search query successfull";
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(statusCode, results, message, true));
});
exports.searchUsers = searchUsers;
const sentRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const io = req.app.get("io");
    const { _id, username, about, avatar } = req.body?.user;
    const { receiverId } = req.body;
    if (_id && !receiverId) {
        throw new apiError_1.ApiError(400, "ReceiverId is required");
    }
    const existingRequest = await request_model_1.Request.findOne({
        $or: [
            { senderId: _id },
            { receiverId: receiverId }
        ]
    });
    if (existingRequest) {
        throw new apiError_1.ApiError(400, "Request already exists...");
    }
    const receiver = await user_model_1.User.findById(receiverId);
    if (!receiver) {
        throw new apiError_1.ApiError(400, "Invalid receiver id");
    }
    const newRequest = await request_model_1.Request.create({
        senderId: _id,
        receiverId: receiverId,
    });
    const requestData = {
        status: newRequest.status,
        requestId: newRequest._id,
        sender: {
            _id,
            username,
            about,
            avatar,
        }
    };
    // io.to(receiverId.toString()).emit('requestReceived', requestData);
    (0, socket_1.emitSocketEvent)(req, receiverId.toString(), 'requestReceived', requestData);
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "Friend Request Sent", true));
});
exports.sentRequest = sentRequest;
const getAllRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { _id } = req.body.user;
    const pipeline = [
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
                            $expr: { $eq: ["$_id", "$$senderId"] }
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
    ];
    const results = await request_model_1.Request.aggregate(pipeline).exec();
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, results, "requests fetched successfully", true));
});
exports.getAllRequest = getAllRequest;
const acceptRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const io = req.app.get('io');
    const requestId = req.query.requestId;
    const request = await request_model_1.Request.findById(requestId);
    if (!request) {
        throw new apiError_1.ApiError(400, "Request not found");
    }
    if (request.senderId === request.receiverId) {
        throw new apiError_1.ApiError(400, "you can't chat with yourself");
    }
    const receiver = await user_model_1.User.updateOne({ _id: request.receiverId }, { $push: { friends: request.senderId } }, { new: true }).select("username, avatar, isOnline, about, _id");
    const sender = await user_model_1.User.updateOne({ _id: request.senderId }, { $push: { friends: request.receiverId } }, { new: true }).select("username, avatar, isOnline, about, _id");
    const chat = await chat_model_1.Chat.aggregate([
        {
            $match: {
                isGroupChat: false,
                $and: [
                    {
                        participants: {
                            $elemMatch: {
                                $eq: request.receiverId,
                            }
                        }
                    },
                    {
                        participants: {
                            $elemMatch: {
                                $eq: request.senderId,
                            }
                        }
                    }
                ]
            }
        }
    ]);
    if (!chat.length) {
        const participants = [request.senderId, request.receiverId];
        const newChatInstance = await chat_model_1.Chat.create({
            name: 'One on one chat',
            participants: participants,
            admin: request.senderId,
        });
        if (!newChatInstance) {
            throw new apiError_1.ApiError(500, "Something went wrong when creating chat instance");
        }
        console.log(participants);
        console.log("newChat: " + newChatInstance);
    }
    console.log(chat);
    io.to(request.senderId).emit('requestAccepted', receiver);
    io.to(request.receiverId).emit('requestAccepted', sender);
    await request_model_1.Request.findOneAndDelete({ _id: requestId });
    return res.status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "Request accepted", true));
});
exports.acceptRequest = acceptRequest;
const rejectRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const requestId = req.query.requestId;
    await request_model_1.Request.findOneAndDelete({ _id: requestId });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, {}, "requset Rejected", true));
});
exports.rejectRequest = rejectRequest;
const getAllFriends = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const friendId = req.body.user.friends;
    if (friendId.length < 1) {
        return res.json(new apiResponse_1.ApiResponse(200, [], "You dont have friends", true));
    }
    const pipeline = [
        {
            $match: {
                _id: { $in: friendId }
            }
        },
        {
            $lookup: {
                from: "chats",
                let: { friendId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$$friendId", "$participants"] },
                                    { $in: [req.body.user._id, "$participants"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                        }
                    }
                ],
                as: "chatId"
            }
        },
        {
            $project: {
                username: 1,
                avatar: 1,
                isOnline: 1,
                about: 1,
                _id: 1,
                chatId: { $arrayElemAt: ["$chatId._id", 0] },
            }
        }
    ];
    const friends = await user_model_1.User.aggregate(pipeline).exec();
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, friends, "friends fetched successfully", true));
});
exports.getAllFriends = getAllFriends;
const deleteFriendShip = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const friendId = req.query.friendId;
    const userId = req.body.user._id;
    await user_model_1.User.findByIdAndUpdate({ _id: friendId }, { $pull: { friends: userId } }, { new: true });
    await user_model_1.User.findByIdAndUpdate({ _id: userId }, { $pull: { friends: friendId } }, { new: true });
    const chat = await chat_model_1.Chat.findOne({
        isGroupChat: false,
        participants: { $all: [userId, friendId] }
    });
    if (chat) {
        await message_model_1.Message.deleteMany({ chat: chat._id });
        await chat_model_1.Chat.findByIdAndDelete(chat._id);
    }
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, chat, "friend deleted successfully", true));
});
exports.deleteFriendShip = deleteFriendShip;
