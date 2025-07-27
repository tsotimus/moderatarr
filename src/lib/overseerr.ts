import axios from 'axios';
import { env } from '@/env';
import { z } from 'zod';

// Generic axios instance for Overseerr API with API Key Authentication
export const overseerrApi = axios.create({
  baseURL: env.OVERSEERR_BASE_URL + "/api/v1",
  headers: {
    'X-Api-Key': env.OVERSEERR_API_TOKEN,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Optional: Add request/response interceptors for logging or error handling
overseerrApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Overseerr API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const OverseerrWebhookPayloadSchema = z.object({
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

export type OverseerrWebhookPayload = z.infer<typeof OverseerrWebhookPayloadSchema>
