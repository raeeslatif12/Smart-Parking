import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage.js';

const initialState = getItem(STORAGE_KEYS.ADMINS) || {
  list: [
    { id: '1', name: 'Super Admin', username: 'super', role: 'super_admin', password: 'password' },
  ],
};

const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      const newAdmin = {
        ...action.payload,
        id: new Date().toISOString(),
        role: action.payload.role === 'super_admin' || action.payload.role === 'Super Admin'
          ? 'super_admin'
          : 'admin',
        status: action.payload.status || 'active',
      };
      state.list.push(newAdmin);
      setItem(STORAGE_KEYS.ADMINS, state);
    },
    updateAdmin: (state, action) => {
      const index = state.list.findIndex(admin => admin.id === action.payload.id);
      if (index !== -1) {
        const existing = state.list[index];
        const updatedAdmin = {
          ...existing,
          ...action.payload,
          role: action.payload.role === 'super_admin' || action.payload.role === 'Super Admin'
            ? 'super_admin'
            : existing.role || 'admin',
          status: action.payload.status || existing.status || 'active',
        };
        state.list[index] = updatedAdmin;
        setItem(STORAGE_KEYS.ADMINS, state);
      }
    },

    blockAdmin: (state, action) => {
      const id = action.payload;
      const idx = state.list.findIndex(a => a.id === id);
      if (idx !== -1) {
        state.list[idx].status = 'blocked';
        setItem(STORAGE_KEYS.ADMINS, state);
      }
    },
    unblockAdmin: (state, action) => {
      const id = action.payload;
      const idx = state.list.findIndex(a => a.id === id);
      if (idx !== -1) {
        state.list[idx].status = 'active';
        setItem(STORAGE_KEYS.ADMINS, state);
      }
    },
    deleteAdmin: (state, action) => {
      state.list = state.list.filter(admin => admin.id !== action.payload);
      setItem(STORAGE_KEYS.ADMINS, state);
    },
  },
});

export const { addAdmin, updateAdmin, deleteAdmin, blockAdmin, unblockAdmin } = adminsSlice.actions;
export default adminsSlice.reducer;