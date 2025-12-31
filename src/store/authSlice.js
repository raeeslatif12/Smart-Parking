import { createSlice } from "@reduxjs/toolkit";
import {
  getItem,
  setItem,
  removeItem,
  STORAGE_KEYS,
} from "../utils/localStorage";

const getInitialState = () => {
  const auth = getItem(STORAGE_KEYS.AUTH);
  if (auth) {
    return {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      username: "",
      password: "",
    };
  }
  return {
    isAuthenticated: false,
    user: { name: "admin", password: "password123" },
    username: "admin",
    password: "",
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      setItem(STORAGE_KEYS.AUTH, {
        isAuthenticated: true,
        user: action.payload,
      });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      setItem(STORAGE_KEYS.AUTH, {
        isAuthenticated: false,
        user: state.user,
      });
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        name: action.payload.name,
        password: action.payload.password,
      };
      setItem(STORAGE_KEYS.AUTH, {
        isAuthenticated: true,
        user: state.user,
      });
    },
    loadAuth: (state) => {
      const auth = getItem(STORAGE_KEYS.AUTH);
      if (auth) {
        state.isAuthenticated = auth.isAuthenticated;
        state.user = auth.user;
      }
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { login, logout, loadAuth, setUsername, setPassword, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
