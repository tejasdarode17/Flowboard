import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Users, Mail, AtSign, MoreHorizontal, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMembers } from "../hooks/useMembers";
import MemberBadge from "../components/MemberBadge";
import InviteMember from "../components/InviteMember";

const Members = () => {
  const { workspaceSlug } = useParams();
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useMembers(workspaceSlug!);

  const filteredMembers = members?.filter((member) => {
    const query = search.toLowerCase();
    return (
      member.user.name.toLowerCase().includes(query) ||
      member.user.email.toLowerCase().includes(query) ||
      member.user.username.toLowerCase().includes(query)
    );
  });

  const totalMembers = members?.length || 0;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
          <p className="text-[13px] text-muted-foreground mt-1.5">
            {totalMembers > 0
              ? `${totalMembers} ${totalMembers === 1 ? "member" : "members"} in this workspace`
              : "Manage workspace members and their roles"}
          </p>
        </div>

        {/* Invite Dialog */}
        <InviteMember></InviteMember>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" strokeWidth={1.5} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or username..."
          className="pl-10 h-10 rounded-xl bg-muted/50 border-border/40 text-[13px] placeholder:text-muted-foreground/50"
        />
      </div>

      <Separator className="bg-border/40 mb-6" />

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4">
              <div className="space-y-2 flex-1"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !filteredMembers?.length && (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
              {search ? (
                <Search size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
              ) : (
                <Users size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
              )}
            </div>
            <h2 className="text-[17px] font-semibold mb-1.5">{search ? "No members found" : "No members yet"}</h2>
            <p className="text-[13px] text-muted-foreground text-center max-w-sm">
              {search ? "Try adjusting your search terms." : "Invite team members to start collaborating."}
            </p>
          </div>
        </div>
      )}

      {/* Members Grid */}
      {!isLoading && filteredMembers?.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4 hover:shadow-sm hover:border-border/60 transition-all duration-200"
            >
              <Avatar className="h-11 w-11 rounded-xl border border-border/40 shrink-0">
                <AvatarImage src={member.user.avatar ?? ""} className="rounded-xl" />
                <AvatarFallback className="bg-accent text-[13px] font-semibold rounded-xl">
                  {member.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
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

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent/50 transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0">
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem className="text-[13px] rounded-lg cursor-pointer">Change role</DropdownMenuItem>
                  <DropdownMenuItem className="text-[13px] rounded-lg cursor-pointer">View profile</DropdownMenuItem>
                  <Separator className="my-1 bg-border/40" />
                  <DropdownMenuItem className="text-[13px] text-red-500 rounded-lg cursor-pointer hover:text-red-500">
                    Remove member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Members;
