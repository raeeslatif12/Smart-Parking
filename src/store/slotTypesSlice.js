    import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const SLOT_TYPES_KEY = 'slotTypes';

const loadSlotTypes = () => {
  return getItem(SLOT_TYPES_KEY, [
    { id: 1, name: 'Car' },
    { id: 2, name: 'Bike' },
    { id: 3, name: 'Both' }
  ]);
};

const saveSlotTypes = (types) => {
  setItem(SLOT_TYPES_KEY, types);       
};

const slotTypesSlice = createSlice({
  name: 'slotTypes',
  initialState: loadSlotTypes(),
  reducers: {
    addSlotType: (state, action) => {
      const newType = { id: Date.now(), name: action.payload.name };
      state.push(newType);
      saveSlotTypes(state);
    },
    updateSlotType: (state, action) => {
      const { id, name } = action.payload;
      const type = state.find(t => t.id === id);
      if (type) {
        type.name = name;
        saveSlotTypes(state);
      }
    },
    deleteSlotType: (state, action) => {
      const index = state.findIndex(t => t.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        saveSlotTypes(state);
      }
    },
  },
});

export const { addSlotType, updateSlotType, deleteSlotType } = slotTypesSlice.actions;
export default slotTypesSlice.reducer;