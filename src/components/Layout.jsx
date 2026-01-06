import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 w-64"
      />
      <main className="fixed top-16 right-0 bottom-0 overflow-y-auto bg-gray-50 left-0 lg:left-64">
        <div className="p-4 sm:p-6">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
