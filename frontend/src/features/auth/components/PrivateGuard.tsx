import MainLoder from "@/shared/components/MainLoder";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PrivateGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((store) => store.auth);
  if (isLoading) return <MainLoder></MainLoder>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default PrivateGuard;
