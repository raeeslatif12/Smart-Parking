import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  const slots = getItem(STORAGE_KEYS.SLOTS, []);
  return slots.map(slot => ({
    ...slot,
    status: slot.status || "Available",
  }));
};

const initialState = getInitialState();

const slotsSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    addSlot: (state, action) => {
      const newSlot = {
        id: Date.now(),
        ...action.payload,
        used: 0,
        status: "Available",
      };
      state.push(newSlot);
      setItem(STORAGE_KEYS.SLOTS, state);
    },
    updateSlot: (state, action) => {
      const { id, ...updates } = action.payload;
      const slot = state.find((s) => s.id === id);
      if (slot) {
        if (updates.capacity !== undefined) {
          const newCap = parseInt(updates.capacity, 10) || 0;
          if (newCap < slot.used) {
            updates.capacity = slot.used;
          } else {
            updates.capacity = newCap;
          }
        }
        Object.assign(slot, updates);
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    deleteSlot: (state, action) => {
      const index = state.findIndex((s) => s.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    incrementSlotUsage: (state, action) => {
      const slotId = action.payload;
      const slot = state.find((s) => s.id === slotId);
      if (slot && slot.used < slot.capacity) {
        slot.used += 1;
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    decrementSlotUsage: (state, action) => {
      const slotId = action.payload;
      const slot = state.find((s) => s.id === slotId);
      if (slot && slot.used > 0) {
        slot.used -= 1;
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    reserveSlot: (state, action) => {
      const slot = state.find((s) => s.id === action.payload);
      if (slot) {
        slot.status = "Reserved";
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    releaseSlot: (state, action) => {
      const slot = state.find((s) => s.id === action.payload);
      if (slot) {
        slot.status = "Available";
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    holdSlot: (state, action) => {
      const slot = state.find((s) => s.id === action.payload);
      if (slot) {
        slot.status = "Hold";
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
    unholdSlot: (state, action) => {
      const slot = state.find((s) => s.id === action.payload);
      if (slot) {
        slot.status = "Available";
        setItem(STORAGE_KEYS.SLOTS, state);
      }
    },
  },
});

export const {
  addSlot,
  updateSlot,
  deleteSlot,
  incrementSlotUsage,
  decrementSlotUsage,
  reserveSlot,
  releaseSlot,
  holdSlot,
  unholdSlot,
} = slotsSlice.actions;
export default slotsSlice.reducer;
