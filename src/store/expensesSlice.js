import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  return getItem(STORAGE_KEYS.EXPENSES, []);
};

const initialState = getInitialState();

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const newExpense = {
        id: Date.now(),
        ...action.payload,
      };
      state.push(newExpense);
      setItem(STORAGE_KEYS.EXPENSES, state);
    },
    updateExpense: (state, action) => {
      const { id, ...updates } = action.payload;
      const expense = state.find((e) => e.id === id);
      if (expense) {
        Object.assign(expense, updates);
        setItem(STORAGE_KEYS.EXPENSES, state);
      }
    },
    deleteExpense: (state, action) => {
      const index = state.findIndex((e) => e.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        setItem(STORAGE_KEYS.EXPENSES, state);
      }
    },
  },
});

export const { addExpense, updateExpense, deleteExpense } = expensesSlice.actions;
export default expensesSlice.reducer;