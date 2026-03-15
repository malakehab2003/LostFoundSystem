import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="my-10 bg-gray-50 antialiased">
      <div className="min-h-screen mx-auto">
        <Nav />
        <Outlet />

        <Footer />
      </div>
    </div>
  );
}
