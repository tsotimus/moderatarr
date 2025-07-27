import { env } from "@/env";
import { resend } from "@/lib/resend";
import { AwaitingApprovalEmail } from "@/emails/awaiting-approval";
import { OverseerrWebhookPayload } from "@/lib/overseerr";

export const awaitingApprovalAlert = async (requester: NonNullable<OverseerrWebhookPayload["request"]>, title: string, type: "Movie" | "TV Show", reason: string) => {
  if(!requester.requestedBy_email) {
    console.log("No email found for requester, skipping email")
    return;
  }
    await resend.emails.send({
        from: `"Caucasus Cloud" <${env.OVERSEERR_EMAIL}>`,
        to: env.ADMIN_EMAIL,
        subject: `Awaiting approval - Your request has been made`,
        react: AwaitingApprovalEmail({
          requesterUsername: requester.requestedBy_username ?? "",
          mediaTitle: title,
          mediaType: type,
          reason: reason,
          overseerrUrl: env.OVERSEERR_EMAIL_URL,
          showTooManySeasonsText: reason === "TOO_MANY_SEASONS"
        }),
      });
}