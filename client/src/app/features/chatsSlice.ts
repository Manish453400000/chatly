import { createSlice } from "@reduxjs/toolkit";
// import { initialState } from "../store";

interface Participant {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  };
  isOnline: boolean;
  username: string;
  about: string;
  _id: string;
}

export interface Chat {
  _id: string,
  name: string,
  isGroupChat: boolean,
  Participants: [string],
  admin: string,
  participantDetails: [
    {
      avatar: {
        localPath: string;
        url: string,
        _id: string,
      };
      isOnline: boolean;
      username: string;
      about: string;
      _id: string;
    }
  ],
}

const initialState:Chat[] = [];

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addAllChats: (state, action) => {
      const chats = action.payload.chats;
      return [...chats]
    },
    addChat: (state, action) => {
      const chat = action.payload.friend;
      state.push(chat);
    },
    updateOnlineState: (state:any, action) => {
      const id = action.payload.id;
      const status = action.payload.status;
      state.participantDetails.filter((participant:any) => {
        if (participant._id === id) {
          participant.isOnline = status
        }
      })
    },
    removeChat: (state, action) => {
       state.filter((request:any) => request.id !== action.payload.id)
    }
  }
})


export const { addAllChats, addChat, removeChat, updateOnlineState } = chatSlice.actions;
export default chatSlice.reducer;

