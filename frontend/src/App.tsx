import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupLayout from "./ui/SignupLayout";
import SignupEmail from "./ui/SignupEmail";
import SignupPassword from "./ui/SignupPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        <Route path="signup" element={<SignupLayout />}>
          <Route index element={<Navigate replace to="name" />} />
          <Route path="name" index element={<Signup />} />
          <Route path="email" element={<SignupEmail />} />
          <Route path="password" element={<SignupPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
