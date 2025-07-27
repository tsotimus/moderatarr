import axios from "axios"
import { env } from "@/env"

interface Collection {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
}

interface Genre {
    id: number
    name: string
}

interface ProductionCompany {
    id: number
    logo_path: string
    name: string
    origin_country: string
}

interface ProductionCountry {
    iso_3166_1: string
    name: string
}

interface SpokenLanguage {
    english_name: string
    iso_639_1: string
    name: string
}

export interface MovieDetails {
    adult: boolean
    backdrop_path: string
    belongs_to_collection: Collection
    budget: number
    genres: Genre[]
    homepage: string
    id: number
    imdb_id: string
    origin_country: string[]
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    release_date: string
    revenue: number
    runtime: number
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

interface Season {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    vote_average: number
}


export interface TvDetails extends MovieDetails {
    seasons: Season[]
}

export const getMovieDetails = async (tmdbId: number) => {
    const response = await axios.get<MovieDetails>(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
        headers: {
            'Authorization': `Bearer ${env.TMDB_API_TOKEN}`
        }
    })

    return response.data
}

export const getTvDetails = async (tmdbId: number) => {
    const response = await axios.get<TvDetails>(`https://api.themoviedb.org/3/tv/${tmdbId}`, {
        headers: {
            'Authorization': `Bearer ${env.TMDB_API_TOKEN}`
        }
    })

    return response.data
}