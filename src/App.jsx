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
import SlotManagementPage from "./pages/SlotManagementPage";
import AddSlotPage from "./pages/AddSlotPage";
import ExpenseManagementPage from "./pages/ExpenseManagementPage";
import AddExpensePage from "./pages/AddExpensePage";
import AlertsPage from "./pages/AlertsPage";
import SlotTypesManagementPage from "./pages/SlotTypesManagementPage";
import ExpenseTypesManagementPage from "./pages/ExpenseTypesManagementPage";
import AddSlotTypePage from "./pages/AddSlotTypePage";
import AddExpenseTypePage from "./pages/AddExpenseTypePage";
import AdminManagementPage from "./pages/AdminManagementPage";
import AddAdminPage from "./pages/AddAdminPage";
import EditAdminPage from "./pages/EditAdminPage";
import BlockedVehiclesPage from "./pages/BlockedVehiclesPage";
import BulkActionsPage from "./pages/BulkActionsPage";
import QuickActionsPage from "./pages/QuickActionsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import HeatmapAnalyticsPage from "./pages/HeatmapAnalyticsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

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
          <Route path="slots" element={<SlotManagementPage />} />
          <Route path="add-slot" element={<AddSlotPage />} />
          <Route path="add-category" element={<AddCategoryPage />} />
          <Route path="edit-category/:id" element={<EditCategoryPage />} />
          <Route path="vehicle-entry" element={<VehicleEntryPage />} />
          <Route path="in-vehicles" element={<InVehiclesPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
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
          <Route path="expense-management" element={<ExpenseManagementPage />} />
          <Route path="add-expense" element={<AddExpensePage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="slot-types" element={<SlotTypesManagementPage />} />
          <Route path="add-slot-type" element={<AddSlotTypePage />} />
          <Route path="expense-types" element={<ExpenseTypesManagementPage />} />
          <Route path="add-expense-type" element={<AddExpenseTypePage />} />
          <Route
            path="admin-management"
            element={
              <AdminProtectedRoute>
                <AdminManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin-management/add"
            element={
              <AdminProtectedRoute>
                <AddAdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="admin-management/edit/:id"
            element={
              <AdminProtectedRoute>
                <EditAdminPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="blocked-vehicles"
            element={
              <AdminProtectedRoute>
                <BlockedVehiclesPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="bulk-actions"
            element={
              <AdminProtectedRoute>
                <BulkActionsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="quick-actions"
            element={
              <AdminProtectedRoute>
                <QuickActionsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="audit-logs"
            element={
              <AdminProtectedRoute>
                <AuditLogsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <AdminProtectedRoute>
                <HeatmapAnalyticsPage />
              </AdminProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
