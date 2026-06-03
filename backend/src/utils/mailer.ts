import { sendMailFromResend } from "../lib/resend";

type SendInviteEmailProps = {
  to: string;
  workspaceName: string;
  token: string;
};

export async function sendInviteEmail({ to, workspaceName, token }: SendInviteEmailProps) {
  const inviteUrl = `${process.env.CLIENT_URL}/invite/${token}`;
  return sendMailFromResend({
    to,
    subject: `You're invited to join ${workspaceName} on FlowBoard`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>You've been invited</h2>
        <p>You have been invited to join <strong>${workspaceName}</strong> workspace on FlowBoard.</p>
        <a 
          href="${inviteUrl}" 
          style="display:inline-block; padding: 10px 20px; background:#000; color:#fff; border-radius:8px; text-decoration:none;"
        >
          Accept Invite
        </a>
        <p style="color:#888; font-size:12px; margin-top:16px;">
          This link expires in 48 hours. If you didn't expect this, ignore this email.
        </p>
      </div>
    `,
  });
};