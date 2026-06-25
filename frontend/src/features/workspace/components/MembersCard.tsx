import { useNavigate } from "react-router-dom";
import { Mail, AtSign, Clock, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import MemberBadge from "./MemberBadge";
import RemoveMember from "./RemoveMember";
import type { WorkspaceMember } from "../types/workspaces.types";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useParams } from "react-router-dom";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import ChangeRole from "@/features/workspace/components/ChangeRole";

interface MemberCardProps {
  member: WorkspaceMember;
}

const MemberCard = ({ member }: MemberCardProps) => {
  const navigate = useNavigate();
  const { workspaceSlug } = useParams();
  const { userData } = useAppSelector((store) => store.auth);
  const isCurrentUser = member.user.id === userData?.id;

  const { currentWorkspace } = useCurrentWorkspace();
  const isOwner = currentWorkspace?.role === "OWNER";

  return (
    <div className="group relative flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4 hover:shadow-sm hover:border-border/60 transition-all duration-200">
      {/* Clickable area for profile */}
      <button onClick={() => navigate(`/profile/${member.user.username}`)} className="absolute inset-0 z-0 rounded-2xl">
        <span className="sr-only">View profile</span>
      </button>

      {/* Avatar */}
      <Avatar className="h-11 w-11 rounded-xl border border-border/40 shrink-0 relative z-10">
        <AvatarImage src={member.user.avatar ?? ""} className="rounded-xl" />
        <AvatarFallback className="bg-accent text-[13px] font-semibold rounded-xl">
          {member.user.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="min-w-0 flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[14px] font-medium truncate">{member.user.name}</p>
          <MemberBadge role={member.role} />
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <AtSign size={11} strokeWidth={1.5} />
          <span className="truncate">{member.user.username}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground/70 mt-0.5">
          <Mail size={11} strokeWidth={1.5} />
          <span className="truncate">{member.user.email}</span>
        </div>

        {member.createdAt && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 mt-1">
            <Clock size={10} strokeWidth={1.5} />
            <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action Menu - Only show for other members if Owner */}
      {!isCurrentUser && isOwner && (
        <div className="relative z-20 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent/50 transition-all duration-150 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-44 rounded-xl p-1" onClick={(e) => e.stopPropagation()}>
              <ChangeRole member={member} workspaceSlug={workspaceSlug!}>
                <DropdownMenuItem className="text-[13px] rounded-lg cursor-pointer py-2 px-3" onSelect={(e) => e.preventDefault()}>
                  Change role
                </DropdownMenuItem>
              </ChangeRole>

              <Separator className="my-1 bg-border/40" />

              <RemoveMember member={member} workspaceSlug={workspaceSlug!}>
                <DropdownMenuItem
                  className="text-[13px] text-red-500 rounded-lg cursor-pointer hover:text-red-500! py-2 px-3"
                  onSelect={(e) => e.preventDefault()}
                >
                  Remove member
                </DropdownMenuItem>
              </RemoveMember>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Current user indicator */}
      {isCurrentUser && (
        <div className="relative z-10 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150">
          <span className="text-[11px] text-muted-foreground/50 font-medium px-2 py-1 rounded-md bg-muted/30">You</span>
        </div>
      )}
    </div>
  );
};

export default MemberCard;
