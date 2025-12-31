import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdCategory,
  MdAdd,
  MdDirectionsCar,
  MdExitToApp,
  MdAttachMoney,
  MdWarning,
  MdMonetizationOn,
} from "react-icons/md";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: ".", fullPath: "/dashboard", icon: MdDashboard },
    {
      name: "Vehicle Categories",
      path: "vehicle-categories",
      fullPath: "/dashboard/vehicle-categories",
      icon: MdCategory,
    },
    {
      name: "Vehicle Entry",
      path: "vehicle-entry",
      fullPath: "/dashboard/vehicle-entry",
      icon: MdAdd,
    },
    {
      name: "In Vehicles",
      path: "in-vehicles",
      fullPath: "/dashboard/in-vehicles",
      icon: MdDirectionsCar,
    },
    {
      name: "Out Vehicles",
      path: "out-vehicles",
      fullPath: "/dashboard/out-vehicles",
      icon: MdExitToApp,
    },
    {
      name: "Lost Token",
      path: "lost-token",
      fullPath: "/dashboard/lost-token",
      icon: MdWarning,
    },
    {
      name: "Total Income",
      path: "total-income",
      fullPath: "/dashboard/total-income",
      icon: MdAttachMoney,
    },
    {
      name: "Fee Management",
      path: "fee-management",
      fullPath: "/dashboard/fee-management",
      icon: MdMonetizationOn,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed left-0 top-0 z-30 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center p-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-lg font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <p className="mt-3 text-gray-900 font-medium text-sm">
              {user?.name || "User"}
            </p>
          </div>
          <nav
            className="flex-1 px-4 py-6 overflow-y-auto sidebar-nav"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-4 rounded-lg text-lg font-medium transition-colors ${
                        location.pathname === item.fullPath
                          ? "bg-gray-100 text-gray-900 border-r-2 border-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() =>
                        window.innerWidth < 1024 && toggleSidebar()
                      }
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
