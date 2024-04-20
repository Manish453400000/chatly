"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocketEvent = exports.updateOnlineStatus = void 0;
const app_1 = require("../app");
const user_model_1 = require("../models/user.model");
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
