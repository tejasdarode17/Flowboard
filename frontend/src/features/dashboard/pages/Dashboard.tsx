import { useParams } from "react-router-dom";
import { CheckCircle2, CircleDot, FolderKanban, Users } from "lucide-react";
import { useMembers } from "@/features/workspace/hooks/useMembers";
import { useProjects } from "@/features/projects/hooks/useProjects";
import CreateProject from "@/features/projects/components/CreateProject";
import InviteMember from "@/features/workspace/components/InviteMember";
import { useWorkspacesDetails } from "@/features/workspace/hooks/useWorkspaceDetails";
import RecentProjectsDashboard from "../components/RecentProjectsDashboard";
import MyIssuesDashboard from "../components/MyIssuesDashboard";
import DashboardShimmer from "../shimmer/DashboardShimmer";
import { useUserIssues } from "@/features/projects/hooks/useUserIssues";
import type { Issue } from "@/features/projects/types/issue.types";

const Dashboard = () => {
  const { workspaceSlug } = useParams();

  const { data: workspace, isLoading: workspaceLoading } = useWorkspacesDetails(workspaceSlug || "");
  const { data: projects, isLoading: projectsLoading } = useProjects(workspaceSlug || "");
  const { data: members, isLoading: membersLoading } = useMembers(workspaceSlug || "");
  const { data: myIssues } = useUserIssues(workspaceSlug!);

  const isOwnerOrAdmin = workspace?.role === "ADMIN" || workspace?.role === "OWNER";
  const totalProjects = projects?.length || 0;
  const totalMembers = members?.length || 0;

  const openIssues = myIssues?.filter((i: Issue) => i.status !== "DONE") || [];
  const completedIssues = myIssues?.filter((i: Issue) => i.status === "DONE") || [];

  if (workspaceLoading || projectsLoading || membersLoading) {
    return <DashboardShimmer />;
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border/40 bg-muted/50 flex items-center justify-center shrink-0">
            {workspace?.logo ? (
              <img src={workspace.logo} alt={workspace.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-semibold font-heading text-muted-foreground">{workspace?.name?.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold font-heading tracking-tight truncate">{workspace?.name}</h1>
            <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
              <span>
                {totalMembers} {totalMembers === 1 ? "member" : "members"}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>
                {totalProjects} {totalProjects === 1 ? "project" : "projects"}
              </span>
            </div>
          </div>
        </div>

        {isOwnerOrAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <InviteMember />
            <CreateProject />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Projects</p>
            <div className="flex items-center justify-center h-8 w-8 rounded-lg border bg-blue-500/5 border-blue-500/10">
              <FolderKanban size={15} className="text-blue-500" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-heading tabular-nums">{totalProjects}</p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Members</p>
            <div className="flex items-center justify-center h-8 w-8 rounded-lg border bg-purple-500/5 border-purple-500/10">
              <Users size={15} className="text-purple-500" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-heading tabular-nums">{totalMembers}</p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Open Issues</p>
            <div className="flex items-center justify-center h-8 w-8 rounded-lg border bg-amber-500/5 border-amber-500/10">
              <CircleDot size={15} className="text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-heading tabular-nums">{openIssues.length}</p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
            <div className="flex items-center justify-center h-8 w-8 rounded-lg border bg-emerald-500/5 border-emerald-500/10">
              <CheckCircle2 size={15} className="text-emerald-500" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold font-heading tabular-nums">{completedIssues.length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentProjectsDashboard workspaceSlug={workspaceSlug!} />
          {/* <WorkspaceActivityDashboard workspaceSlug={workspaceSlug!} /> */}
        </div>
        <div className="space-y-6">
          <MyIssuesDashboard workspaceSlug={workspaceSlug!} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
