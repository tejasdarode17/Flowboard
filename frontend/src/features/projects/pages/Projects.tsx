import { useParams } from "react-router-dom";
import { Layers } from "lucide-react";
import { useProjects } from "../../projects/hooks/useProjects";
import CreateProject from "../components/CreateProject";
import { useCurrentWorkspace } from "@/features/workspace/hooks/useCurrentWorkspace";
import ProjectsShimmer from "../shimmers/ProjectShimmer";
import { Separator } from "@/components/ui/separator";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const { workspaceSlug } = useParams();
  const { data: projects, isLoading } = useProjects(workspaceSlug || "");
  const { currentWorkspace } = useCurrentWorkspace();
  const isOwnerOrAdmin = currentWorkspace?.role === "ADMIN" || currentWorkspace?.role === "OWNER";

  if (isLoading) return <ProjectsShimmer />;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold font-heading tracking-tight">Projects</h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            {projects?.length
              ? `${projects.length} ${projects.length === 1 ? "project" : "projects"} in this workspace`
              : "Manage and organize your projects"}
          </p>
        </div>
        {isOwnerOrAdmin && <CreateProject />}
      </div>

      <Separator className="bg-border/40 mb-6" />

      {/* Empty state */}
      {!projects?.length ? (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
              <Layers size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <h2 className="text-[17px] font-semibold font-heading mb-1.5">No projects yet</h2>
            <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-4">
              {isOwnerOrAdmin
                ? "Create your first project to start organizing work, tracking issues, and collaborating with your team."
                : "No projects have been created in this workspace yet."}
            </p>
            {isOwnerOrAdmin && <CreateProject />}
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

export default Projects;
