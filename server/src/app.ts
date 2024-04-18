import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { ApiError } from './utils/apiError';
import { User } from './models/user.model';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }
})

app.set("io", io); //using this to avoid usage of `global` variables

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://secret-chat-app-one.vercel.app/",
    credentials: true,
  })
)
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

let onlineUsers = []

// socket io inisalization
io.on('connection', async (socket:any) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;
      if(!token) {
        token = socket.handshake.auth?.token;
      }
      if(!token) {
        throw new ApiError(401, "UnAuthorized handshake. Token is missing.");
      }

      const decodedToken:any = jwt.verify(token, accessTokenSecret)

      const user = await User.findById( decodedToken?._id || '').select(
        "-password -refreshToken "
      )
      if(!user) {
        throw new ApiError(401, "unAuthorized handshake. Token is invalid");
      }
      socket.on('login', () => {
        console.log('user loged in');
      })
      socket.user = user;
      socket.join(user._id.toString());
      console.log("User connected 🗼. userId: " + user?._id.toString() + " sId: " + socket.id);

      updateOnlineStatus(socket, true)
      
      socket.on('disconnect', async () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?._id);
        updateOnlineStatus(socket, false)
        if(socket.user?._id){
          const id = socket.user?._id;

          socket.leave(socket.user?._id);
        }
      })

    }catch(error:any) {
      socket.emit('socketError', error?.message || "Something went wrong while connecting to the socket");
    }
})


import { userRouter } from './routers/user.routes';
import { requestRouter } from './routers/request.routes';
import { chatRouter } from './routers/chat.routes';
import { updateOnlineStatus } from './socket';
import { messageRouter } from './routers/message.routes';

app.use("/api/v1/user", userRouter)
app.use("/api/v1/friend", requestRouter)
app.use("/api/v1/chats", chatRouter)
app.use("/api/v1/messages", messageRouter)

app.get('/', (req, res) => {
  res.send('hello world')
})

export { server, io }