import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  const defaultStats = {
    totalVehicles: 0,
    vehiclesIn: 0,
    vehiclesOut: 0,
    parkingWithin24hrs: 0,
    totalIncome: 0,
    incomeHistory: [
      { date: "2025-12-25", income: 50 },
      { date: "2025-12-26", income: 75 },
      { date: "2025-12-27", income: 100 },
      { date: "2025-12-28", income: 125 },
      { date: "2025-12-29", income: 150 },
      { date: "2025-12-30", income: 175 },
      { date: "2025-12-31", income: 200 },
    ],
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
      if (newIncome !== undefined && newIncome !== state.totalIncome) {
        state.totalIncome = newIncome;
        const currentDate = new Date().toISOString().split("T")[0];
        if (!Array.isArray(state.incomeHistory)) {
          state.incomeHistory = [];
        }
        const lastEntry = state.incomeHistory[state.incomeHistory.length - 1];
        if (!lastEntry || lastEntry.date !== currentDate) {
          state.incomeHistory.push({
            date: currentDate,
            income: newIncome,
          });
        } else {
          lastEntry.income = newIncome;
        }
      }
      setItem(STORAGE_KEYS.PARKING_STATS, state);
    },
  },
});

export const { updateStats } = parkingSlice.actions;
export default parkingSlice.reducer;
