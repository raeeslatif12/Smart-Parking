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
import adminsReducer from "./adminsSlice";
import blockedVehiclesReducer, { blockVehicle as blockVehicleInBlocked, unblockVehicle as unblockVehicleInBlocked } from "./blockedVehiclesSlice";
import auditReducer, { addLog } from "./auditSlice";
import { setItem, STORAGE_KEYS } from "../utils/localStorage";

const listenerMiddleware = createListenerMiddleware();

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

listenerMiddleware.startListening({
  predicate: (action) =>
    action.type === "vehicles/addInVehicle" ||
    action.type === "vehicles/moveToOutVehicle" ||
    action.type === "vehicles/moveToLostToken" ||
    action.type === "vehicles/blockVehicle" ||
    action.type === "vehicles/unblockVehicle",
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();

    if (action.type === "vehicles/addInVehicle") {
      const { slotId } = action.payload;
      if (slotId) {
        listenerApi.dispatch(incrementSlotUsage(slotId));
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
        listenerApi.dispatch(
          addAlert({
            type: "info",
            message: `Vehicle entered${action.payload?.registrationNumber ? ` (${action.payload.registrationNumber})` : ""}`,
            related: action.payload?.slotId
              ? { type: "slot", id: action.payload.slotId, path: `/dashboard/slots` }
              : null,
          })
        );
        listenerApi.dispatch(
          addLog({
            adminName: state.auth.user?.name || "System",
            action: "Vehicle Entry",
            target: action.payload?.registrationNumber || action.payload?.regNumber || "Unknown",
            targetType: "Vehicle",
            status: "success",
            details: `Entered slot ${slot?.name || slotId}`
          })
        );
      }
    } else if (
      action.type === "vehicles/moveToOutVehicle" ||
      action.type === "vehicles/moveToLostToken" ||
      action.type === "vehicles/blockVehicle"
    ) {
      const { id } = action.payload;
      const vehicle = action.type === "vehicles/blockVehicle" 
        ? state.vehicles.inVehicles.find((v) => v.id === id)
        : state.vehicles.outVehicles.find((v) => v.id === id);
      if (vehicle && vehicle.slotId) {
        listenerApi.dispatch(decrementSlotUsage(vehicle.slotId));
        if (action.type === "vehicles/moveToOutVehicle") {
          listenerApi.dispatch(
            addAlert({
              type: "info",
              message: `Vehicle exited${vehicle.registrationNumber ? ` (${vehicle.registrationNumber})` : ""}`,
              related: { type: "vehicle", id: vehicle.id, path: `/dashboard/out-vehicles` },
            })
          );
          listenerApi.dispatch(
            addLog({
              adminName: state.auth.user?.name || "System",
              action: "Vehicle Exit",
              target: vehicle.registrationNumber || vehicle.regNumber || "Unknown",
              targetType: "Vehicle",
              status: "success",
              details: `Exited slot ${state.slots.find(s => s.id === vehicle.slotId)?.name || vehicle.slotId}`
            })
          );
        }
        if (action.type === "vehicles/moveToLostToken") {
          listenerApi.dispatch(
            addAlert({
              type: "critical",
              message: `Lost token processed for vehicle ${vehicle.registrationNumber || vehicle.parkingNumber || vehicle.id}`,
              related: { type: "vehicle", id: vehicle.id, path: `/dashboard/lost-token/${vehicle.id}` },
            })
          );
        }
        if (action.type === "vehicles/blockVehicle") {
          listenerApi.dispatch(blockVehicleInBlocked({ ...vehicle, blockReason: action.payload.blockReason || "No reason provided" }));
          listenerApi.dispatch(
            addAlert({
              type: "warning",
              message: `Vehicle blocked: ${vehicle.registrationNumber || vehicle.parkingNumber || vehicle.id}`,
              related: { type: "vehicle", id: vehicle.id, path: `/dashboard/blocked-vehicles` },
            })
          );
        }
      }
    } else if (action.type === "vehicles/unblockVehicle") {
      const vehicle = action.payload;
      if (vehicle && vehicle.slotId) {
        listenerApi.dispatch(incrementSlotUsage(vehicle.slotId));
        listenerApi.dispatch(
          addAlert({
            type: "info",
            message: `Vehicle unblocked: ${vehicle.registrationNumber || vehicle.parkingNumber || vehicle.id}`,
            related: { type: "vehicle", id: vehicle.id, path: `/dashboard/in-vehicles` },
          })
        );
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
    admins: adminsReducer,
    blockedVehicles: blockedVehiclesReducer,
    audit: auditReducer,
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
