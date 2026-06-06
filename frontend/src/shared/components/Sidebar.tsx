import { FolderKanban, LayoutGrid, Loader2, LogOut, Settings, Users2, ChevronDown, Plus } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useState } from "react";
import CreateWorkspace from "@/features/workspace/components/CreateWorkspace";
import { useAppSelector } from "../hooks/useAppSelector";
import DarkMode from "@/shared/components/DarkMode";
import axios from "axios";
import { clearUser } from "@/redux/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import MemberBadge from "@/features/workspace/components/MemberBadge";

const Sidebar = () => {
  return (
    <aside className="min-h-screen hidden w-70 lg:flex flex-col border-r border-border/40 bg-sidebar/50 backdrop-blur-sm">
      <SideBarContent />
    </aside>
  );
};

export const SideBarContent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((store) => store?.auth);
  const [open, setOpen] = useState<boolean>(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  const { workspaceSlug } = useParams();
  const { data: workspaces, isLoading } = useWorkspaces();

  const currentWorkspace = workspaces?.find((ws) => ws.slug === workspaceSlug);

  const navItems = [
    {
      label: "Overview",
      icon: LayoutGrid,
      path: `/${workspaceSlug}`,
      shortcut: "1",
    },
    {
      label: "Projects",
      icon: FolderKanban,
      path: `/${workspaceSlug}/projects`,
      shortcut: "2",
    },
    {
      label: "Members",
      icon: Users2,
      path: `/${workspaceSlug}/team`,
      shortcut: "3",
    },
    {
      label: "Settings",
      icon: Settings,
      path: `/${workspaceSlug}/settings`,
      shortcut: "4",
    },
  ];

  function handleWorkspaceSelect(slug: string) {
    localStorage.setItem("lastWorkspace", slug);
    navigate(`/${slug}`);
  }

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

  return (
    <div className="flex flex-col h-full px-3 py-4">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 px-2 mb-1">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-foreground/5">
          <FlowBoardLogo size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">FlowBoard</p>
          <p className="text-[10px] text-muted-foreground/50 leading-tight">Project Management</p>
        </div>
      </div>

      {/* Workspace switcher - Linear style dropdown */}
      <div className="mt-6 px-1">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-all duration-150 group"
        >
          <Avatar className="h-7 w-7 rounded-md border border-border/50">
            <AvatarImage src={currentWorkspace?.logo ?? ""} />
            <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-md">
              {currentWorkspace?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium truncate">{currentWorkspace?.name || "Select Workspace"}</p>
          </div>
          <ChevronDown
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${workspaceMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {workspaceMenuOpen && (
          <div className="mt-1 px-1 py-1 bg-popover border border-border/40 rounded-xl shadow-lg backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-0.5 max-h-70 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {workspaces?.map((ws) => (
                <button
                  key={ws?.id}
                  onClick={() => {
                    handleWorkspaceSelect(ws.slug);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    ws.slug === workspaceSlug
                      ? "bg-accent text-foreground font-medium"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Avatar className="h-6 w-6 rounded-md border border-border/30">
                    <AvatarImage src={ws?.logo ?? ""} />
                    <AvatarFallback className="bg-accent text-[10px] font-semibold rounded-md">
                      {ws?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{ws?.name}</span>
                  {ws.slug === workspaceSlug && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>

            <div className="mt-1 pt-1 border-t border-border/40">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2.5 px-3 py-2 h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg"
                onClick={() => {
                  setOpen(true);
                  setWorkspaceMenuOpen(false);
                }}
              >
                <Plus size={16} />
                Create Workspace
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateWorkspace open={open} setOpen={setOpen} />

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-0.5">
        <div className="px-2 mb-2">
          <p className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">Workspace</p>
        </div>

        {navItems.map(({ label, icon: Icon, path, shortcut }) => (
          <NavLink
            key={path}
            to={path}
            end={path === `/${workspaceSlug}`}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-all duration-150 ${
                isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="transition-all duration-150 shrink-0" />
                <span className="flex-1">{label}</span>
                <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 min-w-5 px-1 rounded bg-muted text-[10px] font-medium text-muted-foreground">
                  {shortcut}
                </kbd>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section - Theme toggle + User */}
      <div className="mt-auto space-y-2">
        {/* Theme Toggle - Properly styled wrapper */}
        <div className="px-2">
          <DarkMode />
        </div>

        <Separator className="bg-border/40" />

        {/* User section */}
        <div className="px-2">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-all duration-150 group">
            <Avatar className="h-7 w-7 rounded-lg border border-border/50">
              <AvatarImage src={userData?.avatar ?? ""} />
              <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-lg">
                {userData?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium truncate">{userData?.name}</p>
              <p className="text-[11px] text-muted-foreground/60">
                <MemberBadge role={currentWorkspace?.role ?? "MEMBER"}></MemberBadge>
              </p>
            </div>
          </button>

          <Button
            variant="ghost"
            onClick={() => handleLogout()}
            disabled={logoutLoading}
            className="mt-2 w-full justify-start gap-2.5 px-3 h-9 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/50"
          >
            {logoutLoading ? (
              <Loader2 className="animate-spin"></Loader2>
            ) : (
              <>
                <LogOut size={14} />
                Sign out
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
