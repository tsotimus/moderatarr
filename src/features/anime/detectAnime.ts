import { getMovieDetails, getTvDetails } from "../details/getDetails"
import { getMovieKeywords, getTvKeywords } from "../details/getKeywords"

export const detectAnime = async (tmdbId: number, mediaType: "movie" | "tv") => {
    
    if (mediaType === "movie") {

        try{    
            const movieKeywords = await getMovieKeywords(tmdbId)
            //Loop through keywords and check if any of them are anime keywords. Use ts-pattern to match the keywords. and use some...
            const isAnime = movieKeywords.keywords.some(keyword => keyword.name === "anime")
            if(isAnime) {
                return true
            } else {
                return await handleMovieDetails(tmdbId)
            }
        } catch (error) {
            console.error(`Error detecting anime for movie ${tmdbId}`, error)
            return await handleMovieDetails(tmdbId)
        }
        
    } else if (mediaType === "tv") {

        try{
            const tvKeywords = await getTvKeywords(tmdbId)
            const isAnime = tvKeywords.keywords.some(keyword => keyword.name === "anime")
            if(isAnime) {
                return true
            } else {
                return await handleTvDetails(tmdbId)
            }
        } catch (error) {
            console.error(`Error detecting anime for tv ${tmdbId}`, error)
            return await handleTvDetails(tmdbId)
        }
    }

    return false
    
}

const handleTvDetails = async (tmdbId: number) => {
    const tvDetails = await getTvDetails(tmdbId)
    const isJapaneseOrChinese = tvDetails.production_countries.some(country => country.iso_3166_1 === "JP" || country.iso_3166_1 === "CN")
    const isAnimation = tvDetails.genres.some(genre => genre.name === "Animation")
    if(isJapaneseOrChinese && isAnimation) {
        return true
    }
    return false
}

const handleMovieDetails = async (tmdbId: number) => {
    const movieDetails = await getMovieDetails(tmdbId)
    const isJapaneseOrChinese = movieDetails.production_countries.some(country => country.iso_3166_1 === "JP" || country.iso_3166_1 === "CN")
    const isAnimation = movieDetails.genres.some(genre => genre.name === "Animation")
    if(isJapaneseOrChinese && isAnimation) {
        return true
    }
    return false
}