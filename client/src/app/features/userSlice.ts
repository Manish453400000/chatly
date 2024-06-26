import { createSlice } from "@reduxjs/toolkit";
// import { initialState } from "../store";

export const initialState = {
    isAuthenticated: false,
    data: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (_state, action) => {
      const user = {
        isAuthenticated: action.payload.isAuthenticated,
        data: action.payload.data
      }
      return user
    },
    // updateUser: () => {},
    // removeUser: (state:any, _action) => {
    //   const user = initialState;
    //   state = user;
    // }
  }
})

export const { addUser } = userSlice.actions;
export default userSlice.reducer;