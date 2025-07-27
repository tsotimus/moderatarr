import { db } from "@/lib/db"
import { Server, serversTable } from "@/lib/db/schema/servers"
import { and, eq } from "drizzle-orm"

export const getServerByServerIdAndType = async (serverId: number, serverType: "radarr" | "sonarr"): Promise<Server | null> => {
    const server = await db.select().from(serversTable).where(and(eq(serversTable.serverId, serverId), eq(serversTable.serverType, serverType))).limit(1)
    return server[0] ?? null
}   


export const getRootFolders = (server: Server) => {
    return server.rootFolders
}

export const getProfiles = (server: Server) => {
    return server.profiles
}

export const getTags = (server: Server) => {
    return server.tags
}