import { OverseerrWebhookPayload } from "@/lib/overseerr";
import { GetRequestResponse } from "../requests/types";
import { env } from "@/env";
import { getTvDetails } from "../details/getDetails";
import { handleManualAlert } from "../email/handleManualAlert";
import { updateRequestStatus } from "../requests/updateRequestStatus";

const getHowManySeasons = (payload: OverseerrWebhookPayload): {requestedSeasons: string[], totalRequestedSeasons: number} | null => {
    const extras = payload.extra
    if(extras) {
        const requestedSeasons = extras.find(extra => extra.name === "Requested Seasons")
        if(requestedSeasons){
            try {
                const requestedSeasonsArray = requestedSeasons.value.split(",")
                return {
                    requestedSeasons: requestedSeasonsArray,
                    totalRequestedSeasons: requestedSeasonsArray.length
                }
            } catch (error) {
                console.error(`Error parsing requested seasons ${requestedSeasons.value}`, error)
                return null
            }
        }
    }
    return null
}

const isLargeSeason = async (tmdbId: number, requestedSeasons: string[]) => {
    const EPISODE_THRESHOLD = 30

    const tvDetails = await getTvDetails(tmdbId)
    const requestedSeasonsData= tvDetails.seasons.filter(season => requestedSeasons.includes(season.season_number.toString()))
    const totalEpisodes = requestedSeasonsData.reduce((acc, season) => acc + season.episode_count, 0)

    return totalEpisodes > EPISODE_THRESHOLD
}

const handleManualReq = async(request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    await handleManualAlert(request, payload.subject, "TV Show")
    return false
}

export const handleTVAnime = async (request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    const requestedSeasons = getHowManySeasons(payload)

    if(!requestedSeasons) {
        return handleManualReq(request, payload)
    }
    const {requestedSeasons: requestedSeasonsArray, totalRequestedSeasons} = requestedSeasons

    if(totalRequestedSeasons > env.MAX_ANIME_SEASONS) {
        return handleManualReq(request, payload)
    } else {
        const isLarge = await isLargeSeason(payload.media!.tmdbId, requestedSeasonsArray)
        if(isLarge) {
            console.log("Large anime request")
            return handleManualReq(request, payload)
        } else {
            //Auto approve
            return true
        }
    }
};

export const handleTVNonAnime = async (request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    const requestedSeasons = getHowManySeasons(payload)

    if(!requestedSeasons){
        return handleManualReq(request, payload)
    }

    const {requestedSeasons: requestedSeasonsArray, totalRequestedSeasons} = requestedSeasons

    if(totalRequestedSeasons > env.MAX_NON_ANIME_SEASONS) {
        return handleManualReq(request, payload)
    } else {
        const isLarge = await isLargeSeason(payload.media!.tmdbId, requestedSeasonsArray)
        if(isLarge) {
            console.log("Large non-anime request")
            return handleManualReq(request, payload)
        } else {
            await updateRequestStatus(request.id, "approved")
            return true
        }
    }
};