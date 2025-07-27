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

    // Use ts-pattern for better pattern matching
    const result = await match(payload)
      .with(
        {
          notification_type: "MEDIA_PENDING",
        },
        async (payload) => {
          const tmdbId = payload.media!.tmdbId;

          // Log the complete payload for debugging
          console.log(
            "🔍 Complete webhook payload:",
            JSON.stringify(payload, null, 2)
          );

          const mediaType = getMediaType(payload.media!.media_type);

          const isAnime = await detectAnime(tmdbId, mediaType);

          const requestId = payload.request!.request_id;

          if (mediaType === "movie" && !isAnime) {
            const updateRequest = await handleMovieNonAnime(requestId);
            if (updateRequest) {
              return c.json({
                status: "success",
                message: "Movie non-anime request processed",
                requestId: requestId,
              });
            } else {
              return c.json({
                status: "error",
                message: "Movie non-anime request failed",
                requestId: requestId,
              });
            }
          }

          if (mediaType === "movie" && isAnime) {
            const updateRequest = await handleMovieAnime(requestId);
            if (updateRequest) {
              return c.json({
                status: "success",
                message: "Movie anime request processed",
                requestId: requestId,
              });
            } else {
              return c.json({
                status: "error",
                message: "Movie anime request failed",
                requestId: requestId,
              });
            }
          }

          //Only TV now

          // const getRequest = await overseerrApi.get(`/request/${requestId}`)

          if (isAnime) {
            console.log(`Media is anime`);
          } else {
            console.log(`Media is not anime`);
          }

          return c.json({
            status: "success",
            message: "Media request processed",
            tmdbId: tmdbId,
          });
        }
      )
      .with(
        {
          notification_type: "MEDIA_AUTO_APPROVED",
        },
        async (payload) => {
          const tmdbId = payload.media!.tmdbId;

          // TODO: Implement anime detection logic
          // - Query TMDb API for movie details
          // - Check for anime criteria (Animation genre + Japanese production country, etc.)
          // - Update Radarr if anime is detected

          const isAnime = await detectAnime(tmdbId, payload.media!.media_type);
          if (isAnime) {
            console.log(`Media is anime`);
          } else {
            console.log(`Media is not anime`);
          }

          return c.json({
            status: "success",
            message: "Auto-approved media processed",
            tmdbId: tmdbId,
          });
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
