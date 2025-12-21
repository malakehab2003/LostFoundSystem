import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";
const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="mb-4 aspect-2/1 h-20 object-contain"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "border-b-2 border-slate-500 text-slate-800"
                : "text-slate-400"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "signup"
                ? "border-b-2 border-slate-500 text-slate-800"
                : "text-slate-400"
            }`}
          >
            <Link to="/signup" className="w-full h-full">
              Sign Up
            </Link>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          <div className="flex border rounded overflow-hidden">
            <div className="bg-slate-100 p-3 border-r">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="email"
              placeholder="yours@example.com"
              className="w-full px-4 py-2 outline-none text-slate-600 placeholder:text-slate-300"
            />
          </div>

          <div className="flex border rounded overflow-hidden">
            <div className="bg-slate-100 p-3 border-r">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="password"
              placeholder="your password"
              className="w-full px-4 py-2 outline-none text-slate-600 placeholder:text-slate-300"
            />
          </div>

          <div className="text-center">
            <button className="text-xs font-medium text-slate-500 hover:underline">
              <Link to="/forgot-password">Don't remember your password?</Link>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 flex items-center justify-center gap-2 transition-colors">
          LOG IN
          <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
