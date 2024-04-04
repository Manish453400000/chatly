import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
})

app.set("io", io); //using this to avoid usage of `global` variables

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// io.on("connection", (socket) => {
//   console.log(`what is socket: `, socket);
//   socket.on("message", (data) => console.log("data: ", data) )
  
// })

import { userRouter } from './routers/user.routes';
import { requestRouter } from './routers/request.routes';
import { chatRouter } from './routers/chat.routes';

app.use("/api/v1/user", userRouter)
app.use("/api/v1/request", requestRouter)
app.use("/api/v1/chats", chatRouter)

app.get('/', (req, res) => {
  res.send('hello world')
})

export { server }