import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CircleDot, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { useIssues } from "../hooks/useIssues";
import CreateIssue from "../components/CreateIssue";
import LinkRepository from "../components/LinkRepositores";
import { useCurrentWorkspace } from "@/features/workspace/hooks/useCurrentWorkspace";
import UpdateProject from "../components/UpdateProject";
import DeleteProject from "../components/DeleteProject";
import UnlinkRepository from "../components/UnlinkRepositories";
import IssueTableView from "../components/IssueTable";
import { Skeleton } from "@/components/ui/skeleton";
import GithubLogo from "@/shared/icons/GithubLogo";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"] as const;

const STATUS_CONFIG = {
  TODO: {
    label: "Todo",
    icon: CircleDot,
    color: "text-slate-500",
    bg: "bg-slate-500/5",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  DONE: {
    label: "Done",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

const ProjectDetails = () => {
  const { workspaceSlug, projectId } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);

  const { data: project, isLoading: isProjectLoading, error: projectError } = useProjectDetails(workspaceSlug!, projectId!);
  const { data: issues, isLoading: isIssuesLoading } = useIssues(workspaceSlug!, projectId!);
  const { currentWorkspace } = useCurrentWorkspace();

  const isOwner = currentWorkspace?.role === "OWNER";
  const isAdmin = currentWorkspace?.role === "ADMIN";
  const canManageProject = isOwner || isAdmin;
  const isLinked = !!project?.projectGithub;

  const groupedIssues = useMemo(() => {
    if (!issues) return { TODO: [], IN_PROGRESS: [], DONE: [] };
    return {
      TODO: issues.filter((i) => i.status === "TODO"),
      IN_PROGRESS: issues.filter((i) => i.status === "IN_PROGRESS"),
      DONE: issues.filter((i) => i.status === "DONE"),
    };
  }, [issues]);

  const totalIssues = issues?.length || 0;
  const completedIssues = groupedIssues.DONE.length;
  const progressPercentage = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  if (projectError) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-350 mx-auto">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold font-heading mb-1">Failed to load project</h2>
            <p className="text-[13px] text-muted-foreground">Please try again or contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-350 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            {isProjectLoading ? (
              <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/40 bg-muted/50 text-3xl shadow-sm shrink-0">
                {project?.emoji}
              </div>
            )}

            <div className="min-w-0">
              {isProjectLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-96" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold font-heading tracking-tight truncate">{project?.name}</h1>
                  <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2 max-w-2xl">
                    {project?.description || "No description provided"}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CreateIssue open={createIssueOpen} setOpen={setCreateIssueOpen} />

            {/* Only OWNER can manage GitHub */}
            {isOwner &&
              (isLinked ? (
                <UnlinkRepository projectId={projectId!} workspaceSlug={workspaceSlug!} />
              ) : (
                <LinkRepository projectId={projectId!} />
              ))}

            {/* OWNER + ADMIN */}
            {canManageProject && (
              <>
                <UpdateProject project={project!} />

                <DeleteProject
                  projectName={project?.name || ""}
                  projectId={projectId!}
                  workspaceSlug={workspaceSlug!}
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                />
              </>
            )}
          </div>
        </div>

        {/* GitHub Link + Progress */}
        {!isProjectLoading && (
          <div className="mt-6 flex items-center gap-4">
            {isLinked && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#24292e]/5 border border-[#24292e]/10">
                <GithubLogo size={13} />
                <a
                  href={`https://github.com/${project?.projectGithub?.repoFullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-medium hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {project?.projectGithub?.repoFullName}
                  <ExternalLink size={11} className="text-muted-foreground" />
                </a>
              </div>
            )}
            {totalIssues > 0 && (
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-50">
                  <div
                    className="h-full bg-linear-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-[12px] text-muted-foreground font-medium tabular-nums">
                  {completedIssues}/{totalIssues} done
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {COLUMNS.map((col) => {
          const config = STATUS_CONFIG[col];
          const Icon = config.icon;
          const count = groupedIssues[col].length;
          return (
            <div
              key={col}
              className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-all duration-200"
            >
              <div className={`absolute inset-0 ${config.bg} opacity-50`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-muted-foreground">{config.label}</p>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm border ${config.border}`}
                  >
                    <Icon size={17} className={config.color} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-bold font-heading tabular-nums">{count}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Issues Table */}
      {isIssuesLoading ? (
        <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/30 bg-muted/30">
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border/20">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <IssueTableView issues={issues ?? []} workspaceSlug={workspaceSlug!} projectId={projectId!} />
      )}
    </div>
  );
};

export default ProjectDetails;
