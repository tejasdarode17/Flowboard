import type { Role, Workspace } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
      member?: {
        id: string;
        userId: string;
        workspaceId: string;
        role: Role;
      };
      workspace: Workspace
    }
  }
}
