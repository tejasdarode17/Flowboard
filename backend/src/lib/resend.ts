import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

type SendMailProps = {
    to: string;
    subject: string;
    html: string;
};

export async function sendMailFromResend({ to, subject, html, }: SendMailProps) {
    try {
        const response = await resend.emails.send({
            from: "FlowBoard <noreply@flowboard.space>",
            to,
            subject,
            html,
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

