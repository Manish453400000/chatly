import { createSlice } from "@reduxjs/toolkit";
import { Chats } from "../../interface/api";

const initialState:Chats[] = [];

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addAllChats: (_state, action) => {
      const chats = action.payload.chats;
      return [...chats]
    },
    updateChat: (state, action) => {
      const updatedGroup:Chats = action.payload.group;
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
    newMessageCame: (state, action) => {
      return state.map(chat => {
        if(chat._id === action.payload._id) {
          return {
            ...chat,
            newMessageCount: (chat.newMessageCount || 0) + 1
          };
        }
        return chat;
      });
    },
    messageReaded: (state, action) => {
      return state.map(chat => {
        if(chat._id === action.payload._id) {
          return {
            ...chat,
            newMessageCount: 0
          };
        }
        return chat;
      });
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
    },
    addMessage: (state:any, action) => {
      const {chatId, message} = action.payload;
      const updatedChat = state.map((chat: Chats) => {
        if(chat._id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message]
          }
        }else{
          return {
            ...chat
          }
        }
      })

      return updatedChat;
    }
  }
})


export const { addAllChats, addChat, newMessageCame, messageReaded, addMessage, updateChat, removeChat, updateOnlineState } = chatSlice.actions;
export default chatSlice.reducer;

