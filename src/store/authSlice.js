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
      storedCredentials: auth.storedCredentials || null,
      username: "",
      password: "",
    };
  }
  return {
    isAuthenticated: false,
    user: { name: "Super Admin", password: "password", role: "super_admin" },
    storedCredentials: null,
    username: "super",
    password: "password",
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
      state.storedCredentials = {
        username: action.payload.username,
        password: action.payload.password
      };
      setItem(STORAGE_KEYS.AUTH, {
        isAuthenticated: true,
        user: action.payload,
        storedCredentials: state.storedCredentials,
      });
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      state.password = "";
      state.storedCredentials = null;
      removeItem(STORAGE_KEYS.AUTH);
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
    resetLoginForm: (state) => {
      state.username = "";
      state.password = "";
    },
  },
});

export const { login, logout, loadAuth, setUsername, setPassword, updateUser, resetLoginForm } =
  authSlice.actions;
export default authSlice.reducer;
