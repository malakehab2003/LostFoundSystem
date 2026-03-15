import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import defaultProfile from "@/assets/default-profile.webp";
import { Menu, MessageSquare } from "lucide-react";
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
  return (
    <nav className="bg-background fixed w-full z-20 top-0 start-0 border-b border-default">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href={"/"} className="flex items-center space-x-3">
          <img src={logo} className="h-7" alt="Logo" />
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
            ضايع
          </span>
        </a>
        <button
          onClick={toggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-base md:hidden hover:text-primary focus:outline-none focus:ring-2"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div
          className={`${isNavOpen ? "block" : "hidden"} w-full md:flex md:w-auto gap-5 justify-between items-center`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <NavLink
                to="/something-lost"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 hover:text-primary ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                Something Lost
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/something-found"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 hover:text-primary ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                Something Found
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 hover:text-primary ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                How To Help
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded md:p-0 hover:text-primary ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                Shop
              </NavLink>
            </li>
          </ul>
        </div>
        <div
          className={`${isNavOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-3 items-center justify-between max-md:w-full`}
        >
          <div>
            {user && (
              <div className="flex gap-3 items-center justify-center">
                <Notifications />
                <Link
                  to="/dashboard/messages"
                  className="cursor-pointer hover:text-primary"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
          {user && (
            <Link to="/dashboard" className="cursor-pointer">
              <img
                src={user.image_url || defaultProfile}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
          )}
          {user ? (
            <Button variant="outline" onClick={() => logoutUser()}>
              Logout
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
