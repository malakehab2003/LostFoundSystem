import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

import Home from "./layout/Home";
import Layout from "./layout/Layout";
import About from "./layout/About";

import LostItems from "./components/LostItems";
import LostItem from "./components/LostItem";

import Dashboard from "./components/Dashboard/Dashboard";
import DashInfo from "./components/Dashboard/DashInfo";
import DashboardLayout from "./layout/DashboardLayout";
import DashItem from "./components/Dashboard/DashItem";
import DashItemInfo from "./components/Dashboard/DashItemInfo";
import DashAddress from "./components/Dashboard/DashAddress";

import Wishlist from "./components/Wishlist";
import Messages from "./components/Messages";

import Products from "./Shop/Products";
import SingleProduct from "./Shop/SingleProduct";
import { ItemDialog } from "./components/dialog/ItemDialog";
import Categray from "./Shop/categray";
import Cart from "./cart/Cart";

import AdminPage from "@/components/Dashboard/AdminPage";
import AdminUsers from "./components/Dashboard/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="lost" element={<LostItems />} />
          <Route path="lost/:itemId" element={<LostItem />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="info" element={<DashInfo />} />
            <Route path="messages" element={<Messages />} />
            <Route path="address" element={<DashAddress />} />
            <Route path="items/:itemId" element={<DashItem />} />
            <Route path="items/:itemId/info" element={<DashItemInfo />} />
            <Route path="itemdialog" element={<ItemDialog />} />
            <Route path="wishlist" element={<Wishlist />} />

            {/*  Admin Routes (جوه dashboard) */}
            <Route path="admin" element={<AdminPage />} />
            <Route path="/dashboard/admin-users" element={<AdminUsers />} />
          </Route>

          {/* Shop */}
          <Route path="shop" element={<Categray />} />
          <Route path="shop/products" element={<Products />} />
          <Route path="shop/products/:productId" element={<SingleProduct />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
