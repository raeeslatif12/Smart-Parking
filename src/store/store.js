import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import parkingReducer from "./parkingSlice";
import categoriesReducer from "./categoriesSlice";
import vehiclesReducer from "./vehiclesSlice";
import lostTokenReducer from "./lostTokenSlice";
import slotsReducer, {
  incrementSlotUsage,
  decrementSlotUsage,
} from "./slotsSlice";
import expensesReducer from "./expensesSlice";
import alertsReducer, { addAlert } from "./alertsSlice";
import slotTypesReducer from "./slotTypesSlice";
import expenseTypesReducer from "./expenseTypesSlice";
import { setItem, STORAGE_KEYS } from "../utils/localStorage";

const listenerMiddleware = createListenerMiddleware();

// Stats Listener
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    return (
      currentState.vehicles !== previousState.vehicles ||
      currentState.lostToken !== previousState.lostToken ||
      currentState.expenses !== previousState.expenses
    );
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const { inVehicles, outVehicles } = state.vehicles;
    const lostTokenVehicles = state.lostToken;
    const expenses = state.expenses;
    const totalVehicles = inVehicles.length + outVehicles.length;
    const vehiclesIn = inVehicles.length;
    const vehiclesOut = outVehicles.length;
    const totalIncome =
      outVehicles.reduce((sum, v) => sum + (v.totalCharge || 0), 0) +
      lostTokenVehicles.reduce((sum, v) => sum + (v.penaltyAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
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
        totalExpenses,
        netProfit,
      },
    });
  },
});

// Slot Occupancy Listener
listenerMiddleware.startListening({
  predicate: (action) =>
    action.type === "vehicles/addInVehicle" ||
    action.type === "vehicles/moveToOutVehicle" ||
    action.type === "vehicles/moveToLostToken",
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();

    if (action.type === "vehicles/addInVehicle") {
      const { slotId } = action.payload;
      if (slotId) {
        listenerApi.dispatch(incrementSlotUsage(slotId));
        // If slot becomes full after this increment, create a warning alert
        const slot = state.slots.find((s) => s.id === slotId);
        if (slot && slot.used + 1 >= slot.capacity) {
          listenerApi.dispatch(
            addAlert({
              type: "warning",
              message: `Slot ${slot.name || slot.id} is now full`,
              related: { type: "slot", id: slot.id, path: `/dashboard/slots` },
            })
          );
        }
        // General entry alert
        listenerApi.dispatch(
          addAlert({
            type: "info",
            message: `Vehicle entered${action.payload?.registrationNumber ? ` (${action.payload.registrationNumber})` : ""}`,
            related: action.payload?.slotId
              ? { type: "slot", id: action.payload.slotId, path: `/dashboard/slots` }
              : null,
          })
        );
      }
    } else if (
      action.type === "vehicles/moveToOutVehicle" ||
      action.type === "vehicles/moveToLostToken"
    ) {
      const { id } = action.payload;
      // Find the vehicle in outVehicles (since it was just moved there)
      const vehicle = state.vehicles.outVehicles.find((v) => v.id === id);
      if (vehicle && vehicle.slotId) {
        listenerApi.dispatch(decrementSlotUsage(vehicle.slotId));
        // Vehicle exit alert
        listenerApi.dispatch(
          addAlert({
            type: "info",
            message: `Vehicle exited${vehicle.registrationNumber ? ` (${vehicle.registrationNumber})` : ""}`,
            related: { type: "vehicle", id: vehicle.id, path: `/dashboard/out-vehicles` },
          })
        );
        // If moved due to lost token, add critical alert
        if (action.type === "vehicles/moveToLostToken") {
          listenerApi.dispatch(
            addAlert({
              type: "critical",
              message: `Lost token processed for vehicle ${vehicle.registrationNumber || vehicle.parkingNumber || vehicle.id}`,
              related: { type: "vehicle", id: vehicle.id, path: `/dashboard/lost-token/${vehicle.id}` },
            })
          );
        }
      }
    }
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parking: parkingReducer,
    categories: categoriesReducer,
    vehicles: vehiclesReducer,
    lostToken: lostTokenReducer,
    slots: slotsReducer,
    expenses: expensesReducer,
    alerts: alertsReducer,
    slotTypes: slotTypesReducer,
    expenseTypes: expenseTypesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
const initialState = store.getState();
const { inVehicles, outVehicles } = initialState.vehicles;
const lostTokenVehicles = initialState.lostToken;
const expenses = initialState.expenses;
const totalVehicles = inVehicles.length + outVehicles.length;
const vehiclesIn = inVehicles.length;
const vehiclesOut = outVehicles.length;
const totalIncome = outVehicles.reduce(
  (sum, v) => sum + (v.totalCharge || 0),
  0
) + lostTokenVehicles.reduce((sum, v) => sum + (v.penaltyAmount || 0), 0);
const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
const netProfit = totalIncome - totalExpenses;
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
    totalExpenses,
    netProfit,
  },
});
