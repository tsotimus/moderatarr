import { serversTable } from "@/lib/db/schema/servers"
import { RadarrDetails } from "../profiles/radarr"
import { SonarrDetails } from "../profiles/sonarr"
import { db } from "@/lib/db"
import { match } from "ts-pattern"

type ServerInput = 
    | { type: "radarr"; data: RadarrDetails }
    | { type: "sonarr"; data: SonarrDetails }

export const saveServer = async (serverInput: ServerInput) => {
    try {
        const serverData = match(serverInput)
            .with({ type: "radarr" }, ({ data }) => ({
                serverId: data.server.id,
                name: data.server.name,
                serverType: "radarr" as const,
                is4k: data.server.is4k,
                isDefault: data.server.isDefault,
                activeDirectory: data.server.activeDirectory,
                activeProfileId: data.server.activeProfileId,
                activeTags: data.server.activeTags,
                profiles: data.profiles,
                rootFolders: data.rootFolders,
                tags: data.tags,
                // Radarr doesn't have these fields, so they'll be undefined/null
                activeAnimeProfileId: undefined,
                activeAnimeDirectory: undefined,
                activeLanguageProfileId: undefined,
                activeAnimeLanguageProfileId: undefined,
                activeAnimeTags: undefined,
            }))
            .with({ type: "sonarr" }, ({ data }) => ({
                serverId: data.server.id,
                name: data.server.name,
                serverType: "sonarr" as const,
                is4k: data.server.is4k,
                isDefault: data.server.isDefault,
                activeDirectory: data.server.activeDirectory,
                activeProfileId: data.server.activeProfileId,
                activeTags: data.server.activeTags,
                profiles: data.profiles,
                rootFolders: data.rootFolders,
                tags: data.tags,
                // Sonarr-specific fields
                activeAnimeProfileId: data.server.activeAnimeProfileId,
                activeAnimeDirectory: data.server.activeAnimeDirectory,
                activeLanguageProfileId: data.server.activeLanguageProfileId,
                activeAnimeLanguageProfileId: data.server.activeAnimeLanguageProfileId,
                activeAnimeTags: data.server.activeAnimeTags,
            }))
            .exhaustive()

        await db.insert(serversTable).values(serverData)
    } catch(error) {
        console.error(`Error storing server ${serverInput.type} ${serverInput.data.server.id}`, error)
    }
}