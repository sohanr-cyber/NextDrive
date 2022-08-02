import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const moveSlice = createSlice({
  name: "move",
  initialState: {
    currentFolder: {},
  },

  reducers: {
    currentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
  },
});

export const { currentFolder } = moveSlice.actions;

export default moveSlice.reducer;
