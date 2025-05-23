"use client";

import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import logo from "../assets/logo.png";
import loginImage from "../assets/login_element.svg";

const Login = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleEmailAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white items-center justify-center">
      {/* Container with fixed width */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl shadow-xl rounded-lg overflow-hidden border border-gray-200">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-white">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6 px-6">
              <img src={logo} alt="Travel Voyanix Logo" className="h-24 w-auto" />
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8 relative overflow-hidden">
              <div
                className={`absolute top-0 bottom-0 w-1/2 bg-black rounded-md transition-all duration-500 ${isSignup ? "left-0" : "left-1/2"
                  }`}
              />
              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 z-10 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 ${isSignup ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 z-10 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 ${!isSignup ? "text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Log In
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Begin Your Adventure</h2>
              <p className="text-gray-500 text-sm">Sign up with Open account</p>
            </div>

            {/* Social Login */}
            <div className="mb-6">
              <button
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-semibold">OR</span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${isSignup ? "max-h-20 opacity-100 mb-2" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-3 top-1 text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-gray-500"
                  >
                    Username
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg peer"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-1 text-xs text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 pt-5 pb-2 pr-10 border border-gray-300 rounded-lg peer"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-1 text-xs text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <button
                onClick={handleEmailAuth}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                {"Let's Start"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-50 px-4 py-6">
          <div className="w-4/5 max-w-lg relative z-10 floating-image">
            <img
              src={loginImage}
              alt="Illustration"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .floating-image {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
