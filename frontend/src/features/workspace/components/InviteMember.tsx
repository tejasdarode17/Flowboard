import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { inviteMemberToWorkspace } from "../services/workspace.services";
import { useParams } from "react-router-dom";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { inviteMemberSchema, type InviteWorksapceInput } from "../validations/workspace.validations";

const InviteMember = () => {
  const { workspaceSlug } = useParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: InviteWorksapceInput) => inviteMemberToWorkspace(workspaceSlug!, data),
    onSuccess: () => {
      setEmail("");
      setOpen(false);
    },
  });

  async function handleInvite() {
    try {
      setErrors({});
      const result = inviteMemberSchema.safeParse({ email, role });
      if (!result.success) {
        setErrors(zodErrors(result));
        return;
      }
      await mutateAsync(result.data);
    } catch (err: unknown) {
      const parsed = apiErrors(err);
      setErrors(parsed);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl h-10 gap-2">
          <UserPlus size={16} />
          <span>Invite Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Invite team member</DialogTitle>
          <DialogDescription className="text-[13px]">
            Invite someone to collaborate in this workspace. They'll receive an email invitation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium">Email address</label>
            <Input
              placeholder="colleague@company.com"
              className="rounded-xl h-10 bg-muted/50 border-border/40"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium">Role</label>
            <Select value={role} onValueChange={(val) => setRole(val as "ADMIN" | "MEMBER")}>
              <SelectTrigger className="rounded-xl h-10 bg-muted/50 border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {errors && <p className="text-xs text-destructive">{errors.error}</p>}

          <Button variant="outline" disabled={isPending || !email} onClick={handleInvite} className="w-full rounded-xl h-10">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "Send invitation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMember;
