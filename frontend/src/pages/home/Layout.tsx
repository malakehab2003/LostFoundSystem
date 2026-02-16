import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="pt-16">
      <Nav />
      <Outlet />

      <Footer />
    </div>
  );
}
