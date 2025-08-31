import { overseerrApi } from "@/lib/seerr"
import { OverseerrProfile, OverseerrRootFolder, OverseerrTag    } from "./types"

export interface SonarrInstance {
    id: number
    name: string
    is4k: boolean
    isDefault: boolean
    activeDirectory: string
    activeProfileId: number
    activeAnimeProfileId: number
    activeAnimeDirectory: string
    activeLanguageProfileId: number
    activeAnimeLanguageProfileId: number
    activeTags: number[]
    activeAnimeTags: number[]
}

export const getSonarrInstances = async (): Promise<SonarrInstance[]> => {
    const response = await overseerrApi.get("/service/sonarr")
    return response.data
}
export interface SonarrDetails {
    server: SonarrInstance
    profiles: OverseerrProfile[]
    rootFolders: OverseerrRootFolder[]
    tags: OverseerrTag[]
}


export const getSonarrDetails = async (sonarrId: number): Promise<SonarrDetails> => {
    const response = await overseerrApi.get(`/service/sonarr/${sonarrId}`)
    return response.data
}
