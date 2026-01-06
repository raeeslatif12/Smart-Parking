import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setUsername, setPassword, resetLoginForm } from "../store/authSlice";
import { FaUser, FaLock, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Login = () => {
  const username = useSelector((state) => state.auth.username);
  const password = useSelector((state) => state.auth.password);
  const admins = useSelector((state) => state.admins.list);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const storedCredentials = useSelector((state) => state.auth.storedCredentials);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [validationSuccess, setValidationSuccess] = useState(false);
  
  const autoLoginAttemptedRef = useRef(false);

  useEffect(() => {
    if (autoLoginAttemptedRef.current) return;
    autoLoginAttemptedRef.current = true;

    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    if (storedCredentials && storedCredentials.username && storedCredentials.password) {
      setIsValidating(true);
      
      try {
        const admin = admins.find(
          (admin) => admin.username === storedCredentials.username && 
                     admin.password === storedCredentials.password
        );

        if (admin) {
          setValidationSuccess(true);
          setValidationError("");
          
          setTimeout(() => {
            dispatch(login(admin));
            navigate("/dashboard");
          }, 500);
        } else {
          setValidationError("Stored credentials are no longer valid. Please log in manually.");
          setIsValidating(false);
        }
      } catch (error) {
        setValidationError("An error occurred during auto-login. Please log in manually.");
        setIsValidating(false);
        console.error("Auto-login error:", error);
      }
    }
  }, [storedCredentials, admins, isAuthenticated, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setValidationError("Please enter both username and password");
      return;
    }

    setIsValidating(true);
    setValidationError("");
    setValidationSuccess(false);

    try {
      const admin = admins.find(
        (admin) => admin.username === username.trim() && admin.password === password.trim()
      );

      if (admin) {
        setValidationSuccess(true);
        setValidationError("");
        
        setTimeout(() => {
          dispatch(login(admin));
          navigate("/dashboard");
        }, 300);
      } else {
        setValidationSuccess(false);
        setValidationError("Invalid username or password");
      }
    } catch (error) {
      setValidationSuccess(false);
      setValidationError("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = () => {
    if (validationError || validationSuccess) {
      setValidationError("");
      setValidationSuccess(false);
    }
  };

  const handleInputFocus = (e) => {
    const originalValue = e.target.value;
    
    e.target.value = "";
    
    setTimeout(() => {
      if (e.target.value === "") {
        e.target.value = originalValue;
      }
    }, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <img
            src="Parking Sign Flat Style.jpg"
            alt="Logo"
            className="mx-auto h-28 w-auto mb-4"
          />

          <h2 className="text-4xl font-extrabold text-gray-900 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">Sign in to your Car Parking account</p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  dispatch(setUsername(e.target.value));
                  handleInputChange();
                }}
                autoComplete="off"
                onFocus={handleInputFocus}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className="appearance-none relative block w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent focus:bg-white transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  dispatch(setPassword(e.target.value));
                  handleInputChange();
                }}
                autoComplete="off"
                onFocus={handleInputFocus}
              />
            </div>
          </div>

          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <FaTimesCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{validationError}</p>
            </div>
          )}

          {isValidating && !validationSuccess && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <FaSpinner className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 animate-spin" />
              <p className="text-sm font-medium text-blue-800">Verifying credentials...</p>
            </div>
          )}

          {validationSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <FaCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-green-800">Credentials verified! Logging in...</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isValidating || validationSuccess}
              className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white transition-all duration-200 ${
                isValidating || validationSuccess
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-[#155dfc] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155dfc]"
              }`}
            >
              {isValidating && <FaSpinner className="h-4 w-4 animate-spin" />}
              {validationSuccess ? "Logging in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Click "Sign In" to log in with your credentials</p>
            <p className="mt-1">Demo: username: <strong>super</strong> | password: <strong>password</strong></p>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Secure parking management system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
