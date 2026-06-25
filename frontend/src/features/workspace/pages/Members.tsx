import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMembers } from "../hooks/useMembers";
import InviteMember from "../components/InviteMember";
import MemberCard from "../components/MembersCard";
import MembersShimmer from "../shimmer/MembersShimmer";

const Members = () => {
  const { workspaceSlug } = useParams();
  const { data: members, isLoading } = useMembers(workspaceSlug!);
  const totalMembers = members?.length || 0;

  if (isLoading) return <MembersShimmer />;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-300 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold font-heading tracking-tight">Members</h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            {totalMembers > 0
              ? `${totalMembers} ${totalMembers === 1 ? "member" : "members"} in this workspace`
              : "Manage workspace members and their roles"}
          </p>
        </div>

        <InviteMember />
      </div>

      <Separator className="bg-border/40 mb-6" />

      {/* Empty State */}
      {!members?.length ? (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
              <Users size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <h2 className="text-[17px] font-semibold font-heading mb-1.5">No members yet</h2>
            <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-4">Invite team members to start collaborating.</p>
            <InviteMember />
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
