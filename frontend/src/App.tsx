import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupLayout from "./ui/SignupLayout";
import SignupEmail from "./ui/SignupEmail";
import SignupPassword from "./ui/SignupPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/home/Home";
import Layout from "./pages/home/Layout";
import About from "./pages/home/About";

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

          {/* Nested signup routes */}
          <Route path="signup" element={<SignupLayout />}>
            <Route index element={<Navigate replace to="name" />} />
            <Route path="name" element={<Signup />} />
            <Route path="email" element={<SignupEmail />} />
            <Route path="password" element={<SignupPassword />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
