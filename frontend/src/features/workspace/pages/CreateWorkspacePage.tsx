import { useState } from "react";
import { Building2, GitBranch, LayoutGrid, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

const features = [
  {
    icon: LayoutGrid,
    title: "Projects & Issues",
    description: "Organize work into projects, track issues with priority and status.",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description: "Invite members, assign roles, and work together seamlessly.",
  },
  {
    icon: GitBranch,
    title: "Workflow Management",
    description: "Move issues across stages — Todo, In Progress, Done.",
  },
];

const CreateWorkspacePage = () => {
  const [open, setOpen] = useState(false);
  const { userData } = useAppSelector((store) => store?.auth);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      {/* logo */}
      <div className="lg:hidden flex items-center gap-2.5 mb-12">
        <FlowBoardLogo size={32} />
        <span className="font-syne text-xl font-bold tracking-tight text-foreground">FlowBoard</span>
      </div>

      {/* welcome */}
      <div className="text-center max-w-lg mb-12">
        <h1 className="font-syne text-3xl font-bold tracking-tight text-foreground">Welcome, {userData?.name?.split(" ")[0]} 👋</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          FlowBoard helps your team manage projects, track issues, and ship faster. Start by creating your first workspace.
        </p>
      </div>

      {/* features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-12">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <Icon size={16} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* cta */}
      <Button variant="outline" onClick={() => setOpen(true)} className="h-11 px-8 text-sm gap-2">
        <Building2 size={16} />
        Create your first workspace
      </Button>

      <p className="mt-4 text-xs text-muted-foreground">Takes less than a minute to set up</p>

      <CreateWorkspace open={open} setOpen={setOpen} />
    </div>
  );
};

export default CreateWorkspacePage;
