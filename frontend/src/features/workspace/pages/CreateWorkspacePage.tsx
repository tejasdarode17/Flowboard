import { useState } from "react";
import { Building2, GitBranch, LayoutGrid, Users2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

const features = [
  {
    icon: LayoutGrid,
    title: "Projects & Issues",
    description: "Organize work into projects, track issues with priority and status.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description: "Invite members, assign roles, and work together seamlessly.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: GitBranch,
    title: "Workflow Management",
    description: "Move issues across stages — Todo, In Progress, Done.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const CreateWorkspacePage = () => {
  const [open, setOpen] = useState(false);
  const { userData } = useAppSelector((store) => store?.auth);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      {/* Logo - Mobile only */}
      <div className="lg:hidden flex items-center gap-3 mb-12">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-foreground/5 border border-border/30">
          <FlowBoardLogo size={24} />
        </div>
        <span className="font-heading text-xl font-bold tracking-tight text-foreground">FlowBoard</span>
      </div>

      {/* Welcome */}
      <div className="text-center max-w-lg mb-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Welcome, {userData?.name?.split(" ")[0]} 👋</h1>
        <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed max-w-md mx-auto">
          FlowBoard helps your team manage projects, track issues, and ship faster. Start by creating your first workspace.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-12">
        {features.map(({ icon: Icon, title, description, color, bg, border }) => (
          <div
            key={title}
            className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 flex flex-col gap-3.5 hover:shadow-sm hover:border-border/60 transition-all duration-200"
          >
            <div className={`flex items-center justify-center h-10 w-10 rounded-xl border ${bg} ${border}`}>
              <Icon size={17} className={color} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{title}</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
        
      {/* CTA */}
      <Button onClick={() => setOpen(true)} size="lg" variant="outline" className="rounded-xl h-12 px-8 text-[14px] gap-2.5 shadow-sm">
        <Building2 size={17} strokeWidth={1.5} />
        Create your first workspace
        <ArrowRight size={16} className="ml-1" />
      </Button>

      <p className="mt-4 text-[12px] text-muted-foreground/60 flex items-center gap-1.5">
        <CheckCircle2 size={12} className="text-emerald-500" />
        Takes less than a minute to set up
      </p>

      <CreateWorkspace open={open} setOpen={setOpen} />
    </div>
  );
};

export default CreateWorkspacePage;
