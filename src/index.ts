import { Hono } from "hono";
import { match } from "ts-pattern";
import { detectAnime } from "@/features/anime/detectAnime";
import { isNewUser } from "@/features/email/isNewUser";
import { addContact } from "@/features/email/addContact";
import { getMediaType } from "@/features/media/getMediaType";
import { OverseerrWebhookPayloadSchema } from "@/lib/overseerr";
import { onStartup } from "./features/startup/onStartup";
import {
  handleMovieAnime,
  handleMovieNonAnime,
} from "./features/media/handleMovies";
import { getRequest } from "./features/requests/getRequest";
import { handleAdminAlert } from "./features/email/handleManualAlert";
import { handleTVAnime, handleTVNonAnime } from "./features/media/handleTv";
import { awaitingApprovalAlert } from "./features/email/awaitingApprovalAlert";

onStartup();

const app = new Hono();

app.get("/", (c) => {
  return c.text("AniFlowarr - Automated Anime Movie Management Server");
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Main webhook endpoint for Overseerr
app.post("/webhook/overseerr", async (c) => {
  try {
    const rawPayload = await c.req.json();

    // Always log the notification type first for testing purposes
    console.log(
      `📥 Received notification type: ${rawPayload.notification_type || "UNKNOWN"}`
    );

    // Log the complete payload for debugging
    console.log(
      "🔍 Complete webhook payload:",
      JSON.stringify(rawPayload, null, 2)
    );

    // Validate payload with Zod
    const parseResult = OverseerrWebhookPayloadSchema.safeParse(rawPayload);

    if (!parseResult.success) {
      console.error("Invalid payload structure:", parseResult.error.issues);
      return c.json(
        {
          status: "error",
          message: "Invalid payload structure",
          errors: parseResult.error.issues,
        },
        400
      );
    }

    const payload = parseResult.data;

    const isNew = await isNewUser(payload.request!.requestedBy_email);
    if (isNew) {
      await addContact(payload.request!.requestedBy_email);
    }

    const result = await match(payload)
      .with(
        {
          notification_type: "MEDIA_PENDING",
        },
        async (payload) => {
          const tmdbId = payload.media!.tmdbId;

          const mediaType = getMediaType(payload.media!.media_type);

          const isAnime = await detectAnime(tmdbId, mediaType);

          const requestId = payload.request!.request_id;

          const mediaProcessingResult = await match({ mediaType, isAnime })
            .with({ mediaType: "movie", isAnime: false }, async () => {
              const request = await getRequest(requestId);
              const updateRequest = await handleMovieNonAnime(request);
              if (updateRequest.success) {
                return c.json({
                  status: "success",
                  message: "Movie non-anime request processed",
                  requestId: requestId,
                });
              } else {
                await awaitingApprovalAlert(payload.request!, payload.subject, "Movie", updateRequest.reason);
                await handleAdminAlert(payload.request!, payload.subject, "Movie", updateRequest.reason);
                return c.json({
                  status: "error",
                  message: "Movie non-anime request failed",
                  requestId: requestId,
                });
              }
            })
            .with({ mediaType: "movie", isAnime: true }, async () => {
              const request = await getRequest(requestId);
              const updateRequest = await handleMovieAnime(request);
              if (updateRequest.success) {
                return c.json({
                  status: "success",
                  message: "Movie anime request processed",
                  requestId: requestId,
                });
              } else {
                await awaitingApprovalAlert(payload.request!, payload.subject, "Movie", updateRequest.reason);
                await handleAdminAlert(payload.request!, payload.subject, "Movie", updateRequest.reason);
                return c.json({
                  status: "error",
                  message: "Movie anime request failed",
                  requestId: requestId,
                });
              }
            })
            .with({ mediaType: "tv", isAnime: false }, async () => {
              const request = await getRequest(requestId);
              const updateRequest = await handleTVNonAnime(request, payload);
              if (updateRequest.success) {
                return c.json({
                  status: "success",
                  message: "TV non-anime request processed",
                  requestId: requestId,
                });
              } else {
                await awaitingApprovalAlert(payload.request!, payload.subject, "TV Show", updateRequest.reason);
                await handleAdminAlert(payload.request!, payload.subject, "TV Show", updateRequest.reason);
                return c.json({
                  status: "error",
                  message: "TV non-anime request failed", 
                  requestId: requestId,
                });
              }
            })
            .with({ mediaType: "tv", isAnime: true }, async () => {
              const request = await getRequest(requestId);
              const updateRequest = await handleTVAnime(request, payload);
              if (updateRequest.success) {
                return c.json({
                  status: "success",
                  message: "TV anime request processed",
                  requestId: requestId,
                });
              } else {
                await awaitingApprovalAlert(payload.request!, payload.subject, "TV Show", updateRequest.reason);
                await handleAdminAlert(payload.request!, payload.subject, "TV Show", updateRequest.reason);
                return c.json({
                  status: "error",
                  message: "TV anime request failed",
                  requestId: requestId,
                });
              }
            })
            .exhaustive();

          return mediaProcessingResult;
        }
      )
      .with({ notification_type: "TEST_NOTIFICATION" }, async () => {
        return c.json({
          status: "acknowledged",
          message: "Test notification received",
          notification_type: payload.notification_type,
        });
      })
      .otherwise(async () => {
        return c.json({
          status: "acknowledged",
          message: "Webhook received but not processed (not a movie request)",
          notification_type: payload.notification_type,
          media_type: payload.media?.media_type,
        });
      });

    return result;
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to process webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default app;
