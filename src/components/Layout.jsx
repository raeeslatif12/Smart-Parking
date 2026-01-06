import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import { getItem, setItem, STORAGE_KEYS } from "../utils/localStorage";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const collapsed = getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);
    setIsSidebarCollapsed(collapsed);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    const newCollapsed = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsed);
    setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, newCollapsed);
  };

  return (
    <div className="h-screen bg-gray-50">
      <Navbar
        toggleSidebar={toggleSidebar}
        className="fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-50"
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-80 lg:w-64'}`}
      />
      <main className={`fixed top-16 right-0 bottom-0 overflow-y-auto bg-gray-50 transition-all duration-300 left-0 ${isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}`}>
        <div className="p-4 sm:p-6">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
