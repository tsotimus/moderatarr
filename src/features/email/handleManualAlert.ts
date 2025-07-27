
import { GetRequestResponse } from "../requests/types";

import { NewRequestEmail } from '@/emails/new-request';
import { resend } from "@/lib/resend";
import { env } from "@/env";
import { OverseerrWebhookPayload } from "@/lib/overseerr";




export const handleAdminAlert = async (requester: NonNullable<OverseerrWebhookPayload["request"]>, title: string, type: "Movie" | "TV Show") => {

    await resend.emails.send({
        from: env.OVERSEERR_EMAIL,
        to: env.ADMIN_EMAIL,
        subject: `Action required - A new request has been made`,
        react: NewRequestEmail({
          requesterUsername: requester.requestedBy_username ?? "",
          requesterEmail: requester.requestedBy_email ?? "",
          mediaTitle: title,
          mediaType: type,
          overseerrUrl: env.OVERSEERR_EMAIL_URL,
        }),
        headers: {
            "X-Priority": "1",
            "X-MS-Priority": "High",
            'Importance': 'high',
        }
      });
    
}