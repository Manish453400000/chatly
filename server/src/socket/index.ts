import { io } from "../app";
import { User } from "../models/user.model";


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