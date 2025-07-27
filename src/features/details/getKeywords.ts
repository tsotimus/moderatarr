import { tmdbApi } from "@/lib/tmdb"

type Keyword = {
    id: number
    name: string
}

type Keywords = {
    id: number
    keywords: Keyword[]
}

export const getMovieKeywords = async (tmdbId: number) => {
    const response = await tmdbApi.get<Keywords>(`/movie/${tmdbId}/keywords`)
    return response.data
}

type TVKeywordsResponse = {
    id: number
    results: Keyword[]
}

export const getTvKeywords = async (tmdbId: number) => {
    const response = await tmdbApi.get<TVKeywordsResponse>(`/tv/${tmdbId}/keywords`)
    return response.data
}