import { db } from "@/lib/db"
import { getRadarrDetails, getRadarrInstances, RadarrDetails } from "../profiles/radarr"
import { getSonarrDetails, getSonarrInstances, SonarrDetails } from "../profiles/sonarr"
import { serversTable } from "@/lib/db/schema/servers"

const saveServer = async (server: RadarrDetails | SonarrDetails, serverType: "radarr" | "sonarr") => {
    try {
        const baseServerData = {
            serverId: server.server.id,
            name: server.server.name,
            serverType: serverType,
            is4k: server.server.is4k,
            isDefault: server.server.isDefault,
            activeDirectory: server.server.activeDirectory,
            activeProfileId: server.server.activeProfileId,
            activeTags: server.server.activeTags,
            profiles: server.profiles,
            rootFolders: server.rootFolders,
            tags: server.tags,
        }

        // Add Sonarr-specific fields if this is a Sonarr server
        const serverData = serverType === "sonarr" 
            ? {
                ...baseServerData,
                activeAnimeProfileId: (server as SonarrDetails).server.activeAnimeProfileId,
                activeAnimeDirectory: (server as SonarrDetails).server.activeAnimeDirectory,
                activeLanguageProfileId: (server as SonarrDetails).server.activeLanguageProfileId,
                activeAnimeLanguageProfileId: (server as SonarrDetails).server.activeAnimeLanguageProfileId,
                activeAnimeTags: (server as SonarrDetails).server.activeAnimeTags,
            }
            : baseServerData

        await db.insert(serversTable).values(serverData)
        console.log(`Successfully stored ${serverType} server ${server.server.id}`)
    } catch(error) {
        console.error(`Error storing server ${serverType} ${server.server.id}`, error)
    }
}

export const storeServers = async () => {
    const radarrInstances = await getRadarrInstances()
    const sonarrInstances = await getSonarrInstances()

     //Loop through radarr instances and get the profiles
    for(const radarrInstance of radarrInstances) {
        try{
            const serverInfo = await getRadarrDetails(radarrInstance.id)
            console.log(serverInfo)
            await saveServer(serverInfo, "radarr")
        } catch(error) {
            console.log(`Error storing and getting radarr details from Radarr instance ${radarrInstance.id}`)
        }
    }

    for(const sonarrInstance of sonarrInstances) {
        try{
            const sonarrDetails = await getSonarrDetails(sonarrInstance.id)
            console.log(sonarrDetails)
            await saveServer(sonarrDetails, "sonarr")
        } catch(error) {
            console.log(`Error storing and getting sonarr details from Sonarr instance ${sonarrInstance.id}`)
        }
    }

}