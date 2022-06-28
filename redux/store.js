import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import file from "./fileSlice";
import folder from "./folderSlice";

export const store = configureStore({
  reducer: {
    user: user,
    folder: folder,
    file: file,
  },
});
