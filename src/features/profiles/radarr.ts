import { overseerrApi } from "@/lib/seerr"
import { OverseerrProfile, OverseerrRootFolder, OverseerrTag } from "./types"


export interface RadarrInstance {
    id: number
    name: string
    is4k: boolean
    isDefault: boolean
    activeDirectory: string
    activeProfileId: number
    activeTags: number[]
}

export const getRadarrInstances = async (): Promise<RadarrInstance[]> => {
    const response = await overseerrApi.get("/service/radarr")
    return response.data
}

export interface RadarrDetails {
    server: RadarrInstance
    profiles: OverseerrProfile[]
    rootFolders: OverseerrRootFolder[]
    tags: OverseerrTag[]
}

export const getRadarrDetails = async (radarrId: number): Promise<RadarrDetails> => {
    const response = await overseerrApi.get(`/service/radarr/${radarrId}`)
    return response.data
}