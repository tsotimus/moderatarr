import { Profile } from "./types"

export const findAnimeProfile = (profiles: Profile[]) => {
    const animeProfile = profiles.find(profile => profile.name.toLowerCase().includes("anime"))
    return animeProfile
}