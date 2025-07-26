import { validateEnv } from "@/env"
import { getRadarrInstances, getRadarrProfiles } from "@/features/profiles/radarr"
import { getSonarrDetails, getSonarrInstances } from "@/features/profiles/sonarr"
import { storeAnimeProfile } from "../profiles/storeProfiles"

export const onStartup = async () => {
    validateEnv()

    try{
        const radarrInstances = await getRadarrInstances()
        const sonarrInstances = await getSonarrInstances()

        console.log(radarrInstances)
        console.log(sonarrInstances)

         //Loop through radarr instances and get the profiles
        for(const radarrInstance of radarrInstances) {
            try{
                const radarrProfiles = await getRadarrProfiles(radarrInstance.id)
                if(radarrProfiles) {
                    storeAnimeProfile(radarrProfiles, radarrInstance.id, "radarr")
                }
            } catch(error) {
                console.log(`Error getting radarr details from Radarr instance ${radarrInstance.id}`)
            }
        }

        for(const sonarrInstance of sonarrInstances) {
            try{
                const sonarrDetails = await getSonarrDetails(sonarrInstance.id)
                if(sonarrDetails.profiles) {
                    storeAnimeProfile(sonarrDetails.profiles, sonarrInstance.id, "sonarr")
                }
            } catch(error) {
                console.log(`Error getting sonarr details from Sonarr instance ${sonarrInstance.id}`)
            }
        }

    } catch(error) {
        console.error(error)
    }






    //Store these profiles into SQLite DB

    //We need to store every anime profile we get in relation to the serverId it belongs to
}