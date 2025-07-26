import { Hono } from 'hono'
import { z } from 'zod'
import { match } from 'ts-pattern'
import {detectAnime} from '@/features/anime/detectAnime'
import { validateEnv } from '@/env'
import { isNewUser } from '@/features/email/isNewUser'
import { addContact } from './features/email/addContact'
import { getMediaType } from './features/media/getMediaType'

validateEnv()

const app = new Hono()



const OverseerrWebhookPayloadSchema = z.object({
  notification_type: z.enum([
    "TEST_NOTIFICATION",
    "MEDIA_REQUEST",
    "MEDIA_AUTO_APPROVED",
    "MEDIA_PENDING",
    "MEDIA_APPROVED",
    "MEDIA_DECLINED",
    "MEDIA_AVAILABLE",
    "MEDIA_PROCESSING_FAILED",
    "ISSUE_REPORTED",
    "ISSUE_COMMENT",
    "ISSUE_RESOLVED",
    "ISSUE_REOPENED"
  ]),
  event: z.string(),
  subject: z.string(),
  message: z.string(),
  image: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().optional(),
  media: z.object({
    media_type: z.enum(["movie", "tv"]),
    tmdbId: z.union([z.number(), z.string().transform(Number)]),
    tvdbId: z.union([z.number(), z.string().transform(Number)]).optional(),
    status: z.string(),
    status4k: z.string().optional(),
  }).nullable().optional(),
  request: z.object({
    request_id: z.union([z.number(), z.string().transform(Number)]),
    requestedBy_email: z.string(),
    requestedBy_username: z.string(),
    requestedBy_avatar: z.string(),
  }).nullable().optional(),
  issue: z.object({
    issue_id: z.number(),
    issue_type: z.string(),
    issue_status: z.string(),
    reportedBy_email: z.string(),
    reportedBy_username: z.string(),
    reportedBy_avatar: z.string(),
  }).nullable().optional(),
  comment: z.object({
    comment_message: z.string(),
    commentedBy_email: z.string(),
    commentedBy_username: z.string(),
    commentedBy_avatar: z.string(),
  }).nullable().optional(),
  extra: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
})


app.get('/', (c) => {
  return c.text('AniFlowarr - Automated Anime Movie Management Server')
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Main webhook endpoint for Overseerr
app.post('/webhook/overseerr', async (c) => {
  try {
    const rawPayload = await c.req.json()
    
    // Always log the notification type first for testing purposes
    console.log(`📥 Received notification type: ${rawPayload.notification_type || 'UNKNOWN'}`)
    
    // Log the complete payload for debugging
    console.log('🔍 Complete webhook payload:', JSON.stringify(rawPayload, null, 2))
    
    // Validate payload with Zod
    const parseResult = OverseerrWebhookPayloadSchema.safeParse(rawPayload)
    
    if (!parseResult.success) {
      console.error('Invalid payload structure:', parseResult.error.issues)
      return c.json({ 
        status: 'error', 
        message: 'Invalid payload structure',
        errors: parseResult.error.issues
      }, 400)
    }
    
    const payload = parseResult.data

    const isNew = await isNewUser(payload.request!.requestedBy_email)

    if(isNew) {
      await addContact(payload.request!.requestedBy_email)
    }
    

    // Use ts-pattern for better pattern matching
    const result = await match(payload)
      .with(
        { 
          notification_type: "MEDIA_PENDING", 
        }, 
        async (payload) => {
          const tmdbId = payload.media!.tmdbId
          
          // Log the complete payload for debugging
          console.log('🔍 Complete webhook payload:', JSON.stringify(payload, null, 2))

          
          // - Update Radarr if anime is detected

          const mediaType = getMediaType(payload.media!.media_type)
          
          const isAnime = await detectAnime(tmdbId, mediaType)

          //If its an anime and a movie we update overseerr??

          const requestId = payload.request!.request_id
          

          if(isAnime) {
            console.log(`Media is anime`)
          } else {
            console.log(`Media is not anime`)
          }

          
          return c.json({ 
            status: 'success', 
            message: 'Media request processed',
            tmdbId: tmdbId
          })
        }
      )
      .with(
        { 
          notification_type: "MEDIA_AUTO_APPROVED", 
        }, 
        async (payload) => {
          const tmdbId = payload.media!.tmdbId
          
          
          // TODO: Implement anime detection logic
          // - Query TMDb API for movie details
          // - Check for anime criteria (Animation genre + Japanese production country, etc.)
          // - Update Radarr if anime is detected
          
          const isAnime = await detectAnime(tmdbId, payload.media!.media_type)
          if (isAnime) {
            console.log(`Media is anime`)
          } else {
            console.log(`Media is not anime`)
          }
          
          return c.json({ 
            status: 'success', 
            message: 'Auto-approved media processed',
            tmdbId: tmdbId
          })
        }
      )
      .with({ notification_type: "TEST_NOTIFICATION" }, async () => {
        return c.json({ 
          status: 'acknowledged', 
          message: 'Test notification received',
          notification_type: payload.notification_type
        })
      })
      .otherwise(async () => {
        return c.json({ 
          status: 'acknowledged', 
          message: 'Webhook received but not processed (not a movie request)',
          notification_type: payload.notification_type,
          media_type: payload.media?.media_type
        })
      })
    
    return result

  } catch (error) {
    console.error('Error processing webhook:', error)
    return c.json({ 
      status: 'error', 
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})


export default app
