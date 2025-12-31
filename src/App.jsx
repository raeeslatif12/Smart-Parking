import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadAuth } from "./store/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import VehicleCategoriesPage from "./pages/VehicleCategoriesPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import VehicleEntryPage from "./pages/VehicleEntryPage";
import InVehiclesPage from "./pages/InVehiclesPage";
import OutVehiclesPage from "./pages/OutVehiclesPage";
import ManageIncomingVehiclePage from "./pages/ManageIncomingVehiclePage";
import OutVehicleDetailsPage from "./pages/OutVehicleDetailsPage";
import EditProfilePage from "./pages/EditProfilePage";
import TotalIncomePage from "./pages/TotalIncomePage";
import LostTokenPage from "./pages/LostTokenPage";
import LostTokenFormPage from "./pages/LostTokenFormPage";
import FeeManagementPage from "./pages/FeeManagementPage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path="vehicle-categories"
            element={<VehicleCategoriesPage />}
          />
          <Route path="add-category" element={<AddCategoryPage />} />
          <Route path="edit-category/:id" element={<EditCategoryPage />} />
          <Route path="vehicle-entry" element={<VehicleEntryPage />} />
          <Route path="in-vehicles" element={<InVehiclesPage />} />
          <Route
            path="manage-incoming/:vehicleId"
            element={<ManageIncomingVehiclePage />}
          />
          <Route path="out-vehicles" element={<OutVehiclesPage />} />
          <Route
            path="out-vehicle-details/:vehicleId"
            element={<OutVehicleDetailsPage />}
          />
          <Route path="lost-token" element={<LostTokenPage />} />
          <Route path="lost-token/:vehicleId" element={<LostTokenFormPage />} />
          <Route path="total-income" element={<TotalIncomePage />} />
          <Route path="fee-management" element={<FeeManagementPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
