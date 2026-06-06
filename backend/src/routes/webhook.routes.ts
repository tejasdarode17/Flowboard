import { Router } from "express";
import express from "express";
import { githubWebhookController } from "../controllers/github.controller";

const router = Router();


// this middleware Keep request body as raw Buffer for GitHub signature verification
router.post("/webhook", express.raw({ type: "application/json" }), githubWebhookController);

export default router;