import {
    CheckCircle2,
    Clock,
    UserPlus,
    UserMinus,
    UserRoundCog,
    MessageSquare,
    GitPullRequest,
    GitMerge,
    RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NotificationIconConfig = {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
};

const notificationConfig: Record<string, NotificationIconConfig> = {
    // Issues
    ISSUE_ASSIGNED: {
        icon: UserPlus,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
    },
    ISSUE_COMPLETED: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    ISSUE_REOPENED: {
        icon: RotateCcw,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },

    // Pull Requests
    PR_MERGED: {
        icon: GitMerge,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
    },
    PR_OPENED: {
        icon: GitPullRequest,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    PR_CLOSED: {
        icon: GitPullRequest,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
    },
    PR_REOPENED: {
        icon: RotateCcw,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },

    // Comments
    COMMENT_ADDED: {
        icon: MessageSquare,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
    },

    // Members
    MEMBER_JOINED: {
        icon: UserPlus,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    MEMBER_REMOVED: {
        icon: UserMinus,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
    },
    MEMBER_ROLE_CHANGED: {
        icon: UserRoundCog,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
    },
};

const defaultConfig: NotificationIconConfig = {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-border/30",
};

export function getNotificationIcon(type: string): LucideIcon {
    return notificationConfig[type]?.icon || defaultConfig.icon;
}

export function getNotificationConfig(type: string): NotificationIconConfig {
    return notificationConfig[type] || defaultConfig;
}