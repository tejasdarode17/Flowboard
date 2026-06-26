import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { checkAuth } from "./redux/authSlice";
import { useAppDispatch } from "./shared/hooks/useAppDispatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthGuard from "./features/auth/components/AuthGuard";
import PrivateGuard from "./features/auth/components/PrivateGuard";

// Layouts
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import WorkspaceLayout from "./layout/WorkspaceLayout";

// Auth
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import VerifyAccount from "./features/auth/pages/VerifyAccount";
import ForgotPassword from "./features/auth/pages/ForgetPassword";
import VerifyPasswordOtp from "./features/auth/pages/VerifyPasswordOtp";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Redirect from "./features/auth/components/Redirect";

// Workspace
import Invite from "./features/workspace/pages/Invite";
import CreateWorkspacePage from "./features/workspace/pages/CreateWorkspacePage";
import Members from "./features/workspace/pages/Members";
import WorkspaceSettings from "./features/workspace/pages/WorksapceSettings";

// Profile
import UserProfile from "./features/profile/pages/UserProfile";
import EditProfile from "./features/profile/pages/EditProfile";
import Settings from "./features/profile/pages/Settings";

// Dashboard
import Dashboard from "./features/dashboard/pages/Dashboard";
import Projects from "./features/projects/pages/Projects";
import ProjectDetails from "./features/projects/pages/ProjectDetails";
import Activities from "./features/activities/pages/Activities";
import Notifications from "./features/notifications/pages/Notifications";

// Shared
import NotFound from "./shared/pages/NotFound";

const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify", element: <VerifyAccount /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-password", element: <VerifyPasswordOtp /> },
      { path: "reset-password", element: <ResetPassword></ResetPassword> },
    ],
  },

  {
    path: "/invite/:token",
    element: <Invite />,
  },

  {
    path: "/",
    element: (
      <PrivateGuard>
        <MainLayout />
      </PrivateGuard>
    ),
    children: [
      { index: true, element: <Redirect /> },

      {
        path: "/workspace/create",
        element: <CreateWorkspacePage />,
      },

      {
        path: "profile/:username",
        element: <UserProfile />,
      },

      {
        path: "profile/edit/:username",
        element: <EditProfile />,
      },

      {
        path: "profile/:username/settings",
        element: <Settings />,
      },

      {
        path: ":workspaceSlug",
        element: <WorkspaceLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "projects", element: <Projects /> },
          { path: "projects/:projectId", element: <ProjectDetails /> },
          { path: "team", element: <Members /> },
          { path: "settings", element: <WorkspaceSettings /> },
          { path: "activities", element: <Activities /> },
          { path: "notifications", element: <Notifications /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}

export default App;
