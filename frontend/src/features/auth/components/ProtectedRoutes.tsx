import { useAppSelector } from "@/shared/hooks/useAppSelector";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);

  const location = useLocation();
  const path = location.pathname;

  if (!isAuthenticated && !path.startsWith("/auth")) {
    return <Navigate to={"/auth"} replace></Navigate>;
  }

  if (isAuthenticated && path.startsWith("/auth")) {
    return <Navigate to={"/"} replace></Navigate>;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
