import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const folderSlice = createSlice({
  name: "folder",
  initialState: {
    currentFolder: {},
  },

  reducers: {
    currentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
  },


});

export const { currentFolder } = folderSlice.actions;

export default folderSlice.reducer;
