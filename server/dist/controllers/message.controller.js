"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.sendMessage = exports.messageCommonAggregation = void 0;
const chat_model_1 = require("../models/chat.model");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const helper_1 = require("../utils/helper");
const message_model_1 = require("../models/message.model");
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../socket");
const apiResponse_1 = require("../utils/apiResponse");
const messageCommonAggregation = () => {
    return [
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            }
        }
    ];
};
exports.messageCommonAggregation = messageCommonAggregation;
const sendMessage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chatId = req.query.chatId;
    const { content } = req.body;
    if (!content && !req.files?.attachments?.length) {
        throw new apiError_1.ApiError(400, "content is required");
    }
    const selectChat = await chat_model_1.Chat.findById(chatId);
    if (!selectChat) {
        throw new apiError_1.ApiError(400, "Chat does not exist");
    }
    const messageFiles = [];
    if (req.files && req.files.attachments?.length > 0) {
        req.files.attachments?.map((attachment) => {
            messageFiles.push({
                url: (0, helper_1.getStaticFilePath)(req, attachment.filename),
                localPath: (0, helper_1.getLocalPath)(attachment.filename),
            });
        });
    }
    const message = await message_model_1.Message.create({
        sender: new mongoose_1.default.Types.ObjectId(req.body.user._id),
        content: content || "",
        chat: new mongoose_1.default.Types.ObjectId(chatId),
        attachments: messageFiles,
    });
    const chat = await chat_model_1.Chat.findByIdAndUpdate(chatId, {
        $set: {
            lastMessage: message._id,
        }
    }, { new: true });
    // return res.send('mooo');
    const messages = await message_model_1.Message.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(message._id)
            }
        },
        ...(0, exports.messageCommonAggregation)(),
    ]);
    const receivedMessage = messages[0];
    if (!receivedMessage) {
        throw new apiError_1.ApiError(500, "Internal server error");
    }
    chat?.participants.forEach((participantId) => {
        if (participantId.toString() === req.body.user._id.toString())
            return;
        (0, socket_1.emitSocketEvent)(req, participantId.toString(), "messageReceived", receivedMessage);
    });
    return res
        .status(201)
        .json(new apiResponse_1.ApiResponse(201, receivedMessage, "message saved successfully", true));
});
exports.sendMessage = sendMessage;
const getAllMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const chatId = req.query.chatId;
    const seletedChat = await chat_model_1.Chat.findById(chatId);
    if (!seletedChat) {
        throw new apiError_1.ApiError(400, "Chat does not exist");
    }
    if (!seletedChat.participants?.includes(req.body.user?._id)) {
        throw new apiError_1.ApiError(400, "user is not a part of this chat");
    }
    const messages = await message_model_1.Message.aggregate([
        {
            $match: {
                chat: new mongoose_1.default.Types.ObjectId(chatId),
            }
        },
        ...(0, exports.messageCommonAggregation)(),
        {
            $project: {
                sendTime: { $dateToString: { format: "%H:%M:%S", date: "$cheatedAt" } }
            }
        },
        {
            $sort: {
                createdAt: 1,
            }
        }
    ]);
    return res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, messages, "Messages fatched successfully", true));
});
exports.getAllMessages = getAllMessages;
