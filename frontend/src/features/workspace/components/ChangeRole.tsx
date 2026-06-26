import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, User, Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateMemberRole } from "../hooks/useUpdateMemberRole";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceMember } from "../types/workspaces.types";
import { apiErrors } from "@/shared/utils/errorHandler";

type MemberRole = "ADMIN" | "MEMBER";

interface RoleConfig {
  value: MemberRole;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

interface ChangeRoleDialogProps {
  member: WorkspaceMember;
  workspaceSlug: string;
  children: React.ReactNode;
  onClose: () => void;
}

const roles: RoleConfig[] = [
  {
    value: "ADMIN",
    label: "Admin",
    description: "Manage members and settings",
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    value: "MEMBER",
    label: "Member",
    description: "Access projects and issues",
    icon: User,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
];

const ChangeRole = ({ member, workspaceSlug, children, onClose }: ChangeRoleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<MemberRole>(member.role === "OWNER" ? "ADMIN" : member.role);
  const { mutate: updateRole, isPending } = useUpdateMemberRole();

  const handleChangeRole = () => {
    updateRole(
      { workspaceSlug, memberId: member.id, role: selectedRole },
      {
        onSuccess: () => {
          toast.success(`${member.user.name}'s role changed to ${selectedRole}`);
          setOpen(false);
          onClose();
        },
        onError: (error) => {
          const err = apiErrors(error);
          toast.error(err.error || "Failed to change role");
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSelectedRole(member.role === "OWNER" ? "ADMIN" : member.role);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Change Role</DialogTitle>
          <DialogDescription className="text-[13px]">
            Update role for <span className="font-medium text-foreground">{member.user.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-1">
          {/* Member Info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 mb-4">
            <Avatar className="h-9 w-9 rounded-lg border border-border/40 shrink-0">
              <AvatarImage src={member.user.avatar ?? ""} className="rounded-lg" />
              <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-lg">
                {member.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[13px] font-medium truncate">{member.user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">@{member.user.username}</p>
            </div>
          </div>

          {/* Role Options */}
          <div className="space-y-1">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;

              return (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 ${
                    isSelected ? "bg-accent border border-border/60" : "hover:bg-accent/30 border border-transparent"
                  }`}
                >
                  <div className={`flex items-center justify-center h-9 w-9 rounded-lg border shrink-0 ${role.bg} ${role.border}`}>
                    <Icon size={15} className={role.color} strokeWidth={1.5} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[14px] font-medium">{role.label}</p>
                    <p className="text-[12px] text-muted-foreground">{role.description}</p>
                  </div>
                  {isSelected && <Check size={16} className="text-primary shrink-0" strokeWidth={2} />}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            className="w-full rounded-xl h-10 mt-4"
            disabled={isPending || selectedRole === member.role}
            onClick={handleChangeRole}
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRole;
