import './globals'
import express from "express";
import http from "http"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes"
import issueRoutes from "./routes/issues.routes"
import githubRoutes from "./routes/github.routes"
import webhooksRoutes from "./routes/webhook.routes"
import userRoutes from "./routes/user.routes"
import activityRoutes from "./routes/activities.routes"
import notificationsRoutes from './routes/notifications.routes'
import errorMiddleware from "./middlewares/error.middleware";
import cloudinaryConfig from './lib/cloudinary';
import { initSocket } from './socket/socket';

dotenv.config();


const app = express();
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 8000;

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// GitHub webhook needs the raw request body for signature verification,
// so this route is mounted before express.json().
app.use("/api/github", webhooksRoutes)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes)
app.use("/api/workspace", projectRoutes)
app.use("/api/workspace", issueRoutes)
app.use("/api/github", githubRoutes)
app.use("/api/workspace", activityRoutes);
app.use("/api/workspace/", notificationsRoutes)
app.use("/api/user", userRoutes)
app.use(errorMiddleware);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  cloudinaryConfig()
  console.log(`Server is running on ${PORT}`);
});

