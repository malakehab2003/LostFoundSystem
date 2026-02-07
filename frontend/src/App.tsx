import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupLayout from "./components/SignupLayout";
import SignupEmail from "./components/SignupEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/home/Home";
import Layout from "./pages/home/Layout";
import About from "./pages/home/About";
import SignupPhone from "./components/SignupPhone";
import SignupPhoto from "./components/SignupPhoto";
import SignupLocation from "./components/SignupLocation";
import LostItems from "./pages/LostItems";
import LostItem from "./pages/LostItem";
import Dashboard from "./pages/Dashboard";
import DashInfo from "./components/DashInfo";
import DashboardLayout from "./components/DashboardLayout";
import DashItem from "./components/DashItem";
import DashItemInfo from "./components/DashItemInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Routes under main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="lost" element={<LostItems />} />
          <Route path="/lost/:itemId" element={<LostItem />} />

          {/* Nested signup routes */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="info" element={<DashInfo />} />
            <Route path="item/:itemId" element={<DashItem />} />
            <Route path="item/:itemId/info" element={<DashItemInfo />} />
          </Route>

          {/* Nested signup routes */}
          <Route path="signup" element={<SignupLayout />}>
            <Route index element={<Navigate replace to="name" />} />
            <Route path="name" element={<Signup />} />
            <Route path="email" element={<SignupEmail />} />
            <Route path="phone" element={<SignupPhone />} />
            <Route path="upload-photo" element={<SignupPhoto />} />
            <Route path="upload-location" element={<SignupLocation />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
