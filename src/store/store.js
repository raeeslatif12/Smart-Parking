import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import parkingReducer from "./parkingSlice";
import categoriesReducer from "./categoriesSlice";
import vehiclesReducer from "./vehiclesSlice";
import lostTokenReducer from "./lostTokenSlice";
import { setItem, STORAGE_KEYS } from "../utils/localStorage";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return (
      currentState.vehicles !== previousState.vehicles ||
      currentState.lostToken !== previousState.lostToken
    );
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const { inVehicles, outVehicles } = state.vehicles;
    const lostTokenVehicles = state.lostToken;
    const totalVehicles = inVehicles.length + outVehicles.length;
    const vehiclesIn = inVehicles.length;
    const vehiclesOut = outVehicles.length;
    const totalIncome =
      outVehicles.reduce((sum, v) => sum + (v.totalCharge || 0), 0) +
      lostTokenVehicles.reduce((sum, v) => sum + (v.penaltyAmount || 0), 0);
    const parkingWithin24hrs = inVehicles.filter((v) => {
      const entryTime = new Date(v.entryTime);
      const now = new Date();
      const diff = now - entryTime;
      return diff < 24 * 60 * 60 * 1000;
    }).length;

    listenerApi.dispatch({
      type: "parking/updateStats",
      payload: {
        totalVehicles,
        vehiclesIn,
        vehiclesOut,
        parkingWithin24hrs,
        totalIncome,
      },
    });
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parking: parkingReducer,
    categories: categoriesReducer,
    vehicles: vehiclesReducer,
    lostToken: lostTokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
const initialState = store.getState();
const { inVehicles, outVehicles } = initialState.vehicles;
const totalVehicles = inVehicles.length + outVehicles.length;
const vehiclesIn = inVehicles.length;
const vehiclesOut = outVehicles.length;
const totalIncome = outVehicles.reduce(
  (sum, v) => sum + (v.totalCharge || 0),
  0
);
const parkingWithin24hrs = inVehicles.filter((v) => {
  const entryTime = new Date(v.entryTime);
  const now = new Date();
  const diff = now - entryTime;
  return diff < 24 * 60 * 60 * 1000;
}).length;

store.dispatch({
  type: "parking/updateStats",
  payload: {
    totalVehicles,
    vehiclesIn,
    vehiclesOut,
    parkingWithin24hrs,
    totalIncome,
  },
});
