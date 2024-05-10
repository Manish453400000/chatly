import { off } from "process";
import { io } from "../app";
import { User } from "../models/user.model";
import { Socket } from "socket.io";
import { Chat } from "../models/chat.model";


export const updateOnlineStatus = async (socket:any, status: boolean) => {
  const { _id } = socket.user;
  
  const user = await User.findByIdAndUpdate(
    _id, 
    {
      $set: {
        isOnline: status,
      }
    },
    {
      new: true
    }
  )

  user?.friends.forEach(friend => {
    const id = friend.toString();
    io.to(id).emit('onlineStatus', {id: user._id, status: status})
  })


} 

export const emitSocketEvent = (req:any, roomId:any, event:any, payload:any) => {
  req.app.get("io").in(roomId).emit(event, payload)
}

export const mountParticipantTyping = (socket:any) => {
  socket.on('typing:start', async(chatId:string) => {
    const chat = await Chat.findById(chatId);
    const participants = chat?.participants;
    participants?.forEach(participant => {
      if(participant !== socket.user._id) {
        io.to(participant.toString()).emit('typing:start', chatId);
      }
    })
  })
}
export const mountParticipantStopTyping = (socket:any) => {
  socket.on('typing:stop', async(chatId:string) => {
    const chat = await Chat.findById(chatId);
    const participants = chat?.participants;
    participants?.forEach(participant => {
      if(participant !== socket.user._id) {
        io.to(participant.toString()).emit('typing:stop', chatId);
      }
    })
  })
}

export const callEvents = (socket: any) => {
  socket.on("initiate:call", (data:any) => {
    const {to, offer} = data;
    io.to(to).emit("incoming:call", {from: socket.user._id, offer})
  })
}