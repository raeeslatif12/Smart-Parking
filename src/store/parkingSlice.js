import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  const defaultStats = {
    totalVehicles: 0,
    vehiclesIn: 0,
    vehiclesOut: 0,
    parkingWithin24hrs: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
  };
  return getItem(STORAGE_KEYS.PARKING_STATS, defaultStats);
};

const initialState = getInitialState();

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    updateStats: (state, action) => {
      state.totalVehicles = action.payload.totalVehicles || state.totalVehicles;
      state.vehiclesIn = action.payload.vehiclesIn;
      state.vehiclesOut = action.payload.vehiclesOut;
      state.parkingWithin24hrs = action.payload.parkingWithin24hrs;
      const newIncome = action.payload.totalIncome;
      if (newIncome !== undefined) {
        state.totalIncome = newIncome;
      }
      if (action.payload.totalExpenses !== undefined) {
        state.totalExpenses = action.payload.totalExpenses;
      }
      if (action.payload.netProfit !== undefined) {
        state.netProfit = action.payload.netProfit;
      }
      setItem(STORAGE_KEYS.PARKING_STATS, state);
    },
  },
});

export const { updateStats } = parkingSlice.actions;
export default parkingSlice.reducer;
