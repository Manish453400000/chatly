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
    addAllFriends: (_state, action) => {
      const friends = action.payload.friends;
      return [...friends]
    },
    addFriend: (state, action) => {
      const friend = action.payload.friend;
      state.push(friend);
    },
    updateOnlineState: (state, action) => {
      return state.map(friend => {
        if(friend._id === action.payload.id) {
          return {
            ...friend,
            isOnline: action.payload.status
          };
        }
        return friend;
      });
    },
    removeFriend: (state, action) => {
       state.filter((request:any) => request._id !== action.payload.id)
    }
  }
})

export const { addAllFriends, addFriend, removeFriend, updateOnlineState } = friendSlice.actions;
export default friendSlice.reducer;