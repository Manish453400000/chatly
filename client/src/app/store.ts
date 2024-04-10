import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import friendReducer from "./features/friendSlice";
import chatReducer from "./features/chatsSlice"

import { Friend } from "./features/friendSlice";
import { Chat } from "./features/chatsSlice";

const rootReducer = combineReducers({
  user: userReducer,
  friends: friendReducer,
  chats: chatReducer
})

const friend: Friend[] = []
const chat: Chat[] = []

export const initialState = {
  user: {
    isAuthenticated: false,
    data: {}
  },
  friends: friend,
  chats: chat
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
})