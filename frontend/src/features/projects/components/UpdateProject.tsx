import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProjectForm from "../../projects/components/ProjectForm";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import type { CreateProjectInput } from "../validations/project.validations";
import { useUpdateProject } from "../hooks/useUpdateProject";
import type { Project } from "../types/project.types";

type UpdateProjectProps = {
  project: Project;
};

const UpdateProject = ({ project }: UpdateProjectProps) => {
  const [open, setOpen] = useState(false);
  const { workspaceSlug } = useParams();
  const { mutateAsync, isPending } = useUpdateProject(workspaceSlug!, () => setOpen(false));

  function handleSubmit(data: CreateProjectInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, data, projectId: project.id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[13px]">
          <Settings size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/40 shrink-0 text-lg">
              {project?.emoji}
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading">Project Settings</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">Update {project?.name}'s details.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6">
          <ProjectForm onSubmit={handleSubmit} onClose={() => setOpen(false)} loading={isPending} project={project} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProject;
