import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [],
  loading: false,
  error: null
};

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    addLog: (state, action) => {
      const log = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        adminName: action.payload.adminName,
        action: action.payload.action,
        target: action.payload.target,
        targetType: action.payload.targetType,
        status: action.payload.status || 'success',
        details: action.payload.details || ''
      };
      state.logs.unshift(log);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { addLog, clearLogs, setLoading, setError } = auditSlice.actions;
export default auditSlice.reducer;