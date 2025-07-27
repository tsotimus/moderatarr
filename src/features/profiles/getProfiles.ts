// import { db } from "@/lib/db"
// import { Profile, profilesTable } from "@/lib/db/schema/profiles"
// import { eq, and } from "drizzle-orm"

// export const getProfilesByServerId = async (serverId: number, serverType: string): Promise<Profile | null> => {
//     const profiles = await db.select().from(profilesTable).where(and(eq(profilesTable.serverId, serverId), eq(profilesTable.serverType, serverType))).limit(1)
//     return profiles[0] ?? null
// }

