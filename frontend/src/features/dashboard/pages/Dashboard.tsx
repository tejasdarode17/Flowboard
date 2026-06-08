import { useParams } from "react-router-dom";
import { useMembers } from "@/features/workspace/hooks/useMembers";
import { useProjects } from "@/features/projects/hooks/useProjects";
import CreateProject from "@/features/projects/components/CreateProject";
import InviteMember from "@/features/workspace/components/InviteMember";
import { useWorkspacesDetails } from "@/features/workspace/hooks/useWorkspaceDetails";
import WorkspaceActivityDashboard from "../components/WorkspaceActivitiesDashboard";
import RecentProjectsDashboard from "../components/RecentProjectsDashboard";
import MainLoder from "@/shared/components/MainLoder";
import MyIssuesDashboard from "../components/MyIssuesDashboard";

const Dashboard = () => {
  const { workspaceSlug } = useParams();

  const { data: workspace, isLoading: workspaceLoading } = useWorkspacesDetails(workspaceSlug || "");
  const { data: projects, isLoading: projectsLoading } = useProjects(workspaceSlug || "");
  const { data: members, isLoading: membersLoading } = useMembers(workspaceSlug || "");

  const totalProjects = projects?.length || 0;
  const totalMembers = members?.length || 0;

  if (workspaceLoading || projectsLoading || membersLoading) {
    return <MainLoder></MainLoder>;
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border/50 bg-muted/50 flex items-center justify-center shrink-0 shadow-sm">
            {workspace?.logo ? (
              <img src={workspace.logo} alt={workspace.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">{workspace?.name?.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">{workspace?.name}</h1>
            <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
              <span>
                {totalMembers} {totalMembers === 1 ? "member" : "members"}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>
                {totalProjects} {totalProjects === 1 ? "project" : "projects"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <InviteMember />
          <CreateProject />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjectsDashboard workspaceSlug={workspaceSlug!} />
        <MyIssuesDashboard workspaceSlug={workspaceSlug!} />
        <div className="lg:col-span-2">
          <WorkspaceActivityDashboard workspaceSlug={workspaceSlug!} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
