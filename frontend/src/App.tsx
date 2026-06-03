import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import { useEffect } from "react";
import { checkAuth } from "./redux/authSlice";
import { useAppDispatch } from "./shared/hooks/useAppDispatch";
import MainLayout from "./layout/MainLayout";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Projects from "./features/projects/pages/Projects";
import ProjectDetails from "./features/projects/pages/ProjectDetails";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Redirect from "./features/workspace/pages/Redirect";
import CreateWorkspacePage from "./features/workspace/pages/CreateWorkspacePage";
import WorkspaceLayout from "./layout/WorkspaceLayout";
import Members from "./features/workspace/pages/Members";
import Invite from "./features/workspace/pages/Invite";
import AuthGuard from "./features/auth/components/AuthGuard";
import PrivateGuard from "./features/auth/components/PrivateGuard";
import NotFound from "./shared/pages/NotFound";
import Settings from "./features/settings/pages/Settings";

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
    ],
  },

  {
    path: "/invite/:token",
    element: <Invite></Invite>,
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
      { path: "/workspace/create", element: <CreateWorkspacePage /> },
      {
        path: ":workspaceSlug",
        element: <WorkspaceLayout></WorkspaceLayout>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "projects", element: <Projects /> },
          { path: "projects/:projectId", element: <ProjectDetails /> },
          { path: "team", element: <Members></Members> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

const queryClient = new QueryClient();
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
