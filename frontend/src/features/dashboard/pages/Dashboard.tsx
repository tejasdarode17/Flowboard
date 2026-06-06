import { Link, useParams } from "react-router-dom";
import { FolderKanban, ArrowUpRight, Clock, CircleDot, AlertCircle } from "lucide-react";
import { useMembers } from "@/features/workspace/hooks/useMembers";
import { useProjects } from "@/features/projects/hooks/useProjects";
import CreateProject from "@/features/projects/components/CreateProject";
import InviteMember from "@/features/workspace/components/InviteMember";
import { useWorkspacesDetails } from "@/features/workspace/hooks/useWorkspaceDetails";
import { useUserIssues } from "@/features/projects/hooks/useUserIssues";
import MainLoder from "@/shared/components/MainLoder";

const priorityConfig = {
  High: { color: "text-red-500", bg: "bg-red-500/10" },
  Medium: { color: "text-amber-500", bg: "bg-amber-500/10" },
  Low: { color: "text-green-500", bg: "bg-green-500/10" },
};

const statusConfig = {
  TODO: { label: "Todo", color: "text-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500" },
};

const Dashboard = () => {
  const { workspaceSlug } = useParams();

  const { data: workspace, isLoading: workspaceLoading } = useWorkspacesDetails(workspaceSlug || "");
  const { data: projects, isLoading: projectsLoading } = useProjects(workspaceSlug || "");
  const { data: members, isLoading: membersLoading } = useMembers(workspaceSlug || "");
  const { data: myIssues, isLoading: issuesLoading } = useUserIssues(workspaceSlug!);

  if (workspaceLoading || projectsLoading || membersLoading) {
    return <MainLoder></MainLoder>;
  }

  const totalProjects = projects?.length || 0;
  const totalMembers = members?.length || 0;

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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <div>
              <h2 className="font-semibold text-[15px]">Recent Projects</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Active projects in this workspace</p>
            </div>
            {totalProjects > 0 && (
              <Link
                to={`/${workspaceSlug}/projects`}
                className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {!projects?.length ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 mb-4">
                <FolderKanban size={24} className="text-muted-foreground/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[15px] mb-1">No projects yet</h3>
              <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-4">
                Create your first project to start organizing work.
              </p>
              <CreateProject />
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  to={`/${workspaceSlug}/projects/${project.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-accent/30 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/30 shrink-0 text-lg">
                      {project.emoji || <FolderKanban size={17} className="text-muted-foreground" strokeWidth={1.5} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium truncate">{project.name}</p>
                      <p className="text-[12px] text-muted-foreground truncate mt-0.5">{project.description || "No description"}</p>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all duration-150 shrink-0"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Your Issues */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <div>
              <h2 className="font-semibold text-[15px]">Your Issues</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Issues assigned to you</p>
            </div>
            {myIssues?.length ? (
              <span className="text-[12px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{myIssues.length} open</span>
            ) : null}
          </div>

          {issuesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            </div>
          ) : !myIssues?.length ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 mb-4">
                <CircleDot size={24} className="text-muted-foreground/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[15px] mb-1">No issues assigned</h3>
              <p className="text-[13px] text-muted-foreground text-center">You're all caught up! No open issues assigned to you.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {myIssues.map((issue) => {
                const priority = priorityConfig[issue.priority as keyof typeof priorityConfig];
                const status = statusConfig[issue.status as keyof typeof statusConfig];
                return (
                  <Link
                    key={issue.id}
                    to={`/${workspaceSlug}/projects/${issue.project.id}`}
                    className="flex items-start gap-3.5 px-6 py-4 hover:bg-accent/30 transition-all duration-150 group"
                  >
                    <AlertCircle size={15} className={`${priority.color} mt-0.5 shrink-0`} strokeWidth={1.5} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium truncate">{issue.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted-foreground">
                          {issue.project.emoji} {issue.project.name}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className={`text-[11px] ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${priority.bg} ${priority.color}`}>
                      {issue.priority}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity — placeholder for notifications */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <div>
              <h2 className="font-semibold text-[15px]">Recent Activity</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Latest updates in your workspace</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 mb-4">
              <Clock size={24} className="text-muted-foreground/70" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-[15px] mb-1">No activity yet</h3>
            <p className="text-[13px] text-muted-foreground text-center">Activity will appear here once notifications are set up.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
