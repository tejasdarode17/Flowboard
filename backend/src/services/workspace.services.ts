import crypto from 'crypto';
import { Prisma, Role } from '@prisma/client';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from "./../validations/worksapce.validations";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import slugify from "slugify";
import { uploadImageToCloudinary } from '../utils/cloudinaryHandler';
import { sendInviteEmail } from '../utils/mailer';
import { createActivity } from './activites.services';
import { createNotification } from './notification.services';
import { emitToUser, emitToWorkspace } from '../socket/socket';

export async function createWorkspace(data: CreateWorkspaceInput, userId: string, file: Buffer | undefined) {

  const slug = slugify(data.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const existingWorkspace = await prisma.workspace.findUnique({ where: { slug } });
  if (existingWorkspace) {
    throw new AppError("Workspace already exist with this name", 409);
  }

  let logoUrl: string | undefined;
  let logoPublicId: string | undefined;
  if (file) {
    const uploaded = await uploadImageToCloudinary(file);
    logoUrl = uploaded.url;
    logoPublicId = uploaded.publicId;
  }

  const workspace = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        logo: logoUrl,
        logoId: logoPublicId
      },
    });

    await tx.member.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    return workspace;
  });


  return workspace;
};


export async function updateWorkspace(data: UpdateWorkspaceInput, workspaceId: string, memberId: string) {

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  const updatedData: Prisma.WorkspaceUpdateInput = {};

  if (data.name !== undefined && data.name !== workspace.name) {
    const newSlug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    updatedData.name = data.name;
    updatedData.slug = newSlug;
  }

  if (data.logo !== undefined && data.logo !== workspace.logo) {
    updatedData.logo = data.logo;
  }

  if (data.description !== undefined && data.description !== workspace.description) {
    updatedData.description = data.description;
  }

  if (Object.keys(updatedData).length === 0) {
    return workspace;
  }


  const updatedWorkspace = await prisma.$transaction(async (tx) => {
    const updatedWorkspace = await tx.workspace.update({
      where: {
        id: workspaceId,
      },
      data: updatedData,
    });

    await createActivity(
      {
        workspaceId: workspace.id,

        actorId: memberId,

        action: "WORKSPACE_UPDATED",

        entityType: "WORKSPACE",
        entityId: workspace.id,
        entityName: updatedWorkspace.name,

        metadata: {
          updatedFields: Object.keys(updatedData),

          oldName: workspace.name,
          newName: updatedWorkspace.name,

          oldDescription: workspace.description,
          newDescription: updatedWorkspace.description,
        },
      },
      tx
    );

    return updatedWorkspace;
  });

  return updatedWorkspace;

}


export async function getWorkspaces(userId: string) {

  const memberships = await prisma.member.findMany({
    where: { userId },
    include: {
      workspace: true
    }
  })

  if (!memberships.length) {
    throw new AppError("You are not part of any workspaces", 404)
  }

  const workspaces = memberships.map((m) => {
    return {
      id: m.workspace.id,
      name: m.workspace.name,
      description: m.workspace.description,
      slug: m.workspace.slug,
      role: m.role,
      logo: m.workspace.logo
    }
  })

  return workspaces
};


export async function getWorkspaceDetails(workspaceId: string) {

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  return workspace
};


export async function deleteWorkspace(workspaceId: string) {

  const workspace = await prisma.workspace.delete({ where: { id: workspaceId } })


  // CASCADE DEKHNA HAI KAL 

  // ONE DELETE EVRUTHING SHOULD BE DELETE 
  // NO ORPHAN DATA


};



// ----------------Members of workspace---------------------
export async function getMembersOfWorkspace(workspaceId: string) {

  const members = await prisma.member.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          avatar: true
        }
      }
    }
  })

  return members
};


export async function inviteMember(workspaceId: string, email: string, role: Role) {

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) throw new AppError("Workspace not found", 404);

  //check if this user is already pat of this workspace 
  const alreadyMember = await prisma.member.findFirst({
    where: {
      workspaceId,
      user: { email },
    },
  });

  if (alreadyMember) throw new AppError("User is already a member", 409);

  // check if we alredy send the invite 
  // only non-expired record  
  const existingInvite = await prisma.workspaceInvite.findFirst({
    where: {
      email,
      workspaceId,
      accepted: false,
      expiresAt: { gt: new Date() }
    },
  });
  if (existingInvite) throw new AppError("Invite already sent to this email", 409);

  // Token generate
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours

  const invite = await prisma.workspaceInvite.create({
    data: { email, workspaceId, role, token, expiresAt },
  });

  await sendInviteEmail({
    to: email,
    workspaceName: workspace.name,
    token,
  });

  return invite;
};


export async function validateInviteToken(token: string) {

  const invite = await prisma.workspaceInvite.findUnique({
    where: { token },
    include: { workspace: true },
  });

  if (!invite) throw new AppError("Invalid invite link", 404);
  if (invite.accepted) throw new AppError("Invite already used", 400);
  if (invite.expiresAt < new Date()) throw new AppError("Invite link expired", 400);

  return invite;
};


