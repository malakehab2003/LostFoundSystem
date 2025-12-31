import { Mail, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Logo Section */}
        <div className="relative flex flex-col items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="mb-4 aspect-2/1 h-20 object-contain"
          />
          <div className="absolute top-5 left-5 bg-violet-200 rounded-full p-1 opacity-70 hover:opacity-100">
            <Link
              to="/login"
              className="w-full h-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-violet-500" />
            </Link>
          </div>
        </div>
        <div>
          <p className="text-slate-400 text-center text-xs leading-tight max-w-lg mb-2 px-3">
            Please enter your email address. We will send you an email to reset
            your password.
          </p>
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
        </div>

        {/* CTA Button */}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
