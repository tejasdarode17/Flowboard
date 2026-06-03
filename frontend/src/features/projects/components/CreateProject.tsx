import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProjectForm from "../../projects/components/ProjectForm";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useCreateProject } from "../hooks/useProjectCreate";
import type { CreateProjectInput } from "../validations/project.validations";

const CreateProject = () => {
  const [open, setOpen] = useState(false);
  const { workspaceSlug } = useParams();

  const { mutateAsync, isPending } = useCreateProject(workspaceSlug!, () => setOpen(false));

  function handleSubmit(data: CreateProjectInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, data });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={15} />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
              <Building2 size={16} className="text-background" />
            </div>
            <div>
              <DialogTitle className="font-syne text-lg tracking-tight">Create Project</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">Organize your work into projects.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ProjectForm onSubmit={handleSubmit} loading={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
