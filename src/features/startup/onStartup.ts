import { validateEnv } from "@/env"
import { getRadarrInstances, getRadarrProfiles } from "@/features/profiles/radarr"
import { getSonarrInstances, getSonarrProfiles } from "@/features/profiles/sonarr"

export const onStartup = async () => {
    validateEnv()

    const radarrInstances = await getRadarrInstances()
    const sonarrInstances = await getSonarrInstances()

    console.log(radarrInstances)
    console.log(sonarrInstances)

    //Loop through radarr instances and get the profiles
    for(const radarrInstance of radarrInstances) {
        const radarrProfiles = await getRadarrProfiles(radarrInstance.id)
        console.log(radarrProfiles)
    }

    //Loop through sonarr instances and get the profiles
    for(const sonarrInstance of sonarrInstances) {
        const sonarrProfiles = await getSonarrProfiles(sonarrInstance.id)
        console.log(sonarrProfiles)
    }

    //Store these profiles into SQLite DB
}