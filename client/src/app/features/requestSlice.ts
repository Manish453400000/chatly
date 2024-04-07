import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  requests: [{}]
}

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    addRequest: (state, action) => {
      const request = action.payload.request;
      state.requests.push(request);
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter((request:any) => request.id !== action.payload)
    }
  }
})

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice;