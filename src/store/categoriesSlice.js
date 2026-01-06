import { createSlice } from "@reduxjs/toolkit";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const getInitialState = () => {
  const categories = getItem(STORAGE_KEYS.CATEGORIES, [
    {
      id: 1,
      name: "Car",
      publishedOn: "12/30/2025",
      feePer24Hours: 10,
      lostTokenPenalty: 50,
      extraHourRate: 5,
    },
    {
      id: 2,
      name: "Bike",
      publishedOn: "12/29/2025",
      feePer24Hours: 5,
      lostTokenPenalty: 25,
      extraHourRate: 2,
    },
  ]);
  return categories.map((cat) => ({
    ...cat,
    feePer24Hours: cat.feePer24Hours || 10,
    lostTokenPenalty: cat.lostTokenPenalty || 50,
    extraHourRate: cat.extraHourRate || 5,
  }));
};

const initialState = getInitialState();

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        id: Date.now(),
        name: action.payload.name,
        publishedOn: new Date().toLocaleDateString(),
        feePer24Hours: action.payload.feePer24Hours || 10,
        lostTokenPenalty: action.payload.lostTokenPenalty || 50,
        extraHourRate: action.payload.extraHourRate || 5,
      };
      state.push(newCategory);
      setItem(STORAGE_KEYS.CATEGORIES, state);
    },
    updateCategory: (state, action) => {
      const { id, name } = action.payload;
      const category = state.find((cat) => cat.id === id);
      if (category) {
        category.name = name;
        setItem(STORAGE_KEYS.CATEGORIES, state);
      }
    },
    deleteCategory: (state, action) => {
      const index = state.findIndex((cat) => cat.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
        setItem(STORAGE_KEYS.CATEGORIES, state);
      }
    },
    updateCategoryFees: (state, action) => {
      const { id, feePer24Hours, lostTokenPenalty, extraHourRate } = action.payload;
      const category = state.find((cat) => cat.id === id);
      if (category) {
        category.feePer24Hours =
          parseFloat(feePer24Hours) || category.feePer24Hours;
        category.lostTokenPenalty =
          parseFloat(lostTokenPenalty) || category.lostTokenPenalty;
        category.extraHourRate =
          parseFloat(extraHourRate) || category.extraHourRate;
        setItem(STORAGE_KEYS.CATEGORIES, state);
      }
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryFees,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
