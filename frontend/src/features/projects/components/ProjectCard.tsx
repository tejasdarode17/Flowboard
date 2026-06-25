import { Link } from "react-router-dom";
import { useIssues } from "../hooks/useIssues";
import { ArrowUpRight, CircleDot, Hash } from "lucide-react";
import type { Project } from "../types/project.types";

const ProjectCard = ({ project, workspaceSlug }: { project: Project; workspaceSlug: string }) => {
  const { data: issues } = useIssues(workspaceSlug, project.id);
  const totalIssues = issues?.length || 0;
  const openIssues = issues?.filter((i) => i.status === "TODO" || i.status === "IN_PROGRESS").length || 0;
  const completedIssues = issues?.filter((i) => i.status === "DONE").length || 0;

  return (
    <Link
      to={`/${workspaceSlug}/projects/${project.id}`}
      className="group relative flex flex-col rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 hover:shadow-md hover:border-border/60 transition-all duration-200"
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex flex-col h-full">
        {/* Top section */}
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-muted/60 border border-border/30 text-lg shrink-0">
            {project.emoji || <Hash size={18} className="text-muted-foreground" strokeWidth={1.5} />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-semibold truncate leading-tight">{project.name}</h3>
            {project.description && (
              <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">{project.description}</p>
            )}
          </div>
          <ArrowUpRight
            size={15}
            className="text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-all duration-200 shrink-0 mt-0.5"
          />
        </div>

        {/* Bottom section */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          {totalIssues > 0 ? (
            <div className="flex items-center gap-3">
              {openIssues > 0 && (
                <div className="flex items-center gap-1.5">
                  <CircleDot size={11} className="text-amber-500" strokeWidth={1.5} />
                  <span className="text-[11px] text-muted-foreground font-medium">{openIssues} open</span>
                </div>
              )}
              {completedIssues > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                  <span className="text-[11px] text-muted-foreground">{completedIssues} done</span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/50">No issues</span>
          )}

          {/* GitHub indicator */}
          {project.projectGithub && (
            <div className="flex items-center gap-1">
              <svg height="10" width="10" viewBox="0 0 16 16" fill="currentColor" className="text-muted-foreground/40">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
