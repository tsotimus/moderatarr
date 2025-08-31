import { env } from "@/env";
import { resend } from "@/lib/resend";
import { AwaitingApprovalEmail } from "@/emails/awaiting-approval";
import { GeneralWebhookPayload } from "@/lib/overseerr/schema";

export const awaitingApprovalAlert = async (requester: NonNullable<GeneralWebhookPayload["request"]>, title: string, type: "Movie" | "TV Show", reason: string) => {
  if(!requester.requestedBy_email) {
    console.log("No email found for requester, skipping email")
    return;
  }
  
  try {
    await resend.emails.send({
        from: `"Caucasus Cloud" <${env.SEERR_EMAIL}>`,
        to: requester.requestedBy_email,
        subject: `Awaiting approval - Your request has been made`,
        react: AwaitingApprovalEmail({
          requesterUsername: requester.requestedBy_username ?? "",
          mediaTitle: title,
          mediaType: type,
          reason: reason,
          overseerrUrl: env.SEERR_EMAIL_URL,
          showTooManySeasonsText: reason === "TOO_MANY_SEASONS"
        }),
      });
  } catch (error) {
    console.error("Failed to send awaiting approval email:", error);
  }
}