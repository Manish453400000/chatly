import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {
    isAuthenticated: false,
    data: {}
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const user = {
        isAuthenticated: action.payload.isAuthenticated,
        data: action.payload.data
      }
      state.user = user;
    },
    updateUser: () => {},
    removeUser: (state, _action) => {
      const user = initialState.user;
      state.user = user;
    }
  }
})

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;