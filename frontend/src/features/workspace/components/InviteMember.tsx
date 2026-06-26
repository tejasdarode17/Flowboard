import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Mail, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { inviteMemberToWorkspace } from "../services/workspace.services";
import { useParams } from "react-router-dom";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { inviteMemberSchema, type InviteWorksapceInput } from "../validations/workspace.validations";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { toast } from "sonner";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

const InviteMember = () => {
  const { workspaceSlug } = useParams();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const { currentWorkspace } = useCurrentWorkspace();
  const isOwnerOrAdmin = currentWorkspace?.role === "ADMIN" || currentWorkspace?.role === "OWNER";

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
      toast.success(`Invitation sent to ${email}`);
    } catch (err: unknown) {
      const parsed = apiErrors(err);
      setErrors(parsed);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[13px]">
          <UserPlus size={15} strokeWidth={1.5} />
          <span>Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0">
              <UserPlus size={17} className="text-purple-500" strokeWidth={1.5} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading tracking-tight">Invite Member</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                Invite someone to collaborate in this workspace. They'll receive an email invitation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] font-medium">
              Email address
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <Mail size={15} className="text-muted-foreground/60" strokeWidth={1.5} />
              </div>
              <Input
                id="email"
                placeholder="colleague@company.com"
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
              />
            </div>
            {errors.email && <p className="text-[12px] text-destructive">{errors.email}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-[13px] font-medium">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val as "ADMIN" | "MEMBER")}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/40 text-[13px]">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-muted-foreground" strokeWidth={1.5} />
                  <SelectValue placeholder="Select role" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="MEMBER" className="text-[13px] rounded-lg hover:bg-gray-700 cursor-pointer">
                  Member
                </SelectItem>
                {isOwnerOrAdmin && (
                  <SelectItem value="ADMIN" className="text-[13px] rounded-lg hover:bg-gray-700 cursor-pointer">
                    Admin
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-[12px] text-destructive">{errors.role}</p>}
          </div>

          {/* Error */}
          {errors.error && <ErrorMessage error={errors.error} />}

          <Button
            variant="outline"
            disabled={isPending || !email}
            onClick={handleInvite}
            className="w-full rounded-xl h-10 text-[13px] gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Sending invitation...
              </>
            ) : (
              "Send invitation"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMember;
