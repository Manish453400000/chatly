"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const apiError_1 = require("./utils/apiError");
const user_model_1 = require("./models/user.model");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN || "https://secret-chat-app-one.vercel.app",
        credentials: true,
    }
});
exports.io = io;
app.set("io", io); //using this to avoid usage of `global` variables
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "https://secret-chat-app-one.vercel.app",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
let onlineUsers = [];
// socket io inisalization
io.on('connection', async (socket) => {
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
        socket.on('login', () => {
            console.log('user loged in');
        });
        socket.user = user;
        socket.join(user._id.toString());
        console.log("User connected 🗼. userId: " + user?._id.toString() + " sId: " + socket.id);
        (0, socket_1.updateOnlineStatus)(socket, true);
        (0, socket_1.mountParticipantTyping)(socket);
        (0, socket_1.mountParticipantStopTyping)(socket);
        (0, socket_1.callEvents)(socket);
        socket.on('disconnect', async () => {
            console.log("user has disconnected 🚫. userId: " + socket.user?._id);
            (0, socket_1.updateOnlineStatus)(socket, false);
            if (socket.user?._id) {
                const id = socket.user?._id;
                socket.leave(socket.user?._id);
            }
        });
    }
    catch (error) {
        socket.emit('socketError', error?.message || "Something went wrong while connecting to the socket");
    }
});
const user_routes_1 = require("./routers/user.routes");
const request_routes_1 = require("./routers/request.routes");
const chat_routes_1 = require("./routers/chat.routes");
const socket_1 = require("./socket");
const message_routes_1 = require("./routers/message.routes");
app.use("/api/v1/user", user_routes_1.userRouter);
app.use("/api/v1/friend", request_routes_1.requestRouter);
app.use("/api/v1/chats", chat_routes_1.chatRouter);
app.use("/api/v1/messages", message_routes_1.messageRouter);
app.get('/', (req, res) => {
    res.send('hello world');
});
