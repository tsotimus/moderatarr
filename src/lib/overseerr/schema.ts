import z from "zod";

// Reusable schema for notification metadata
export const NotificationMetadataSchema = z.object({
    event: z.string(),
    subject: z.string(),
    message: z.string(),
    image: z.string().optional(),
    email: z.string().optional(),
    username: z.string().optional(),
    avatar: z.string().optional(),
});

// Reusable schema for request objects
export const RequestSchema = z.object({
    request_id: z.union([z.number(), z.string().transform(Number)]),
    requestedBy_email: z.string(),
    requestedBy_username: z.string(),
    requestedBy_avatar: z.string(),
});

// Reusable schema for issue objects
export const IssueSchema = z.object({
    issue_id: z.number(),
    issue_type: z.string(),
    issue_status: z.string(),
    reportedBy_email: z.string(),
    reportedBy_username: z.string(),
    reportedBy_avatar: z.string(),
});

// Reusable schema for media objects
export const MediaSchema = z.object({
    media_type: z.enum(["movie", "tv"]),
    tmdbId: z.union([z.number(), z.string().transform(Number)]),
    tvdbId: z.union([z.number(), z.string().transform(Number)]).optional(),
    status: z.string(),
    status4k: z.string().optional(),
});

// Reusable schema for comment objects
export const CommentSchema = z.object({
    comment_message: z.string(),
    commentedBy_email: z.string(),
    commentedBy_username: z.string(),
    commentedBy_avatar: z.string(),
});

// Reusable schema for extra field objects
export const ExtraFieldSchema = z.object({
    name: z.string(),
    value: z.string(),
});


export const GeneralWebhookPayloadSchema = z.object({
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
    ...NotificationMetadataSchema.shape,
    media: MediaSchema.nullable().optional(),
    request: RequestSchema.nullable().optional(),
    issue: IssueSchema.nullable().optional(),
    comment: CommentSchema.nullable().optional(),
    extra: z.array(ExtraFieldSchema).optional(),
})

export type GeneralWebhookPayload = z.infer<typeof GeneralWebhookPayloadSchema>


export const MediaRequestWebhookPayloadSchema = z.object({
    notification_type: z.literal("MEDIA_REQUEST"),
    ...NotificationMetadataSchema.shape,
    media: MediaSchema,
    request: RequestSchema,
    extra: z.array(ExtraFieldSchema).optional(),
})