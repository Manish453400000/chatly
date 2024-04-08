import { createSlice } from "@reduxjs/toolkit";
// import { initialState } from "../store";

export const initialState:any[] = []

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
    removeFriend: (state, action) => {
       state.filter((request:any) => request.id !== action.payload)
    }
  }
})

export const { addAllFriends, addFriend, removeFriend } = friendSlice.actions;
export default friendSlice.reducer;