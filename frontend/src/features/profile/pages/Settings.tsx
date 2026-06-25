import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { ChevronRight, Shield } from "lucide-react";

import ChangePassword from "@/features/profile/components/ChangePassword";
import ChangeEmail from "../components/ChangeEmail";
import ConnectUserGithub from "../components/ConnectUserGithub";

const Settings = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector((store) => store.auth);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">Manage your account, integrations, and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h2 className="font-semibold text-[15px]">Account</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Manage your personal account settings</p>
          </div>

          <div className="divide-y divide-border/20">
            {/* Edit Profile */}
            <button
              onClick={() => navigate(`/profile/edit/${userData?.username}`)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/20 transition-all duration-150 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl border shrink-0 bg-blue-500/10 border-blue-500/20">
                  <User size={16} className="text-blue-500" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[14px] font-medium">Edit Profile</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Update your name, username, and profile photo</p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all duration-150 shrink-0 ml-4"
              />
            </button>

            {/* Change Email */}
            <ChangeEmail>
              <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/20 transition-all duration-150 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl border shrink-0 bg-blue-500/10 border-blue-500/20">
                    <Mail size={16} className="text-blue-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[14px] font-medium">Change Email</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Update your email address</p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all duration-150 shrink-0 ml-4"
                />
              </button>
            </ChangeEmail>

            {/* Change Password */}
            <ChangePassword>
              <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/20 transition-all duration-150 group">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl border shrink-0 bg-purple-500/10 border-purple-500/20">
                    <Lock size={16} className="text-purple-500" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[14px] font-medium">Change Password</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">Update your password</p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/40 group-hover:text-muted-foreground transition-all duration-150 shrink-0 ml-4"
                />
              </button>
            </ChangePassword>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h2 className="font-semibold text-[15px]">Integrations</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Connect external services to enhance your workflow</p>
          </div>
          <div className="p-6">
            <ConnectUserGithub />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-red-500/20">
            <h2 className="font-semibold text-[15px] text-red-500">Danger Zone</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">Irreversible actions for your account</p>
          </div>
          <div className="px-6 py-4">
            <button className="flex items-center gap-3.5 px-3 py-2 rounded-xl hover:bg-red-500/5 transition-all duration-150 group w-full">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl border border-red-500/20 bg-red-500/10 shrink-0">
                <Shield size={16} className="text-red-500" strokeWidth={1.5} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[14px] font-medium text-red-500">Delete Account</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Permanently delete your account and all data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
