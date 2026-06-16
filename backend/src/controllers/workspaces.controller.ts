import { NextFunction, Request, Response } from 'express';
import { acceptWorkspaceInvite, createWorkspace, getMembersOfWorkspace, getWorkspaceDetails, getWorkspaces, inviteMember, removeMember, updateMemberRole, updateWorkspace, validateInviteToken } from '../services/workspace.services';
import AppError from '../utils/AppError';
import { createWorkspaceSchema, inviteMemberSchema, updateWorkspaceSchema } from '../validations/worksapce.validations';
import { Role } from '@prisma/client';


export async function createWorkspaceController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId
        const file = req.file?.buffer
        if (!userId) return next(new AppError("Not authenticated", 401))
        const body = createWorkspaceSchema.parse(req.body)
        const workspace = await createWorkspace(body, userId, file)

        return res.status(200).json({
            success: "true",
            message: "Workspace created Successfully",
            data: workspace
        })

    } catch (error) {
        next(error)
    }
}


export async function getWorkspacesController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req?.user?.userId
        if (!userId) return next(new AppError("Not authenticated", 401));

        const workspaces = await getWorkspaces(userId);

        return res.status(200).json({
            success: "true",
            message: "Workspaces fetched Successfully",
            data: workspaces,
        })
    } catch (error) {
        next(error)
    }
}


export async function getWorkspaceDetailsController(req: Request, res: Response, next: NextFunction) {
    try {

        const workspaceId = req.workspace.id
        const workspace = await getWorkspaceDetails(workspaceId)

        return res.status(200).json({
            success: "true",
            message: "Workspace fetched Successfully",
            data: workspace
        })

    } catch (error) {
        next(error)
    }
}


export async function updateWorkspaceController(req: Request, res: Response, next: NextFunction) {
    try {
        const workspaceId = req.workspace.id
        const memberId = req.member?.id

        if (!memberId) {
            return next(new AppError("Unauthorized", 401));
        }

        const body = updateWorkspaceSchema.parse(req.body)
        const workspace = await updateWorkspace(body, workspaceId, memberId)

        return res.status(200).json({
            success: "true",
            message: "Workspace updated Successfully",
            data: workspace
        })

    } catch (error) {
        next(error)

    }
}


// ----------------Members of workspace---------------------

export async function getMembersOfWorkspaceController(req: Request, res: Response, next: NextFunction) {
    try {

        const workspaceId = req.workspace.id
        if (!workspaceId || Array.isArray(workspaceId)) return next(new AppError("Workspace Id is required", 401))

        const members = await getMembersOfWorkspace(workspaceId)
        return res.status(200).json({
            success: "true",
            message: "Members fetched Successfully",
            data: members
        })

    } catch (error) {
        next(error)
    }

}


export async function inviteMemberController(req: Request, res: Response, next: NextFunction) {
    try {
        const workspaceId = req.workspace?.id;
        if (!workspaceId) return next(new AppError("Workspace not found", 404));

        const { email, role } = inviteMemberSchema.parse(req.body);

        await inviteMember(workspaceId, email, role);

        return res.status(200).json({
            success: true,
            message: "Invite sent successfully",
        });
    } catch (error) {
        next(error);
    }
};


export async function validateInviteTokenController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;

        if (!token || Array.isArray(token)) {
            return next(new AppError("Token is required", 404))
        }
        const invite = await validateInviteToken(token);

        return res.status(200).json({
            success: true,
            data: {
                email: invite.email,
                workspaceName: invite.workspace.name,
                workspaceSlug: invite.workspace.slug,
                role: invite.role,
            },
        });
    } catch (error) {
        next(error);
    }
};


export async function acceptInviteController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.params;
        const userId = req.user?.userId;
        if (!userId) return next(new AppError("Not authenticated", 401));

        if (!token || Array.isArray(token)) {
            return next(new AppError("Token is required", 404))
        }

        const workspace = await acceptWorkspaceInvite(token, userId);

        return res.status(200).json({
            success: true,
            message: "Invite accepted successfully",
            data: { workspace },
        });
    } catch (error) {
        next(error);
    }
};


export async function updateMemberRoleController(req: Request, res: Response, next: NextFunction) {
    try {

        const targetMemberId = req.params.memberId;

        if (!targetMemberId || Array.isArray(targetMemberId)) {
            return next(new AppError("Member id is required", 400));
        }

        const workspace = req.workspace;
        const actor = req.member;

        if (!workspace) {
            return next(new AppError("Workspace not found", 404));
        }

        if (!actor) {
            return next(new AppError("Unauthorized", 401));
        }

        const role = req.body.role;

        if (role !== Role.ADMIN && role !== Role.MEMBER) {
            return next(new AppError("Role must be ADMIN or MEMBER", 400));
        }

        const member = await updateMemberRole(
            workspace.id,
            targetMemberId,
            actor.id,
            role
        );

        return res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            data: member,
        });

    } catch (error) {
        next(error);
    }
}


export async function removeMemberController(req: Request, res: Response, next: NextFunction) {
    try {

        const targetMemberId = req.params.memberId;

        if (!targetMemberId || Array.isArray(targetMemberId)) {
            return next(new AppError("Member id is required", 400));
        }

        const workspace = req.workspace;
        const actor = req.member;

        if (!workspace) {
            return next(new AppError("Workspace not found", 404));
        }

        if (!actor) {
            return next(new AppError("Unauthorized", 401));
        }

        await removeMember(
            workspace.id,
            targetMemberId,
            actor.id
        );

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        });

    } catch (error) {
        next(error);
    }
}

