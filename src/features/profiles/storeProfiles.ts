import { db } from "@/lib/db"
import { Profile } from "./types"
import { findAnimeProfile } from "./findAnimeProfile"
import { profilesTable } from "@/lib/db/schema/profiles"

export const storeProfiles = (profiles: Profile[], serverId: number, serverType: string) => {

    const animeProfiles = findAnimeProfile(profiles)

    if(animeProfiles) {
        db.insert(profilesTable).values({
            id: animeProfiles.id,
            name: animeProfiles.name,
            serverId: serverId,
            serverType: serverType
        })
    }
}