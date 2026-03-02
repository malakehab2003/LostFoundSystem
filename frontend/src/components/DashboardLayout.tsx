import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

const DashboardLayout = () => {
  const { data: user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isLoading)
  //     return (
  //       <Spinner className="w-8 h-8 text-primary place-self-center "></Spinner>
  //     );
  //   if (!isLoading && !user) {
  //     navigate("/login");
  //   }
  // }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
