const STORAGE_KEYS = {
  AUTH: "auth",
  VEHICLES_IN: "inVehicles",
  VEHICLES_OUT: "outVehicles",
  LOST_TOKEN_VEHICLES: "lostTokenVehicles",
  CATEGORIES: "vehicleCategories",
  PARKING_STATS: "parkingStats",
  SLOTS: "slots",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
  EXPENSES: "expenses",
  SLOT_TYPES: "slotTypes",
  EXPENSE_TYPES: "expenseTypes",
  ALERTS: "alerts",
};

const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};

export { STORAGE_KEYS, getItem, setItem, removeItem };
