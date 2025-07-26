import { overseerrApi } from "@/lib/overseerr"
import { Profile } from "./types"


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
    const response = await overseerrApi.get("/settings/radarr")
    return response.data
}


export const getRadarrProfiles = async (radarrId: number): Promise<Profile[]> => {
    const response = await overseerrApi.get(`/settings/radarr/${radarrId}/profiles`)
    return response.data
}