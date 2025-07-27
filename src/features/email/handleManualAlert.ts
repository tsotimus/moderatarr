import { GetRequestResponse } from "../requests/types";

import { OverseerrManualRequestEmail } from '@/emails/new-request';
import { resend } from "@/lib/resend";
import { env } from "@/env";




export const handleManualAlert = async (request: GetRequestResponse, title: string, type: "Movie" | "TV Show") => {

    await resend.emails.send({
        from: env.OVERSEERR_EMAIL,
        to: env.ADMIN_EMAIL,
        subject: `Action required - A new request has been made`,
        react: OverseerrManualRequestEmail({
          requesterUsername: request.requestedBy.username,
          requesterEmail: request.requestedBy.email,
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