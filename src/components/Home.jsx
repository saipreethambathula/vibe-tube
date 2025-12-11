import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../assets/logo.png";
import {
  Play,
  Home,
  TrendingUp,
  Gamepad2,
  BookmarkCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Home1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const logout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/trending", label: "Trending", icon: TrendingUp },
    { path: "/gaming", label: "Gaming", icon: Gamepad2 },
    { path: "/saved-videos", label: "Saved Videos", icon: BookmarkCheck },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 rounded-lg p-2">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <img src={Logo} className="h-8 " alt="logo" />
          </Link>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 overflow-hidden transition-all duration-300`}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home1;
