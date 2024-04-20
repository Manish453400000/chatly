"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketIo = void 0;
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const apiError_1 = require("../utils/apiError");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
const initializeSocketIo = (io) => {
    return io.on('connection', async (socket) => {
        try {
            const cookies = cookie_1.default.parse(socket.handshake.headers?.cookie || "");
            let token = cookies?.accessToken;
            if (!token) {
                token = socket.handshake.auth?.token;
            }
            if (!token) {
                throw new apiError_1.ApiError(401, "UnAuthorized handshake. Token is missing.");
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, accessTokenSecret);
            const user = await user_model_1.User.findById(decodedToken?._id || '').select("-password -refreshToken ");
            if (!user) {
                throw new apiError_1.ApiError(401, "unAuthorized handshake. Token is invalid");
            }
            socket.user = user;
            socket.join(user._id.toString());
            socket.emit('connected');
            console.log("User connected 🗼. userId: " + user?._id.toString());
        }
        catch (error) {
        }
    });
};
exports.initializeSocketIo = initializeSocketIo;
