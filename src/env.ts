import { z } from "zod";

// Simple Zod-only approach
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_AUDIENCE_ID: z.string().min(1),
  TMDB_API_TOKEN: z.string().min(1),
  SEERR_API_TOKEN: z.string().min(1),
  SEERR_BASE_URL: z.string().min(1),
  DB_FILE_NAME: z.string().min(1).optional().default("moderatarr.db"),
  SEERR_EMAIL: z.email(),
  ADMIN_EMAIL: z.email(),
  SEERR_EMAIL_URL: z.url(),
  MAX_NON_ANIME_SEASONS: z.coerce.number().min(1).optional().default(2),
  MAX_ANIME_SEASONS: z.coerce.number().min(1).optional().default(2),
  PORT: z.coerce.number().min(1).optional().default(3000),
  // DEFAULT_TO_LATEST: z.stringbool({truthy: ["true"], falsy: ["false"]}),
});

// Validate and export
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("❌ Invalid environment variables:", parseResult.error.issues);
  process.exit(1);
}

export const env = parseResult.data;


/**
 * Manually validate environment variables
 * @returns Validation result with success/error info
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error("Environment validation failed:", result.error.issues);
    return { success: false, errors: result.error.issues };
  }
  
  console.log("✅ Environment variables are valid");
  return { success: true, data: result.data };
}
