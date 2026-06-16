import { parse } from "cookie";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";
import { workspaceSocket } from './workspace.socket';
import dotenv from "dotenv"
dotenv.config()

let io: Server;

export const initSocket = (httpServer: HttpServer) => {


    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        try {

            const cookies = socket.handshake.headers.cookie;
            if (!cookies) return next(new Error("Unauthorized"));

            const parsed = parse(cookies);
            const token = parsed.accessToken;

            if (!token) return next(new Error("Unauthorized"));
            const payload = verifyAccessToken(token);
            socket.data.userId = payload.userId;
            next();

        } catch (err) {
            console.error(err);
            next(new Error("Unauthorized"));
        }
    });


    io.on("connection", (socket) => {

        socket.join(`user:${socket.data.userId}`);
        workspaceSocket(io, socket)


        //if we remove this line still socket will disconneted. 
        // this is for doing extra activities if soccket is deletd
        //like clearing the redis and all 
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });

    });

    return io;
};



//to emmitng from anywhere 
export const getIO = () => {
    if (!io) throw new Error("Socket not initialized");
    return io;
};

export function emitToUser(userId: string, event: string, data: any) {
    io.to(`user:${userId}`).emit(event, data);
};

export function emitToWorkspace(workspaceId: string, event: string, data: any) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
};