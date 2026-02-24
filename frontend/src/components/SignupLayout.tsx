// SignupLayout.tsx
import { Outlet } from "react-router-dom";
const SignupLayout = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="w-full h-1.5 bg-purple-100 relative">
        <div className="h-full bg-[#5C2D91] transition-all duration-500 ease-in-out" />
      </div>

      <Outlet />
    </div>
  );
};

export default SignupLayout;
