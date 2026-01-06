import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage.js";

const getInitialState = () => {
  const inVehicles = getItem(STORAGE_KEYS.VEHICLES_IN, []);
  const outVehicles = getItem(STORAGE_KEYS.VEHICLES_OUT, []);
  return {
    inVehicles,
    outVehicles,
  };
};

const initialState = getInitialState();

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    addInVehicle: (state, action) => {
      const newVehicle = {
        id: Date.now(),
        ...action.payload,
        parkingNumber: `P-${Date.now()}`,
        slot: action.payload.slot || state.inVehicles.length + 1,
        slotId: action.payload.slotId || null,
        entryTime: new Date().toISOString(),
      };
      state.inVehicles.push(newVehicle);
      setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
    },
    updateInVehicle: (state, action) => {
      const { id, ...updates } = action.payload;
      const vehicle = state.inVehicles.find((v) => v.id === id);
      if (vehicle) {
        Object.assign(vehicle, updates);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
      }
    },
    deleteInVehicle: (state, action) => {
      const index = state.inVehicles.findIndex((v) => v.id === action.payload);
      if (index !== -1) {
        state.inVehicles.splice(index, 1);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
      }
    },
    moveToOutVehicle: (state, action) => {
      const { id, totalCharge, remarks } = action.payload;
      const vehicleIndex = state.inVehicles.findIndex((v) => v.id === id);
      if (vehicleIndex !== -1) {
        const vehicle = state.inVehicles[vehicleIndex];
        const outVehicle = {
          ...vehicle,
          outTime: new Date().toISOString(),
          totalCharge: parseFloat(totalCharge) || 0,
          remarks,
        };
        state.outVehicles.push(outVehicle);
        state.inVehicles.splice(vehicleIndex, 1);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
        setItem(STORAGE_KEYS.VEHICLES_OUT, state.outVehicles);
      }
    },
    moveToLostToken: (state, action) => {
      const {
        id,
        penaltyAmount,
        idCardNumber,
        idCardImage,
        remarks,
        totalCharge,
      } = action.payload;
      const vehicleIndex = state.inVehicles.findIndex((v) => v.id === id);
      if (vehicleIndex !== -1) {
        const vehicle = state.inVehicles[vehicleIndex];
        const lostTokenVehicle = {
          ...vehicle,
          outTime: new Date().toISOString(),
          penaltyAmount: parseFloat(penaltyAmount) || 0,
          totalCharge: parseFloat(totalCharge) || 0,
          idCardNumber,
          idCardImage,
          remarks,
          status: "Out – Lost Token",
        };
        state.outVehicles.push(lostTokenVehicle);
        state.inVehicles.splice(vehicleIndex, 1);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
        setItem(STORAGE_KEYS.VEHICLES_OUT, state.outVehicles);
      }
    },
    blockVehicle: (state, action) => {
      const { id } = action.payload;
      const vehicleIndex = state.inVehicles.findIndex((v) => v.id === id);
      if (vehicleIndex !== -1) {
        state.inVehicles.splice(vehicleIndex, 1);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
      }
    },
    unblockVehicle: (state, action) => {
      const vehicle = action.payload;
      state.inVehicles.push(vehicle);
      setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
    },
    deleteVehicle: (state, action) => {
      const vehicleId = action.payload;
      // Remove from inVehicles if present
      const inIndex = state.inVehicles.findIndex((v) => v.id === vehicleId);
      if (inIndex !== -1) {
        state.inVehicles.splice(inIndex, 1);
        setItem(STORAGE_KEYS.VEHICLES_IN, state.inVehicles);
        return;
      }
      // Remove from outVehicles if present
      const outIndex = state.outVehicles.findIndex((v) => v.id === vehicleId);
      if (outIndex !== -1) {
        state.outVehicles.splice(outIndex, 1);
        setItem(STORAGE_KEYS.VEHICLES_OUT, state.outVehicles);
      }
    },
  },
});

export const {
  addInVehicle,
  updateInVehicle,
  deleteInVehicle,
  moveToOutVehicle,
  moveToLostToken,
  blockVehicle,
  unblockVehicle,
  deleteVehicle,
} = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
  