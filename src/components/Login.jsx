import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setUsername, setPassword } from "../store/authSlice";
import { FaCar, FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const username = useSelector((state) => state.auth.username);
  const password = useSelector((state) => state.auth.password);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === user?.name && password === user?.password) {
      dispatch(login(user));
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-50 via-white to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <div className="text-center">
          <img
            src="/Parking Sign Flat Style.jpg"
            alt="Logo"
            className="mx-auto h-24 w-auto mb-0"
          />

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your Car Parking account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => dispatch(setUsername(e.target.value))}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform "
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Secure parking management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
