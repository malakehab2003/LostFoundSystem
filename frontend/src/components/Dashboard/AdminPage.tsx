import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
