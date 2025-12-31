import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  return getItem(STORAGE_KEYS.LOST_TOKEN_VEHICLES, []);
};

const initialState = getInitialState();

const lostTokenSlice = createSlice({
  name: "lostToken",
  initialState,
  reducers: {
    addLostTokenVehicle: (state, action) => {
      state.push(action.payload);
      setItem(STORAGE_KEYS.LOST_TOKEN_VEHICLES, state);
    },
  },
});

export const { addLostTokenVehicle } = lostTokenSlice.actions;
export default lostTokenSlice.reducer;
