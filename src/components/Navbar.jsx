import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { toast } from "react-toastify";
import { FaParking, FaBars, FaCog, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("edit-profile");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-4 p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <FaBars className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <FaParking className="w-6 h-6 text-gray-900" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-wide">
                Smart Parking
              </h1>
            </div>
          </div>

          <div className="flex items-center relative">
            <span className="hidden sm:block mr-4 text-gray-900 text-sm font-medium">
              Welcome, {user?.name || "User"}
            </span>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold border border-gray-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-3 border-b bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FaCog className="text-gray-500" />
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
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
