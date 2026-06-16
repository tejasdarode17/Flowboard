import { Server, Socket } from "socket.io";
import prisma from "../lib/prisma";

export const workspaceSocket = (io: Server, socket: Socket) => {
    socket.on("join:workspace", async (workspaceId: string) => {

        const userId = socket.data.userId;

        const member = await prisma.member.findFirst({
            where: { userId, workspaceId },
        });
        if (!member) return;

        const previous = socket.data.currentWorkspace;
        if (previous && previous !== workspaceId) {
            socket.leave(`workspace:${previous}`);
        }

        socket.join(`workspace:${workspaceId}`);
        socket.data.currentWorkspace = workspaceId;

    });
};


