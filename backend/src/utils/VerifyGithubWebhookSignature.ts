import crypto from "crypto";

export function verifyGitHubWebhookSignature(payload: Buffer, signature: string) {

    const secret = process.env.GITHUB_WEBHOOK_SECRET!;
    const expectedSignature = "sha256=" + crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}