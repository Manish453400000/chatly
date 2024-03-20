import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import { initialState } from "./features/userSlice";

export const store = configureStore({
  reducer: userReducer,
  preloadedState: {
    user: initialState.user,
  }
})