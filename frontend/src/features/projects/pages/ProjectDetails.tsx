import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProjectDetails } from "../hooks/useProjectDetails";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import KanbanColumn from "@/features/projects/components/KanbanColumn";
import IssueCard from "../components/IssueCard";
import { useIssues } from "../hooks/useIssues";
import CreateIssue from "../components/CreateIssue";
import { useIssuesStatusUpdate } from "../hooks/useIssueStatusUpdate";
import LinkRepository from "../components/LinkRepositores";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"] as const;
type Status = (typeof COLUMNS)[number];

const COLUMN_CONFIG = {
  TODO: { label: "Todo", color: "bg-muted" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-500/10" },
  DONE: { label: "Done", color: "bg-emerald-500/10" },
};

const ProjectDetails = () => {
  const { workspaceSlug, projectId } = useParams();
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  const { data: project, isLoading: isProjectLoading, error: projectError } = useProjectDetails(workspaceSlug!, projectId!);
  const { data: issues, isLoading: isIssuesLoading } = useIssues(workspaceSlug!, projectId!);

  const { mutate: updateIssue } = useIssuesStatusUpdate(workspaceSlug!, projectId!);

  const groupedIssues = useMemo(() => {
    if (!issues) return { TODO: [], IN_PROGRESS: [], DONE: [] };
    return {
      TODO: issues.filter((i) => i.status === "TODO"),
      IN_PROGRESS: issues.filter((i) => i.status === "IN_PROGRESS"),
      DONE: issues.filter((i) => i.status === "DONE"),
    };
  }, [issues]);

  const activeIssue = issues?.find((i) => i.id === activeIssueId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveIssueId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssueId(null);

    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as Status;

    const issue = issues?.find((i) => i.id === issueId);
    if (!issue || issue.status === newStatus) return;

    updateIssue({
      workspaceSlug: workspaceSlug!,
      projectId: projectId!,
      issueId,
      status: newStatus,
    });
  };

  if (projectError) return <div className="p-6 text-destructive">Failed to load project</div>;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 border-b pb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl">
            {isProjectLoading ? "..." : project?.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{isProjectLoading ? "Loading..." : project?.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project?.description || "No description provided"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {project?.projectGitHub ? (
            <div className="rounded-lg border px-3 py-2">
              <p className="text-sm text-muted-foreground">Linked Repository</p>

              <p className="font-medium">{project.projectGitHub.repoFullName}</p>
            </div>
          ) : (
            <LinkRepository projectId={projectId!} />
          )}

          <CreateIssue />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col} className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">{COLUMN_CONFIG[col].label}</p>
            <h2 className="mt-2 text-2xl font-bold">{groupedIssues[col].length}</h2>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      {isIssuesLoading ? (
        <div className="text-sm text-muted-foreground">Loading issues...</div>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid gap-6 lg:grid-cols-3">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col}
                id={col}
                label={COLUMN_CONFIG[col].label}
                color={COLUMN_CONFIG[col].color}
                issues={groupedIssues[col]}
              />
            ))}
          </div>

          {/* Drag overlay — drag karte waqt floating card */}
          <DragOverlay>{activeIssue ? <IssueCard issue={activeIssue} isDragging /> : null}</DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default ProjectDetails;
