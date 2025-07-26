import { overseerrApi } from "@/lib/overseerr"
import { Profile } from "./types"

export interface SonarrInstance {
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
    activeLanguageProfileId: number
    activeAnimeProfileId: number
    activeAnimeLanguageProfileId: number
    activeAnimeProfileName: string
    activeAnimeDirectory: string
    is4k: boolean
    enableSeasonFolders: boolean
    isDefault: boolean
    externalUrl: string
    syncEnabled: boolean
    preventSearch: boolean
}

export const getSonarrInstances = async (): Promise<SonarrInstance[]> => {
    const response = await overseerrApi.get("/settings/sonarr")
    return response.data
}
export interface SonarrDetails {
    server: SonarrInstance
    profiles: Profile[]
}


export const getSonarrDetails = async (sonarrId: number): Promise<SonarrDetails> => {
    const response = await overseerrApi.get(`/settings/sonarr/${sonarrId}`)
    return response.data
}
