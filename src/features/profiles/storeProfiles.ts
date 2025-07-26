import { db } from "@/lib/db"
import { OverseerrProfile } from "./types"
import { findAnimeProfile } from "./findAnimeProfile"
import { profilesTable } from "@/lib/db/schema/profiles"

export const storeAnimeProfile = (profiles: OverseerrProfile[], serverId: number, serverType: string) => {

    const animeProfiles = findAnimeProfile(profiles)

    if(animeProfiles) {
        db.insert(profilesTable).values({
            profileId: animeProfiles.id,
            name: animeProfiles.name,
            serverId: serverId,
            serverType: serverType
        })
    }
}