export interface OverseerrProfile {
    id: number
    name: string
}

export interface OverseerrRootFolder {
    id: number
    freeSpace: number
    path: string
}

export interface OverseerrTag {
    label: string
    id: number
}