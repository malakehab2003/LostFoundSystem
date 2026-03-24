import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import defaultProfile from "@/assets/default-profile.webp";
import { Menu, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Notifications from "@/components/Notifications";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AuthContext } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/cart/serves/GetCard";


export default function Nav() {
  let{data:cartitem}=useQuery({
        queryKey:['get cart'],
        queryFn:getCart,
        
    })

  ///////
  let {token} =useContext(AuthContext)
  console.log(token)
  /////////
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
          {token?<Link to='/cart'>
          {cartitem?.length>0?<div className="bg-chart-1 w-[40px] rounded-full text-center" >
            <span className="">{cartitem.length}</span></div>:null}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
</Link> :null}
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
