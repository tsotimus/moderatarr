import { OverseerrProfile } from "./types"

export const findAnimeProfile = (profiles: OverseerrProfile[]) => {
    const animeProfile = profiles.find(profile => profile.name.toLowerCase().includes("anime"))
    return animeProfile
}