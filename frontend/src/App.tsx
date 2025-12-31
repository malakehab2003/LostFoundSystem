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
