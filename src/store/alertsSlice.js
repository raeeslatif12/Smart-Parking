import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const loadAlerts = () => {
  return getItem(STORAGE_KEYS.ALERTS, []);
};

const saveAlerts = (alerts) => {
  setItem(STORAGE_KEYS.ALERTS, alerts);
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState: loadAlerts(),
  reducers: {
    addAlert: (state, action) => {
      const { type = "info", message = "", related = null } = action.payload || {};
      const alert = {
        id: Date.now(),
        type,
        message,
        timestamp: new Date().toISOString(),
        status: "new",
        related,
      };
      const recent = state.filter(
        (a) => a.message === alert.message && Date.now() - new Date(a.timestamp).getTime() < 5 * 60 * 1000
      );
      if (recent.length === 0) {
        state.unshift(alert);
        saveAlerts(state);
      }
    },
    markRead: (state, action) => {
      const id = action.payload;
      const idx = state.findIndex((a) => a.id === id);
      if (idx !== -1 && state[idx].status !== "dismissed") {
        state[idx].status = "read";
        saveAlerts(state);
      }
    },
    dismissAlert: (state, action) => {
      const id = action.payload;
      const idx = state.findIndex((a) => a.id === id);
      if (idx !== -1) {
        state[idx].status = "dismissed";
        saveAlerts(state);
      }
    },
    removeAlert: (state, action) => {
      const index = state.findIndex((a) => a.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveAlerts(state);
      }
    },
    clearAlerts: (state) => {
      state.length = 0;
      saveAlerts(state);
    },
  },
});

export const { addAlert, markRead, dismissAlert, removeAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;