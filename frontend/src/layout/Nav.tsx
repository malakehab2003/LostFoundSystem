import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logowebsite.png";
import defaultProfile from "@/assets/default-profile.webp";
import { Menu, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Notifications from "@/components/Notifications";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function Nav() {
  const { user } = useCurrentUser();
  const { logoutUser } = useLogout();
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  function toggle() {
    setIsNavOpen((prev) => !prev);
  }

  function closeNav() {
    setIsNavOpen(false);
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 top-0 start-0 border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group" onClick={closeNav}>
          <div className="relative">
            <img src={logo} className="h-12 w-auto" alt="Logo" />
          </div>
          <span className="self-center text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
            ضايع
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-300"
          aria-controls="navbar-default"
          aria-expanded={isNavOpen}
        >
          {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation Links - Desktop & Mobile */}
        <div
          className={`${
            isNavOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:items-center md:gap-6 transition-all duration-300 ease-in-out`}
        >
          <ul className="flex flex-col md:flex-row gap-2 md:gap-1 mt-6 md:mt-0">
            <li>
              <NavLink
                to="/something-lost"
                onClick={closeNav}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`
                }
              >
                Something Lost
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/something-found"
                onClick={closeNav}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`
                }
              >
                Something Found
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                onClick={closeNav}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`
                }
              >
                How To Help
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                onClick={closeNav}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`
                }
              >
                Shop
              </NavLink>
            </li>
          </ul>

          {/* User Section - Mobile */}
          <div className="flex flex-col md:hidden gap-3 mt-6 pt-6 border-t border-gray-100">
            {user && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3 items-center">
                  <Notifications />
                  <Link
                    to="/dashboard/messages"
                    onClick={closeNav}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Link>
                </div>
                <Link to="/dashboard" onClick={closeNav} className="cursor-pointer">
                  <img
                    src={user.image_url || defaultProfile}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                  />
                </Link>
              </div>
            )}
            {user ? (
              <Button 
                onClick={() => logoutUser()} 
                variant="outline"
                className="w-full border-gray-200 hover:border-primary/30 hover:bg-primary/5"
              >
                Logout
              </Button>
            ) : (
              <Button 
                asChild 
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                <Link to="/login" onClick={closeNav}>Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* User Section - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <div className="flex gap-2 items-center">
              <Notifications />
              <Link
                to="/dashboard/messages"
                className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
            </div>
          )}
          
          {user && (
            <Link to="/dashboard" className="cursor-pointer">
              <img
                src={user.image_url || defaultProfile}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 hover:ring-primary transition-all duration-300"
              />
            </Link>
          )}
          
          {user ? (
            <Button 
              onClick={() => logoutUser()} 
              variant="outline"
              className="border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              Logout
            </Button>
          ) : (
            <Button 
              asChild 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}