import {
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  FolderPen,
  FolderX,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  MessageSquare,
  UserMinus,
  UserPlus,
  UserRoundCog,
  Pencil,
  Trash2,
  RotateCcw,
  Flag,
} from "lucide-react";

import type { ActivityAction } from "../types/activity.types";

export function getActivityIcon(action: ActivityAction) {
  switch (action) {
    // Projects
    case "PROJECT_CREATED":
      return FolderKanban;

    case "PROJECT_UPDATED":
      return FolderPen;

    case "PROJECT_DELETED":
      return FolderX;

    // Issues
    case "ISSUE_CREATED":
      return ClipboardList;

    case "ISSUE_UPDATED":
      return Pencil;

    case "ISSUE_DELETED":
      return Trash2;

    case "ISSUE_STATUS_CHANGED":
      return CheckCircle2;

    case "ISSUE_PRIORITY_CHANGED":
      return Flag;

    case "ISSUE_ASSIGNED":
      return UserPlus;

    case "ISSUE_COMPLETED":
      return CheckCircle2;

    case "ISSUE_REOPENED":
      return RotateCcw;

    // Members
    case "MEMBER_JOINED":
      return UserPlus;

    case "MEMBER_REMOVED":
      return UserMinus;

    case "MEMBER_ROLE_CHANGED":
      return UserRoundCog;

    // GitHub
    case "PUSH":
      return GitCommitHorizontal;

    case "PR_OPENED":
      return GitPullRequest;

    case "PR_MERGED":
      return GitMerge;

    case "PR_CLOSED":
      return GitPullRequest;

    case "PR_REOPENED":
      return RotateCcw;

    // Comments
    case "COMMENT_ADDED":
      return MessageSquare;

    default:
      return GitBranch;
  }
}
