import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { Loader2, Building2, Mail, ArrowRight, AlertCircle, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiErrors } from "@/shared/utils/errorHandler";
import { useState } from "react";
import { acceptInviteApi, validateInviteTokenApi } from "../services/workspace.services";
import { clearUser } from "@/redux/authSlice";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";

const Invite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.userData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    data: invite,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => validateInviteTokenApi(token!),
    retry: false,
    enabled: !!token,
  });

  const { mutateAsync: acceptInvite, isPending } = useMutation({
    mutationFn: () => acceptInviteApi(token!),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      navigate(`/${data.workspace.slug}`);
    },
    onError: (err) => {
      const parsed = apiErrors(err);
      setErrors(parsed);
    },
  });

  async function handleSwitchAccount() {
    dispatch(clearUser());
    navigate(`/auth?invite=${token}`);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 border border-border/40">
            <Loader2 className="animate-spin text-muted-foreground" size={22} strokeWidth={1.5} />
          </div>
          <p className="text-sm text-muted-foreground">Validating invitation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !invite) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-6">
            <AlertCircle size={28} className="text-red-500" strokeWidth={1.5} />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">Invitation expired</h1>
          <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
            This invite link is no longer valid. Please ask your workspace admin to send a new invitation.
          </p>

          <Button variant="outline" className="w-full mt-6 rounded-xl h-10" onClick={() => navigate("/")}>
            Go to FlowBoard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar with logo */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-foreground/5">
            <FlowBoardLogo size={22} />
          </div>
          <p className="text-sm font-semibold tracking-tight">FlowBoard</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-8">
            {/* Workspace info */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/40 mx-auto">
                {invite.workspaceLogo ? (
                  <img src={invite.workspaceLogo} alt={invite.workspaceName} className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <Building2 size={26} className="text-muted-foreground" strokeWidth={1.5} />
                )}
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight">Join {invite.workspaceName}</h1>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="text-[13px] text-muted-foreground">You've been invited as</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent text-[12px] font-medium">{invite.role}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/40 my-6" />

            {/* Invite details */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/30 border border-border/30">
              <Mail size={15} className="text-muted-foreground shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Invited email</p>
                <p className="text-[13px] font-medium truncate">{invite.email}</p>
              </div>
            </div>

            {/* Error message */}
            {errors.error && (
              <div className="mt-4 flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-[12px] text-red-600 dark:text-red-400">{errors.error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {user ? (
                <>
                  {/* Current user info */}
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/30">
                    <Avatar className="h-8 w-8 rounded-lg border border-border/40 shrink-0">
                      <AvatarImage src={user.avatar ?? ""} className="rounded-lg" />
                      <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {user.email !== invite.email ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[12px] text-amber-600 dark:text-amber-400">
                          This invite was sent to <strong>{invite.email}</strong>. Switch to that account to accept.
                        </p>
                      </div>

                      <Button variant="outline" className="w-full rounded-xl h-10 gap-2" onClick={handleSwitchAccount}>
                        <LogOut size={15} />
                        Switch account & Join
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full rounded-xl h-10 gap-2" disabled={isPending} onClick={() => acceptInvite()}>
                      {isPending ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          Join {invite.workspaceName}
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 gap-2"
                    onClick={() => navigate(`/auth/register?invite=${token}`)}
                  >
                    <UserPlus size={15} />
                    Create account & Join
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="bg-border/40" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-card text-[11px] text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full rounded-xl h-10" onClick={() => navigate(`/auth?invite=${token}`)}>
                    Login & Join
                    <ArrowRight size={15} className="ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
            By joining, you agree to FlowBoard's terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invite;


