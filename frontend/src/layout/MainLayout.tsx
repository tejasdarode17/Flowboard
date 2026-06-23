import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import OnboardingSidebar from "@/shared/components/OnboardingSidebar";
import Sidebar from "@/shared/components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { data: workspaces } = useWorkspaces();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        {workspaces?.length ? <Sidebar /> : <OnboardingSidebar />}
        <main className="overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
