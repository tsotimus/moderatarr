import { overseerrApi } from "@/lib/overseerr"

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

export interface SonarrProfile {
    id: number
    name: string
}

export const getSonarrProfiles = async (sonarrId: number): Promise<SonarrProfile[]> => {
    const response = await overseerrApi.get(`/settings/sonarr/${sonarrId}/profiles`)
    return response.data
}