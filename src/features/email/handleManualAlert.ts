

import { NewRequestEmail } from '@/emails/new-request';
import { resend } from "@/lib/resend";
import { env } from "@/env";
import { GeneralWebhookPayload } from "@/lib/overseerr/schema";

export const handleAdminAlert = async (requester: NonNullable<GeneralWebhookPayload["request"]>, title: string, type: "Movie" | "TV Show", reason: string) => {
    try {
        await resend.emails.send({
            from: `"Caucasus Cloud" <${env.SEERR_EMAIL}>`,
            to: env.ADMIN_EMAIL,
            subject: `Action required - A new request has been made`,
            react: NewRequestEmail({
              requesterUsername: requester.requestedBy_username ?? "",
              requesterEmail: requester.requestedBy_email ?? "",
              mediaTitle: title,
              mediaType: type,
              overseerrUrl: env.SEERR_EMAIL_URL,
              reason: reason,
            }),
            headers: {
                "X-Priority": "1",
                "X-MS-Priority": "High",
                'Importance': 'high',
            }
        });
    } catch (error) {
        console.error("Failed to send admin alert email:", error);
    }
}