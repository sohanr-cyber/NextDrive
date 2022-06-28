import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo"))
      : null,
  },
  reducers: {
    login: (state, action) => {
      Cookies.set("userInfo", JSON.stringify(action.payload));
      state.userInfo = action.payload;
    },
    

    logout: (state) => {
      Cookies.remove("userInfo");
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
