// src/components/Sidebar.jsx
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTags,
  FaMapMarkedAlt,
  FaPlus,
  FaCar,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaWallet,
  FaMoneyBillWave,
  FaCalculator,
  FaList,
  FaBell,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar, className }) => {
  const user = useSelector((state) => state.auth.user);
  const alerts = useSelector((state) => state.alerts || []);
  const unreadCount = alerts.filter((a) => a.status === "new").length;
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
    { name: "Vehicle Categories", path: "/dashboard/vehicle-categories", icon: FaTags },
    { name: "Slot Management", path: "/dashboard/slots", icon: FaMapMarkedAlt },
    { name: "Vehicle Entry", path: "/dashboard/vehicle-entry", icon: FaPlus },
    { name: "In Vehicles", path: "/dashboard/in-vehicles", icon: FaCar },
    { name: "Out Vehicles", path: "/dashboard/out-vehicles", icon: FaSignOutAlt },
    { name: "Lost Token", path: "/dashboard/lost-token", icon: FaExclamationTriangle },
    { name: "Total Income", path: "/dashboard/total-income", icon: FaWallet },
    { name: "Alerts", path: "/dashboard/alerts", icon: FaBell },
    { name: "Fee Management", path: "/dashboard/fee-management", icon: FaMoneyBillWave },
    { name: "Expense Management", path: "/dashboard/expense-management", icon: FaCalculator },
    { name: "Slot Types", path: "/dashboard/slot-types", icon: FaList },
    { name: "Expense Types", path: "/dashboard/expense-types", icon: FaFileInvoiceDollar },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-white shadow-2xl border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} ${className || ""}`}
      >
        {/* User Info */}
        <div className="border-b border-gray-100 p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#155dfc] text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center py-3 px-4 rounded-xl transition-all duration-200 text-base font-medium overflow-hidden ${
                  isActive
                    ? "bg-[#155dfc]/10 text-[#155dfc] shadow-sm border border-[#155dfc]/20"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#155dfc]" : "text-gray-500 group-hover:text-gray-700"}`} />
                <span className="ml-3 truncate">{item.name}</span>
                {item.name === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
