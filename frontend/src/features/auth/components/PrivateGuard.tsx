import { useAppSelector } from "@/shared/hooks/useAppSelector";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PrivateGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default PrivateGuard;
