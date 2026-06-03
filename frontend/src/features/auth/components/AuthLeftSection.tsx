import { cn } from "@/lib/utils";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";

const AuthLeftSection = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[hsl(240,10%,7%)] p-10 relative overflow-hidden select-none">
      {/* glow blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[hsl(228,75%,53%)] opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[hsl(210,80%,60%)] opacity-10 blur-3xl pointer-events-none" />

      {/* brand */}
      <div className="flex items-center gap-3 relative z-10">
        <FlowBoardLogo size={34} />
        <span className="font-syne text-white text-lg font-bold tracking-tight">FlowBoard</span>
      </div>

      {/* hero text */}
      <div className="relative z-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 font-dm font-medium tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(228,75%,65%)]" />
          Project Management
        </div>
        <h2 className="font-syne text-white text-3xl font-bold leading-tight tracking-tight">
          Track issues.
          <br />
          <span className="text-[hsl(228,75%,72%)]">Ship with flow.</span>
        </h2>
        <p className="text-white/40 font-dm text-sm leading-relaxed max-w-xs">
          A Jira-like workspace built for focused teams — priorities, boards, and members, all in one place.
        </p>
      </div>

      {/* feature chips */}
      <div className="relative z-10 flex flex-col gap-2.5">
        {[
          { dot: "bg-[hsl(228,75%,65%)]", text: "Multi-workspace support" },
          { dot: "bg-amber-400", text: "Priority-based issue tracking" },
          { dot: "bg-emerald-400", text: "Role-based access control" },
        ].map(({ dot, text }) => (
          <div key={text} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/[0.07]">
            <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />
            <span className="text-xs text-white/50 font-dm">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthLeftSection;
