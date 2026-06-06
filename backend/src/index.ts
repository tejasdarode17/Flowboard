import './globals'
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes"
import issueRoutes from "./routes/issues.routes"
import githubRoutes from "./routes/github.routes"
import webhooksRoutes from "./routes/webhook.routes"
import errorMiddleware from "./middlewares/error.middleware";
import cloudinaryConfig from './lib/cloudinary';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
  }),
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

app.use(errorMiddleware);

app.listen(PORT, () => {
  cloudinaryConfig()
  console.log(`Server is running on ${PORT}`);
});

