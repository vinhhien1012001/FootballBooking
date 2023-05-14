import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
  mode: "light",
  token: storedToken ? JSON.parse(storedToken) : null,
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      console.log("TOKEN:", action.payload.token);
      console.log("USER:", action.payload.user);

      // Save authentication data to localStorage
      // localStorage.setItem("token", action.payload.token);
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      // Clear authentication data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setMode, setLogin, setLogout } = globalSlice.actions;

export default globalSlice.reducer;
