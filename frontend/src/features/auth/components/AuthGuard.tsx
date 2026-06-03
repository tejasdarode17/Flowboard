import { useAppSelector } from "@/shared/hooks/useAppSelector";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);

  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AuthGuard;
