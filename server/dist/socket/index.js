"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callEvents = exports.mountParticipantStopTyping = exports.mountParticipantTyping = exports.emitSocketEvent = exports.updateOnlineStatus = void 0;
const app_1 = require("../app");
const user_model_1 = require("../models/user.model");
const chat_model_1 = require("../models/chat.model");
const updateOnlineStatus = async (socket, status) => {
    const { _id } = socket.user;
    const user = await user_model_1.User.findByIdAndUpdate(_id, {
        $set: {
            isOnline: status,
        }
    }, {
        new: true
    });
    user?.friends.forEach(friend => {
        const id = friend.toString();
        app_1.io.to(id).emit('onlineStatus', { id: user._id, status: status });
    });
};
exports.updateOnlineStatus = updateOnlineStatus;
const emitSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").in(roomId).emit(event, payload);
};
exports.emitSocketEvent = emitSocketEvent;
const mountParticipantTyping = (socket) => {
    socket.on('typing:start', async (chatId) => {
        const chat = await chat_model_1.Chat.findById(chatId);
        const participants = chat?.participants;
        participants?.forEach(participant => {
            if (participant !== socket.user._id) {
                app_1.io.to(participant.toString()).emit('typing:start', chatId);
            }
        });
    });
};
exports.mountParticipantTyping = mountParticipantTyping;
const mountParticipantStopTyping = (socket) => {
    socket.on('typing:stop', async (chatId) => {
        const chat = await chat_model_1.Chat.findById(chatId);
        const participants = chat?.participants;
        participants?.forEach(participant => {
            if (participant !== socket.user._id) {
                app_1.io.to(participant.toString()).emit('typing:stop', chatId);
            }
        });
    });
};
exports.mountParticipantStopTyping = mountParticipantStopTyping;
const callEvents = (socket) => {
    socket.on("initiate:call", (data) => {
        const { to, offer } = data;
        app_1.io.to(to).emit("incoming:call", { from: socket.user._id, offer });
    });
};
exports.callEvents = callEvents;
