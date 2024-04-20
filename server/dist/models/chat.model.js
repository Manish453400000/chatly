"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    groupAvatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `http://res.cloudinary.com/dwl9iesij/image/upload/v1712937945/hjrcp00xeqraszmdjdl1.png`,
            localPath: '',
        }
    },
    lastMessage: {
        type: mongoose_1.Types.ObjectId,
        ref: "Message"
    },
    participants: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        }
    ],
    admin: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
