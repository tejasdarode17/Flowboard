import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect, type JSX } from "react";
import { checkAuth } from "./redux/authSlice";
import { useAppDispatch } from "./shared/hooks/useAppDispatch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthGuard from "./features/auth/components/AuthGuard";
import PrivateGuard from "./features/auth/components/PrivateGuard";
import MainLoder from "./shared/components/MainLoder";

// Layouts — eager load (chhote, immediately chahiye)
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";
import WorkspaceLayout from "./layout/WorkspaceLayout";

// Pages — lazy load
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const VerifyAccount = lazy(() => import("./features/auth/pages/VerifyAccount"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgetPassword"));
const VerifyPasswordOtp = lazy(() => import("./features/auth/pages/VerifyPasswordOtp"));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"));
const Redirect = lazy(() => import("./features/auth/pages/Redirect"));

const Invite = lazy(() => import("./features/workspace/pages/Invite"));
const CreateWorkspacePage = lazy(() => import("./features/workspace/pages/CreateWorkspacePage"));
const Members = lazy(() => import("./features/workspace/pages/Members"));

const UserProfile = lazy(() => import("./features/profile/pages/UserProfile"));
const EditProfile = lazy(() => import("./features/profile/pages/EditProfile"));

const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard"));
const Projects = lazy(() => import("./features/projects/pages/Projects"));
const ProjectDetails = lazy(() => import("./features/projects/pages/ProjectDetails"));
const Settings = lazy(() => import("./features/settings/pages/Settings"));
const WorkspaceSettings = lazy(() => import("./features/workspace/pages/WorksapceSettings"));
const Activities = lazy(() => import("./features/activities/pages/Activities"));
const Notifications = lazy(() => import("./features/notifications/pages/Notifications"));

const NotFound = lazy(() => import("./shared/pages/NotFound"));

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<MainLoder />}>
    <Component />
  </Suspense>
);

const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <AuthGuard>
        <AuthLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
      { path: "verify", element: withSuspense(VerifyAccount) },
      { path: "forgot-password", element: withSuspense(ForgotPassword) },
      { path: "verify-password", element: withSuspense(VerifyPasswordOtp) },
      { path: "reset-password", element: withSuspense(ResetPassword) },
    ],
  },

  { path: "/invite/:token", element: withSuspense(Invite) },

  {
    path: "/",
    element: (
      <PrivateGuard>
        <MainLayout />
      </PrivateGuard>
    ),
    children: [
      { index: true, element: withSuspense(Redirect) },
      { path: "/workspace/create", element: withSuspense(CreateWorkspacePage) },
      { path: "profile/:username", element: withSuspense(UserProfile) },
      { path: "profile/edit/:username", element: withSuspense(EditProfile) },
      { path: "profile/:username/settings", element: withSuspense(Settings) },
      {
        path: ":workspaceSlug",
        element: <WorkspaceLayout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: "projects", element: withSuspense(Projects) },
          { path: "projects/:projectId", element: withSuspense(ProjectDetails) },
          { path: "team", element: withSuspense(Members) },
          { path: "settings", element: withSuspense(WorkspaceSettings) },
          { path: "activities", element: withSuspense(Activities) },
          { path: "notifications", element: withSuspense(Notifications) },
          { path: "*", element: withSuspense(NotFound) },
        ],
      },
    ],
  },
  { path: "*", element: withSuspense(NotFound) },
]);

// App.tsx
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
      <Suspense fallback={<MainLoder></MainLoder>}>
        <RouterProvider router={appRouter}></RouterProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;

//project curd/
// issue delete