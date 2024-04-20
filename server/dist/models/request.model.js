"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
const requestSchema = new mongoose_1.Schema({
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    },
    senderId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });
exports.Request = (0, mongoose_1.model)('Request', requestSchema);
