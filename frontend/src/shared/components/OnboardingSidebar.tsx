import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "../hooks/useAppSelector";
import { useState } from "react";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";

const OnboardingSidebar = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector((store) => store?.auth);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <aside className="hidden lg:flex h-screen w-70 flex-col border-r border-border/40 bg-sidebar/50 backdrop-blur-sm px-3 py-4">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-foreground/5">
          <FlowBoardLogo size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">FlowBoard</p>
          <p className="text-[10px] text-muted-foreground/50 leading-tight">Project Management</p>
        </div>
      </div>

      {/* Onboarding card - enhanced design */}
      <div className="mt-8 mx-1">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-linear-to-br from-accent/30 to-accent/5 p-6">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/10 to-transparent rounded-bl-3xl" />

          <div className="relative">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-background/80 backdrop-blur-sm shadow-sm border border-border/30">
              <Sparkles size={22} className="text-primary" strokeWidth={1.5} />
            </div>

            <div className="mt-5">
              <h2 className="text-[15px] font-semibold tracking-tight">Get started</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Create a workspace to organize projects, collaborate with your team, and track progress.
              </p>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="mt-6 w-full rounded-xl h-10 gap-2  transition-all duration-200"
            >
              Create Workspace
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <CreateWorkspace open={open} setOpen={setOpen} />

      {/* Features list */}
      <div className="mt-6 px-3 space-y-3">
        <p className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">What you can do</p>
        <div className="space-y-2">
          {["Manage projects and tasks", "Invite team members", "Track issues and progress", "Customize workflows"].map((feature) => (
            <div key={feature} className="flex items-start gap-2.5">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
              <p className="text-[12px] text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User section */}
      <div className="mt-auto pt-4">
        <Separator className="bg-border/40 mb-4" />

        <div className="px-2">
          <button
            onClick={() => userData?.id && navigate(`/profile/${userData.username}`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-all duration-150 group"
          >
            <Avatar className="h-7 w-7 rounded-lg border border-border/50">
              <AvatarImage src={userData?.avatar ?? ""} />
              <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-lg">
                {userData?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium truncate">{userData?.name}</p>
              <p className="text-[11px] text-muted-foreground/60">Welcome aboard</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;
