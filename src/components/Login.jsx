import React, { useState } from "react";
import { Eye, EyeOff, Play } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("rahul");
  const [password, setPassword] = useState("rahul@2021");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const userDetails = { username, password };

    try {
      const response = await fetch("https://apis.ccbp.in/login", {
        method: "POST",
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("jwt_token", data.jwt_token, { expires: 30, path: "/" });
        navigate("/", { replace: true });
      } else {
        setErrorMsg(data.error_msg || "Invalid Credentials");
      }
    } catch (error) {
      setErrorMsg("Network error, try again.");
    }
  };
  if (Cookies.get("jwt_token")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg px-8 py-10">
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-red-600 rounded-lg p-2">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <img src={Logo} alt="logo" className="h-12" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 text-black"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-red-600 hover:text-red-800">
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg 
            hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
