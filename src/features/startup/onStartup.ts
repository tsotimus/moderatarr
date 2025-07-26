import { validateEnv } from "@/env"
import { getRadarrInstances, getRadarrProfiles } from "@/features/profiles/radarr"
import { getSonarrDetails, getSonarrInstances } from "@/features/profiles/sonarr"
import { findAnimeProfile } from "../profiles/findAnimeProfile"

export const onStartup = async () => {
    validateEnv()

    const radarrInstances = await getRadarrInstances()
    const sonarrInstances = await getSonarrInstances()

    console.log(radarrInstances)
    console.log(sonarrInstances)

    //Loop through radarr instances and get the profiles
    for(const radarrInstance of radarrInstances) {
        const radarrProfiles = await getRadarrProfiles(radarrInstance.id)
        const animeProfile = findAnimeProfile(radarrProfiles)
        console.log(animeProfile)
    }

    //Loop through sonarr instances and get the profiles
    for(const sonarrInstance of sonarrInstances) {
        const sonarrDetails = await getSonarrDetails(sonarrInstance.id)
        console.log(sonarrDetails)
        const animeProfile = findAnimeProfile(sonarrDetails.profiles)
        console.log(animeProfile)
    }




    //Store these profiles into SQLite DB

    //We need to store every anime profile we get in relation to the serverId it belongs to
}