import { Crown, Shield, User } from "lucide-react";

type MemberBadgeProps = {
  role: "OWNER" | "ADMIN" | "MEMBER";
};

const roleConfig = {
  OWNER: {
    icon: Crown,
    label: "Owner",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  ADMIN: {
    icon: Shield,
    label: "Admin",
    className: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  MEMBER: {
    icon: User,
    label: "Member",
    className: "border-border/40 bg-muted/50 text-muted-foreground",
  },
};

const MemberBadge = ({ role }: MemberBadgeProps) => {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${config.className}`}>
      <Icon size={10} strokeWidth={2} />
      {config.label}
    </span>
  );
};

export default MemberBadge;
