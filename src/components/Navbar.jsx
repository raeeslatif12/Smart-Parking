import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, resetLoginForm } from "../store/authSlice";
import { toast } from "react-toastify";
import { FaParking, FaBars, FaCog, FaSignOutAlt, FaBell, FaTimes } from "react-icons/fa";
import { markRead, dismissAlert } from "../store/alertsSlice";

const Navbar = ({ toggleSidebar, className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alertsRef = useRef(null);
  const alerts = useSelector((state) => state.alerts || []);
  const unreadCount = alerts.filter((a) => a.status === "new").length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleClickOutsideAlerts = (event) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target)) {
        setIsAlertsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideAlerts);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    
    dispatch(resetLoginForm());
    
    toast.success("Logged out successfully!");
    
    navigate("/");
    
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    navigate("/dashboard/edit-profile");
    setIsOpen(false);
  };

  return (
    <nav className={`relative border-b border-gray-100 bg-white shadow-sm ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-4 p-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:shadow-md"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-[#155dfc] p-2 sm:p-3 rounded-2xl shadow-lg">
                <FaParking className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Smart Parking
                </h1>
                <p className="text-xs text-gray-500 -mt-1 font-medium hidden sm:block">Management System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center relative">
            <span className="hidden sm:block mr-4 text-gray-700 text-sm font-medium">
              Welcome, {user?.name || "User"}
            </span>

            <div className="mr-3 relative" ref={alertsRef}>
              <button
                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md relative group"
                aria-label="Notifications"
              >
                <FaBell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

                {isAlertsOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {alerts.filter(a => a.status !== 'dismissed').length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        <FaBell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No notifications
                      </div>
                    ) : (
                      alerts.filter(a => a.status !== 'dismissed').map((a) => (
                        <div key={a.id} className="px-4 py-3 flex items-start justify-between hover:bg-gray-50/80 transition-all duration-200 border-b border-gray-50 last:border-b-0">
                          <div className="flex-1 pr-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-800 font-medium">{a.message}</p>
                              <button onClick={(e) => { e.stopPropagation(); dispatch(dismissAlert(a.id)); }} className="text-gray-400 hover:text-gray-600 ml-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200">
                                <FaTimes className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{new Date(a.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-700 font-bold border border-gray-200/60 shadow-sm ring-2 ring-white/50">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100/80 overflow-hidden backdrop-blur-sm"
              >
                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#155dfc] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 tracking-tight">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Administrator</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 hover:shadow-sm"
                >
                  <FaCog className="text-gray-500 w-4 h-4" />
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm rounded-b-2xl"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
