import React, { useState } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import logo from "@/assets/logowebsite.png";
import defaultProfile from "@/assets/default-profile.webp";
import { Menu, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Notifications from "@/components/Notifications";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/cart/serves/GetCard";
import { useAuth } from "@/lib/AuthContext";

export default function Nav() {
  let { data: cartitem } = useQuery({
    queryKey: ["get cart"],
    queryFn: getCart,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const typeFromUrl = searchParams.get("type") as "lost" | "found" | null;
  const { token } = useAuth();
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
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
        <Link
          to="/"
          className="flex items-center space-x-2 group flex-shrink-0"
          onClick={closeNav}
        >
          <div className="relative">
            <img src={logo} className="h-10 w-auto" alt="Logo" />
          </div>
          <span className="self-center text-lg md:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
            ضايع
          </span>
        </Link>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-1">
            <li>
              <NavLink
                to="/items?type=lost"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    typeFromUrl === "lost" || null
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
                to="/items?type=found"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    typeFromUrl === "found"
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
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                to="/shop/Products"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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

          {/* User Actions - Desktop */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            {token && (
              <Link to="/cart" className="relative group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                {cartitem?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartitem.length}
                  </span>
                )}
              </Link>
            )}

            {user && (
              <>
                <Notifications />
                <Link
                  to="/dashboard/messages"
                  className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <Link to="/dashboard" className="cursor-pointer">
                  <img
                    src={user.image || defaultProfile}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 hover:ring-primary transition-all duration-300"
                  />
                </Link>
              </>
            )}

            {user ? (
              <Button
                onClick={() => logoutUser()}
                variant="outline"
                className="text-sm border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                Logout
              </Button>
            ) : (
              <Button
                asChild
                className="text-sm bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggle}
          type="button"
          className="inline-flex md:hidden items-center p-2 w-10 h-10 justify-center text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-300"
          aria-controls="navbar-mobile"
          aria-expanded={isNavOpen}
        >
          {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden w-full mt-4 pb-4 border-t border-gray-100">
            {/* Navigation Links - Mobile */}
            <ul className="flex flex-col gap-1 mb-4">
              <li>
                <NavLink
                  to="/items?type=lost"
                  onClick={closeNav}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                  to="/items?type=found"
                  onClick={closeNav}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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

            {/* Mobile Actions */}
            <div className="flex flex-col gap-3 px-4 border-t border-gray-100 pt-4">
              {token && (
                <Link
                  to="/cart"
                  onClick={closeNav}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  <span>
                    Cart {cartitem?.length > 0 && `(${cartitem.length})`}
                  </span>
                </Link>
              )}

              {user && (
                <>
                  <div className="flex items-center gap-3">
                    <Notifications />
                    <Link
                      to="/dashboard/messages"
                      onClick={closeNav}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={closeNav}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={user.image || defaultProfile}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                    />
                    <span className="text-sm text-gray-600">My Dashboard</span>
                  </Link>
                </>
              )}

              <div className="flex flex-col gap-2">
                {user ? (
                  <Button
                    onClick={() => {
                      logoutUser();
                      closeNav();
                    }}
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
                    <Link to="/login" onClick={closeNav}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
