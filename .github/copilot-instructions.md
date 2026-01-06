# Copilot Instructions for Car-Parking (React + Redux Toolkit)

This file tells AI coding agents how this project is organized and what conventions to follow so changes are safe and production-ready.

- Project layout: UI under `src/` with pages in `src/pages`, components in `src/components`, and Redux slices in `src/store`.
- Build & dev commands: use `npm run dev` (dev), `npm run build` (production build), and `npm run preview` (serve build). Lint with `npm run lint`.

Key patterns and where to change them

- Local storage sync: slices hydrate and persist directly to localStorage using helpers in `src/utils/localStorage.js`. Always use `STORAGE_KEYS` and `getItem`/`setItem` when adding persistent state.
  - File: [src/utils/localStorage.js](src/utils/localStorage.js)

- Redux slices: domain slices live in `src/store/*.js`. Each slice is responsible for persisting its own state with `setItem` after mutations.
  - Slots logic: [src/store/slotsSlice.js](src/store/slotsSlice.js)
  - Vehicles logic: [src/store/vehiclesSlice.js](src/store/vehiclesSlice.js)
  - Store listeners (side effects like slot occupancy): [src/store/store.js](src/store/store.js)

- Slot usage flow (important):
  1. Vehicle entry dispatches `vehicles/addInVehicle` with `slotId` included (see `src/pages/VehicleEntryPage.jsx`).
  2. `createListenerMiddleware` in `src/store/store.js` listens for `vehicles/addInVehicle` and dispatches `slots/incrementSlotUsage`.
  3. Exiting (normal or lost-token) dispatches `vehicles/moveToOutVehicle` or `vehicles/moveToLostToken`; the listener decrements the corresponding slot via `slots/decrementSlotUsage`.

  When changing this flow, update the listener in `src/store/store.js` so slot counters stay in sync.

Project-specific conventions

- Slices persist to localStorage inside reducers. Do not move persistence to components; follow the existing pattern in `src/store/*Slice.js`.
- Vehicle category -> type mapping in `src/pages/VehicleEntryPage.jsx` is currently string-based (checks for "bike" in category name). If you change categories, update this mapping.
- Slot capacity cannot be lower than `used`. `slotsSlice.updateSlot` clamps capacity to `used` — preserve or extend this behavior when modifying slot logic.

UI expectations

- Tailwind CSS only. Use existing utility classes and avoid custom gradients or heavy animations.
- Admin dashboard pages: slots are managed in `src/pages/SlotManagementPage.jsx`. The page must:
  - Allow add/edit/delete (delete blocked if `used > 0`).
  - Show `name`, `type`, `capacity`, `used`, `available`, and `status`.
- Vehicle Entry: `Select Slot` must show type-matching slots; full slots should appear disabled. If no enabled slots, show `No slot available` and block submission.

Testing and verification notes

- Manual verification steps after edits:
  1. Run `npm run dev` and open the app.
  2. Go to Slot Management -> Add a slot (Car/Bike/Both) and set capacity.
  3. Go to Vehicle Entry -> choose category -> observe slot dropdown (disabled for full slots).
  4. Enter a vehicle: confirm `slots.used` increments and persists after refresh.
  5. Exit the vehicle (normal or lost token): confirm `slots.used` decrements and persists.

If unsure where to edit

- For state persistence and business rules: edit the slice (`src/store/slotsSlice.js` or `src/store/vehiclesSlice.js`).
- For UI and form validation: edit the page component (`src/pages/SlotManagementPage.jsx`, `src/pages/VehicleEntryPage.jsx`).
- For global side-effects (automatic increments/decrements and stats): edit listener middleware in `src/store/store.js`.

When proposing code changes

- Keep changes small and focused; follow existing Redux Toolkit patterns.
- Use `STORAGE_KEYS` from `src/utils/localStorage.js` for all localStorage keys.
- Validate capacity vs `used` before allowing changes; do not rely on client-only UI checks.

Ask the developer if any assumptions are unclear (category naming conventions, intended slot naming rules, or desired limits for capacities).
