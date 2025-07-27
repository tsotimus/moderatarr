import { getRadarrInstances, getRadarrProfiles } from "../profiles/radarr"
import { getSonarrDetails, getSonarrInstances } from "../profiles/sonarr"

// const saveServer = (server: Server) => {

// }

export const storeServers = async () => {
    const radarrInstances = await getRadarrInstances()
    const sonarrInstances = await getSonarrInstances()

    console.log(radarrInstances)
    console.log(sonarrInstances)

     //Loop through radarr instances and get the profiles
    for(const radarrInstance of radarrInstances) {
        try{
            const serverInfo = await getRadarrProfiles(radarrInstance.id)
            console.log(serverInfo)
        } catch(error) {
            console.log(`Error storing and getting radarr details from Radarr instance ${radarrInstance.id}`)
        }
    }

    for(const sonarrInstance of sonarrInstances) {
        try{
            const sonarrDetails = await getSonarrDetails(sonarrInstance.id)
            console.log(sonarrDetails)

        } catch(error) {
            console.log(`Error storing and getting sonarr details from Sonarr instance ${sonarrInstance.id}`)
        }
    }

}