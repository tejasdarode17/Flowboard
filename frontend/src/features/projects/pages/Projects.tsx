import { useParams, Link } from "react-router-dom";
import { ArrowUpRight, Layers, Hash } from "lucide-react";
import { useProjects } from "../../projects/hooks/useProjects";
import CreateProject from "../components/CreateProject";
import type { Project } from "../types/project.types";
import { useIssues } from "../hooks/useIssues";
import { useCurrentWorkspace } from "@/features/workspace/hooks/useCurrentWorkspace";

const Projects = () => {
  const { workspaceSlug } = useParams();
  const { data: projects, isLoading } = useProjects(workspaceSlug || "");

  const { currentWorkspace } = useCurrentWorkspace();
  const isOwnerOrAdmin = currentWorkspace?.role == "ADMIN" || currentWorkspace?.role == "OWNER";

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            {projects?.length
              ? `${projects.length} ${projects.length === 1 ? "project" : "projects"} in this workspace`
              : "Manage and organize your projects"}
          </p>
        </div>
        {isOwnerOrAdmin && <CreateProject />}
      </div>

      {/* Empty state */}
      {!projects?.length ? (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
              <Layers size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <h2 className="text-[17px] font-semibold mb-1.5">No projects yet</h2>
            {isOwnerOrAdmin && (
              <>
                <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-4">
                  Create your first project to start organizing work and collaborating with your team.
                </p>
                <CreateProject />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} workspaceSlug={workspaceSlug!} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, workspaceSlug }: { project: Project; workspaceSlug: string }) => {
  const { data: issues } = useIssues(workspaceSlug, project.id);
  const totalIssues = issues?.length || 0;

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
          <div className="flex items-center gap-3">
            {totalIssues > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                <span className="text-[11px] text-muted-foreground/60">Issues {totalIssues}</span>
              </div>
            )}
          </div>

          {totalIssues === 0 && <span className="text-[11px] text-muted-foreground/50">No issues</span>}
        </div>
      </div>
    </Link>
  );
};

export default Projects;
