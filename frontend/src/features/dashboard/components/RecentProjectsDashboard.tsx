import { Link } from "react-router-dom";
import { FolderKanban, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/useProjects";
import CreateProject from "@/features/projects/components/CreateProject";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentWorkspace } from "@/features/workspace/hooks/useCurrentWorkspace";

const RecentProjectsDashboard = ({ workspaceSlug }: { workspaceSlug: string }) => {
  const { data: projects, isLoading } = useProjects(workspaceSlug);

  const { currentWorkspace } = useCurrentWorkspace();
  const isOwnerOrAdmin = currentWorkspace?.role == "ADMIN" || currentWorkspace?.role == "OWNER";

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
        <div className="divide-y divide-border/20">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div>
          <h2 className="font-semibold text-[15px]">Recent Projects</h2>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {projects?.length
              ? `${projects.length} active ${projects.length === 1 ? "project" : "projects"}`
              : "Active projects in this workspace"}
          </p>
        </div>
        {projects && projects.length > 0 && (
          <Link
            to={`/${workspaceSlug}/projects`}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>

      {/* Content */}
      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 border border-border/30 mb-4">
            <FolderKanban size={24} className="text-muted-foreground/60" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-[15px] mb-1">No projects yet</h3>
          {isOwnerOrAdmin && (
            <>
              <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-4">
                Create your first project to start organizing work and collaborating with your team.
              </p>
              <CreateProject />
            </>
          )}
        </div>
      ) : (
        <div className="divide-y divide-border/20">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              to={`/${workspaceSlug}/projects/${project.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-accent/30 transition-all duration-150 group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/30 shrink-0 text-lg">
                  {project.emoji || <FolderKanban size={17} className="text-muted-foreground" strokeWidth={1.5} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium truncate">{project.name}</p>
                    {/* {project._count?.issues > 0 && (
                      <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full shrink-0">
                        {project._count.issues}
                      </span>
                    )} */}
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">{project.description || "No description"}</p>
                </div>
              </div>
              <ArrowUpRight
                size={15}
                className="text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-200 shrink-0 ml-3"
              />
            </Link>
          ))}

          {projects.length > 6 && (
            <Link
              to={`/${workspaceSlug}/projects`}
              className="flex items-center justify-center px-6 py-3 text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all duration-150"
            >
              View all {projects.length} projects
              <ArrowUpRight size={13} className="ml-1.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProjectsDashboard;
