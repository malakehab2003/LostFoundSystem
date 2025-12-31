import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Login() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="self-center">
            <img
              src={logo}
              alt="Logo"
              className="mb-4 aspect-2/1 h-20 object-contain"
            />
          </div>
          <CardAction className="flex justify-between items-center w-full border-b">
            <Button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors rounded-none ${
                activeTab === "login"
                  ? "border-b-2 border-slate-500 text-slate-800"
                  : "text-slate-400"
              }`}
              variant="ghost"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors rounded-none ${
                activeTab === "signup"
                  ? "border-b-2 border-slate-500 text-slate-800"
                  : "text-slate-400"
              }`}
              variant="ghost"
            >
              <Link to="/signup" className="w-full h-full">
                Sign Up
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="p-6 space-y-4">
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
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default Login;
