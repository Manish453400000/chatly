import { createSlice } from "@reduxjs/toolkit";


export interface Friend {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  isOnline: boolean,
  username: string,
  about: string,
  _id: string,
}

export const initialState:Friend[] = []

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addAllFriends: (state, action) => {
      const friends = action.payload.friends;
      return [...friends]
    },
    addFriend: (state, action) => {
      const friend = action.payload.friend;
      state.push(friend);
    },
    updateOnlineState: (state, action) => {
      const id = action.payload.id;
      const status = action.payload.status;
      state.filter(friend => {
        if (friend._id === id) {
          friend.isOnline = status
        }
      })
    },
    removeFriend: (state, action) => {
       state.filter((request:any) => request.id !== action.payload.id)
    }
  }
})

export const { addAllFriends, addFriend, removeFriend, updateOnlineState } = friendSlice.actions;
export default friendSlice.reducer;