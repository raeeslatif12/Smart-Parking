import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage.js';

const initialState = getItem(STORAGE_KEYS.BLOCKED_VEHICLES) || {
  list: [],
};

const blockedVehiclesSlice = createSlice({
  name: 'blockedVehicles',
  initialState,
  reducers: {
    blockVehicle: (state, action) => {
      state.list.push({ ...action.payload, blockedAt: new Date().toISOString() });
      setItem(STORAGE_KEYS.BLOCKED_VEHICLES, state);
    },
    unblockVehicle: (state, action) => {
      state.list = state.list.filter(vehicle => vehicle.id !== action.payload);
      setItem(STORAGE_KEYS.BLOCKED_VEHICLES, state);
    },
  },
});

export const { blockVehicle, unblockVehicle } = blockedVehiclesSlice.actions;
export default blockedVehiclesSlice.reducer;