import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspacesDetails } from "../hooks/useWorkspaceDetails";
import UpdateWorkspace from "../components/UpdateWorksapce";
import DeleteWorkspace from "../components/DeleteWorksapce";
import MainLoder from "@/shared/components/MainLoder";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

const WorkspaceSettings = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: workspace, isLoading } = useWorkspacesDetails(workspaceSlug!);
  const { currentWorkspace } = useCurrentWorkspace();
  const isOwner = currentWorkspace?.role == "OWNER";

  if (isLoading) return <MainLoder></MainLoder>;
  if (!workspace) return <h1>NO Workspace</h1>;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Workspace Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">Manage your workspace settings and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[15px]">General</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Basic workspace information</p>
            </div>
            {isOwner && (
              <Button variant="outline" size="sm" onClick={() => setUpdateOpen(true)} className="gap-2">
                <Pencil size={13} />
                Edit
              </Button>
            )}
          </div>

          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-4">
              {workspace.logo ? (
                <img src={workspace.logo} className="h-14 w-14 rounded-xl object-cover border border-border/40" />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center border border-border/40">
                  <span className="text-xl font-semibold">{workspace.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{workspace.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{workspace.slug}</p>
              </div>
            </div>

            {workspace.description && <p className="text-[13px] text-muted-foreground">{workspace.description}</p>}
          </div>
        </div>

        {/* Danger Zone — OWNER only */}
        {isOwner && (
          <div className="rounded-2xl border border-red-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-500/20">
              <h2 className="font-semibold text-[15px] text-red-500">Danger Zone</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Irreversible actions for this workspace</p>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-red-500">Delete workspace</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Permanently delete this workspace and all its data</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  className="gap-2 shrink-0 bg-red-700 hover:bg-red-800"
                >
                  <Trash2 size={13} />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpdateWorkspace
        open={updateOpen}
        setOpen={setUpdateOpen}
        workspaceSlug={workspaceSlug!}
        defaultValues={{
          name: workspace.name,
          description: workspace.description ?? "",
          logo: workspace.logo,
        }}
      />

      <DeleteWorkspace open={deleteOpen} setOpen={setDeleteOpen} workspaceSlug={workspaceSlug!} workspaceName={workspace.name} />
    </div>
  );
};

export default WorkspaceSettings;
