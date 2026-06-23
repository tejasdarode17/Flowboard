import MainLoder from "@/shared/components/MainLoder";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((store) => store.auth);
  if (isLoading) return <MainLoder></MainLoder>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AuthGuard;