export async function acceptWorkspaceInvite(token: string, userId: string) {
  const invite = await validateInviteToken(token);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);

  if (user.email !== invite.email) {
    throw new AppError("This invite was sent to a different email", 403);
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: invite.workspaceId },
    select: { id: true, name: true },
  });

  if (!workspace) throw new AppError("Workspace not found", 404);

  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.member.create({
      data: {
        userId,
        workspaceId: invite.workspaceId,
        role: invite.role,
      },
    });

    await tx.workspaceInvite.update({
      where: { token },
      data: { accepted: true },
    });

    await createActivity({
      workspaceId: invite.workspaceId,
      actorId: member.id,
      action: "MEMBER_JOINED",
      entityType: "MEMBER",
      entityId: member.id,
      entityName: user.name,
    }, tx)
    return member;
  });

  //notification 
  try {

    const members = await prisma.member.findMany({
      where: {
        workspaceId: invite.workspaceId,
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      members.map((m) =>
        createNotification({
          memberId: m.id,
          workspaceId: invite.workspaceId,

          title: "New member joined",
          message: `${user.name} joined ${workspace.name}`,

          type: "MEMBER_JOINED",

          entityId: result.id,
          entityType: "MEMBER",

          metadata: {
            joinedUserId: user.id,
            joinedUserName: user.name,
          },
        })
      )
    );

    emitToWorkspace(
      workspace.id,
      "notification:new",
      {
        workspaceId: invite.workspaceId,
        title: "New member joined",
        message: `${user.name} joined ${workspace.name}`,

        type: "MEMBER_JOINED",

        entityId: result.id,
        entityType: "MEMBER",

        metadata: {
          joinedUserId: user.id,
          joinedUserName: user.name,
        },
      }
    )
  } catch (error) {
    console.error("Failed to create member joined notifications", error);
  }

  return {
    workspaceId: invite.workspaceId,
    memberId: result.id,
  };
}


export async function removeMember(workspaceId: string, targetMemberId: string, actorMemberId: string) {
  const actor = await prisma.member.findUnique({
    where: { id: actorMemberId },
  });

  const target = await prisma.member.findUnique({
    where: { id: targetMemberId },
    include: {
      user: true,
    },
  });

  if (!actor || !target) {
    throw new AppError("Member not found", 404);
  }

  if (target.workspaceId !== workspaceId) {
    throw new AppError("Member not found", 404);
  }

  if (actor.id === target.id) {
    throw new AppError("You cannot remove yourself", 400);
  }

  // ROLE CHECKS
  if (actor.role === "MEMBER") {
    throw new AppError("You do not have permission to remove members", 403);
  }

  if (actor.role === "ADMIN" && target.role !== "MEMBER") {
    throw new AppError("Admins can only remove members", 403);
  }

  if (actor.role === "OWNER" && target.role === "OWNER") {
    throw new AppError("Workspace owner cannot be removed", 403);
  }

  await prisma.$transaction(async (tx) => {

    await tx.member.delete({
      where: { id: target.id },
    });

    await createActivity({
      workspaceId,

      actorId: actor.id,

      action: "MEMBER_REMOVED",

      entityType: "MEMBER",
      entityId: target.id,
      entityName: target.user.name,

      metadata: {
        removedBy: actor.id,
        removedMemberId: target.id,
        removedMemberName: target.user.name,
      },
    }, tx)

    return true;
  });

  return {
    success: true,
    message: "Member removed successfully",
  };
}


export async function updateMemberRole(workspaceId: string, targetMemberId: string, actorMemberId: string, role: Role) {

  const actor = await prisma.member.findUnique({
    where: { id: actorMemberId },
  });

  const target = await prisma.member.findUnique({
    where: { id: targetMemberId },
    include: {
      user: true,
    },
  });

  if (!actor || !target) {
    throw new AppError("Member not found", 404);
  }

  if (target.workspaceId !== workspaceId) {
    throw new AppError("Member not found", 404);
  }

  if (actor.role !== "OWNER") {
    throw new AppError("Only workspace owner can change roles", 403);
  }

  if (actor.id === target.id) {
    throw new AppError("You cannot change your own role", 400);
  }

  if (target.role === "OWNER") {
    throw new AppError("Owner role cannot be modified", 400);
  }

  if (target.role === role) {
    throw new AppError(`Member is already ${role}`, 400);
  }

  const oldRole = target.role;

  const updatedMember = await prisma.$transaction(async (tx) => {
    // 1. update role
    const updated = await tx.member.update({
      where: { id: target.id },
      data: { role },
    });

    // 2. activity
    await createActivity(
      {
        workspaceId,

        actorId: actor.id,

        action: "MEMBER_ROLE_CHANGED",

        entityType: "MEMBER",
        entityId: target.id,
        entityName: target.user.name,

        metadata: {
          oldRole,
          newRole: role,
        },
      },
      tx
    );

    return updated;
  });


  //notification
  try {
    const notification = await createNotification({
      memberId: target.id,
      workspaceId,
      title: "Role updated",
      message: `Your role has been changed from ${oldRole} to ${role}`,

      type: "MEMBER_ROLE_CHANGED",

      entityId: target.id,
      entityType: "MEMBER",

      metadata: {
        oldRole,
        newRole: role,
        changedByMemberId: actor.id,
      }
    });

    emitToUser(target.user.id, "notification:new", notification)


  } catch (err) {
    console.error("Notification failed", err);
  }

  return updatedMember;
}