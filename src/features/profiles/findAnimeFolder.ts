import { OverseerrRootFolder } from "./types"

export const findAnimeFolder = (rootFolders: OverseerrRootFolder[]) => {
    const animeFolder = rootFolders.find(folder => folder.path.toLowerCase().includes("anime"))
    return animeFolder
}   