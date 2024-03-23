import http from 'http'
import express from 'express'
import {Server} from 'socket.io'

import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'


const app = express();
const server =  http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
});

const PORT = process.env.PORT || 8000;

//middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))


app.get('/', (req, res) => {
  res.send("server is working...")
})

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(`id: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg)    
  })
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})