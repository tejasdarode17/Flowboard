import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ChangeRole from "./ChangeRole";
import RemoveMember from "./RemoveMember";
import type { WorkspaceMember } from "../types/workspaces.types";
import { useNavigate, useParams } from "react-router-dom";

interface MemberActionMenuProps {
  member: WorkspaceMember;
}

const MemberActionMenu = ({ member }: MemberActionMenuProps) => {
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(event) => event.stopPropagation()}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent/50 transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0"
          >
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl" onClick={(event) => event.stopPropagation()}>
          <ChangeRole member={member} workspaceSlug={workspaceSlug!}>
            <DropdownMenuItem className="text-[13px] rounded-lg cursor-pointer" onSelect={(event) => event.preventDefault()}>
              Change role
            </DropdownMenuItem>
          </ChangeRole>

          <DropdownMenuItem
            className="text-[13px] rounded-lg cursor-pointer"
            onSelect={(event) => event.preventDefault()}
            onClick={() => navigate(`/profile/${member.user.username}`)}
          >
            View profile
          </DropdownMenuItem>

          <Separator className="my-1 bg-border/40" />

          <RemoveMember member={member} workspaceSlug={workspaceSlug!}>
            <DropdownMenuItem
              className="text-[13px] text-red-500 rounded-lg cursor-pointer hover:text-red-500"
              onSelect={(event) => event.preventDefault()}
            >
              Remove member
            </DropdownMenuItem>
          </RemoveMember>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MemberActionMenu;
