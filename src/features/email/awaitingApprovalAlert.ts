import { GetRequestResponse } from "../requests/types";
import { env } from "@/env";
import { resend } from "@/lib/resend";
import { AwaitingApprovalEmail } from "@/emails/awaiting-approval";

export const awaitingApprovalAlert = async (request: GetRequestResponse, title: string, type: "Movie" | "TV Show", reason: string) => {
    await resend.emails.send({
        from: env.OVERSEERR_EMAIL,
        to: env.ADMIN_EMAIL,
        subject: `Awaiting approval - Your request has been made`,
        react: AwaitingApprovalEmail({
          requesterUsername: request.requestedBy.username,
          mediaTitle: title,
          mediaType: type,
          reason: reason,
          overseerrUrl: env.OVERSEERR_EMAIL_URL,
          showTooManySeasonsText: reason === "TOO_MANY_SEASONS"
        }),
      });
}