import { overseerrApi } from "@/lib/overseerr"
import { OverseerrProfile } from "./types"


export interface RadarrInstance {
    id: number
    name: string
    hostname: string
    port: number
    apiKey: string
    useSsl: boolean
    baseUrl: string
    activeProfileId: number
    activeProfileName: string
    activeDirectory: string
    is4k: boolean
    minimumAvailability: string
    isDefault: boolean
    externalUrl: string
    syncEnabled: boolean
    preventSearch: boolean
}

export const getRadarrInstances = async (): Promise<RadarrInstance[]> => {
    const response = await overseerrApi.get("/service/radarr")
    return response.data
}


export const getRadarrProfiles = async (radarrId: number): Promise<OverseerrProfile[]> => {
    const response = await overseerrApi.get(`/service/radarr/${radarrId}`)
    return response.data
}