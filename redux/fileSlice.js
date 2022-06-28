import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const fileSlice = createSlice({
  name: "file",
  initialState: {
    currentFiles: [],
    recentFiles: Cookies.get("recentFiles")
      ? JSON.parse(Cookies.get("recentFiles"))
      : [],
    fetchFileSizeAgain: true,
  },
  reducers: {
    filesbyFolder: (state, action) => {
      state.currentFiles = action.payload;
    },

    addToRecent: (state, action) => {
      if (state.recentFiles.length > 9) {
        state.recentFiles.pop();
      }
      let newFiles = [action.payload, ...state.recentFiles];
      Cookies.set("recentFiles", JSON.stringify(newFiles));
      state.recentFiles = newFiles;
    },

    clearRecent: (state) => {
      Cookies.remove("recentFiles");
      state.recentFiles = [];
    },
    fetchFileSize: (state) => {
      state.fetchFileSizeAgain = !state.fetchFileSizeAgain;
    },
  },
});

export const { filesbyFolder, addToRecent, fetchFileSize, clearRecent } =
  fileSlice.actions;
export default fileSlice.reducer;
