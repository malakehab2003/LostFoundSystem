import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const DashboardLayout = () => {
  const { token } = useAuth();
  const { user } = useCurrentUser();
  if (!token || !user || user.is_verified == false) {
    return <Navigate to="/" />;
  }
  return (
    <div className="py-10 px-3 xl:px-6 mx-auto">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
