import { useNavigate, useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, AtSign, ArrowLeft, Shield, User, Lock, ChevronRight, Loader2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { joinedDate } from "@/shared/utils/formatDate";
import ConnectUserGithub from "../components/ConnectUserGithub";
import { useState } from "react";
import { clearUser } from "@/redux/authSlice";
import axios from "axios";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";

const UserProfile = () => {
  const { username } = useParams();
  const loggedInUser = useAppSelector((state) => state.auth.userData);
  const { data, isLoading, error, isFetching } = useUserProfile(username);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  async function handleLogout() {
    try {
      setLogoutLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/auth");
    } catch (error) {
      console.log(error);
    } finally {
      setLogoutLoading(false);
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error && isFetching && isLoading) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-300 mx-auto">
        <div className="flex items-center justify-center min-h-300">
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <Shield size={28} className="text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold mb-1">Profile not found</h2>
            <p className="text-[13px] text-muted-foreground">The user you're looking for doesn't exist or you don't have access.</p>
            <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} className="mr-2" />
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSelf = loggedInUser?.id === data?.id;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-300 mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-150" />
        Back
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Cover area */}
            <div className="h-20 bg-linear-to-br from-accent/40 to-accent/10" />

            {/* Avatar + Info */}
            <div className="px-6 pb-6">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <Avatar className="h-20 w-20 rounded-xl border-4 border-background ring-2 ring-border/20 shrink-0">
                  <AvatarImage src={data?.avatar ?? ""} className="rounded-xl" />
                  <AvatarFallback className="flex h-full w-full items-center justify-center bg-accent text-xl font-semibold rounded-xl">
                    {data?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">{data?.name}</h1>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <AtSign size={13} strokeWidth={1.5} />
                  <span>{data?.username}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          {isSelf && (
            <div className="mt-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30">
                <h2 className="font-semibold text-[15px]">Quick Settings</h2>
              </div>
              <div className="divide-y divide-border/20">
                <Link
                  to={`/profile/edit/${data?.username}`}
                  className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-accent/20 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <User size={15} className="text-blue-500" strokeWidth={1.5} />
                    <span className="text-[13px]">Edit Profile</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all" />
                </Link>

                <Link
                  to={`/profile/${data?.username}/settings`}
                  className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-accent/20 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Lock size={15} className="text-purple-500" strokeWidth={1.5} />
                    <span className="text-[13px]">Account Settings</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all" />
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-accent/20 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {logoutLoading ? (
                      <Loader2 size={15} className="text-red-500 animate-spin" strokeWidth={1.5} />
                    ) : (
                      <LogOut size={15} className="text-red-500" strokeWidth={1.5} />
                    )}
                    <span className="text-[13px]">Sign out</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/30">
              <h2 className="font-semibold text-[15px]">Account Details</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">Personal information and linked accounts</p>
            </div>

            <div className="divide-y divide-border/20">
              <div className="flex items-center justify-between px-6 py-4 hover:bg-accent/20 transition-all duration-150">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl border shrink-0 bg-blue-500/10 border-blue-500/20">
                    <Mail size={16} className="text-blue-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-muted-foreground">Email</p>
                    <p className="text-[14px] font-medium truncate">{data?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 hover:bg-accent/20 transition-all duration-150">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl border shrink-0 bg-emerald-500/10 border-emerald-500/20">
                    <Calendar size={16} className="text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-muted-foreground">Member since</p>
                    <p className="text-[14px] font-medium">{joinedDate(data?.createdAt || "")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isSelf && (
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border/30">
                <h2 className="font-semibold text-[15px]">Integrations</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">Connect external services to enhance your workflow</p>
              </div>
              <div className="p-6">
                <ConnectUserGithub />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-300 mx-auto">
    <Skeleton className="h-4 w-16 mb-6" />

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
          <Skeleton className="h-20 w-full" />
          <div className="px-6 pb-6">
            <div className="flex justify-between items-end -mt-10 mb-4">
              <Skeleton className="h-20 w-20 rounded-xl ring-4 ring-background" />
              <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
          <Skeleton className="h-5 w-28 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border/40 bg-card/50">
          <div className="px-6 py-4 border-b border-border/30">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          <div className="divide-y divide-border/20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3.5 px-6 py-4">
                <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50">
          <div className="px-6 py-4 border-b border-border/30">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserProfile;
