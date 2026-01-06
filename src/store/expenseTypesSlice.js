import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const EXPENSE_TYPES_KEY = 'expenseTypes';

const loadExpenseTypes = () => {
  return getItem(EXPENSE_TYPES_KEY, [
    { id: 1, name: 'Electricity' },
    { id: 2, name: 'Salary' },
    { id: 3, name: 'Maintenance' }
  ]);
};

const saveExpenseTypes = (types) => {
  setItem(EXPENSE_TYPES_KEY, types);
};

const expenseTypesSlice = createSlice({
  name: 'expenseTypes',
  initialState: loadExpenseTypes(),
  reducers: {
    addExpenseType: (state, action) => {
      const newType = { id: Date.now(), name: action.payload.name };
      state.push(newType);
      saveExpenseTypes(state);
    },
    updateExpenseType: (state, action) => {
      const { id, name } = action.payload;
      const type = state.find(t => t.id === id);
      if (type) {
        type.name = name;
        saveExpenseTypes(state);
      }
    },
    deleteExpenseType: (state, action) => {
      const index = state.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveExpenseTypes(state);
      }
    },
  },
});

export const { addExpenseType, updateExpenseType, deleteExpenseType } = expenseTypesSlice.actions;
export default expenseTypesSlice.reducer;