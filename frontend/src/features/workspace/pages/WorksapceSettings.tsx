import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspacesDetails } from "../hooks/useWorkspaceDetails";
import UpdateWorkspace from "../components/UpdateWorksapce";
import DeleteWorkspace from "../components/DeleteWorksapce";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import WorkspaceSettingsShimmer from "../shimmer/WorksapceSettingShimmer";

const WorkspaceSettings = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: workspace, isLoading } = useWorkspacesDetails(workspaceSlug!);
  const { currentWorkspace } = useCurrentWorkspace();
  const isOwner = currentWorkspace?.role === "OWNER";

  if (isLoading) return <WorkspaceSettingsShimmer />;
  if (!workspace) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <Building2 size={28} className="text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold font-heading mb-1">Workspace not found</h2>
            <p className="text-[13px] text-muted-foreground">The workspace you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold font-heading tracking-tight">Workspace Settings</h1>
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
              <Button variant="outline" size="sm" onClick={() => setUpdateOpen(true)} className="rounded-xl h-9 gap-2 text-[13px]">
                <Pencil size={14} strokeWidth={1.5} />
                <span>Edit</span>
              </Button>
            )}
          </div>

          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              {workspace.logo ? (
                <img
                  src={workspace.logo}
                  alt={workspace.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-border/40 shadow-sm shrink-0"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-lg font-semibold font-heading text-muted-foreground">{workspace.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[15px] font-semibold">{workspace.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Workspace URL: <span className="font-medium text-foreground/70">{workspace.slug}</span>
                </p>
                {workspace.description && <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">{workspace.description}</p>}
              </div>
            </div>
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
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-red-500">Delete workspace</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Permanently delete this workspace and all its data</p>
                </div>
                <DeleteWorkspace open={deleteOpen} setOpen={setDeleteOpen} workspaceSlug={workspaceSlug!} workspaceName={workspace.name} />
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
    </div>
  );
};

export default WorkspaceSettings;
