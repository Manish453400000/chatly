import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import friendReducer from "./features/friendSlice";

const rootReducer = combineReducers({
  user: userReducer,
  friends: friendReducer,
})

const friend: any[] = []

export const initialState = {
  user: {
    isAuthenticated: false,
    data: {}
  },
  friends: friend
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
})