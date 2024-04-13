import { createSlice } from "@reduxjs/toolkit";
import { GroupChats } from "../../interface/api";


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
    updateChat: (state, action) => {
      const updatedGroup:GroupChats = action.payload.group;
      state.filter(group => {
        if(group._id === updatedGroup._id){
          group = updatedGroup;
        }
      })
    },
    addChat: (state, action) => {
      const group = action.payload.group;
      state.push(group);
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


export const { addAllChats, addChat, updateChat, removeChat, updateOnlineState } = chatSlice.actions;
export default chatSlice.reducer;

