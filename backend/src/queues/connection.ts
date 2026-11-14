import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const queueConnection = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null,
});


queueConnection.on("connect", () => console.log("Queue Redis connected"));
queueConnection.on("error", (err) => console.error("Queue Redis error:", err));