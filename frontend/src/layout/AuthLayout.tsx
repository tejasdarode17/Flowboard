import { Outlet } from "react-router-dom";
import AuthLeftSection from "../features/auth/components/AuthLeftSection";

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftSection></AuthLeftSection>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default AuthLayout;
