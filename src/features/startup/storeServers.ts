import { getRadarrDetails, getRadarrInstances } from "../profiles/radarr"
import { getSonarrDetails, getSonarrInstances } from "../profiles/sonarr"
import { saveServer } from "../serverData/saveServer"


export const storeServers = async () => {
    const radarrInstances = await getRadarrInstances()
    const sonarrInstances = await getSonarrInstances()

    console.log(radarrInstances)

     //Loop through radarr instances and get the profiles
    for(const radarrInstance of radarrInstances) {
        try{
            const serverInfo = await getRadarrDetails(radarrInstance.id)
            console.log(serverInfo)
            await saveServer({type: "radarr", data: serverInfo})
        } catch(error) {
            console.log(`Error storing and getting radarr details from Radarr instance ${radarrInstance.id}`)
        }
    }

    for(const sonarrInstance of sonarrInstances) {
        try{
            const sonarrDetails = await getSonarrDetails(sonarrInstance.id)
            await saveServer({type: "sonarr", data: sonarrDetails})
        } catch(error) {
            console.log(`Error storing and getting sonarr details from Sonarr instance ${sonarrInstance.id}`)
        }
    }

}