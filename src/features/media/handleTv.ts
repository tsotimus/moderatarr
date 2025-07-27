import { OverseerrWebhookPayload } from "@/lib/overseerr";
import { GetRequestResponse } from "../requests/types";
import { env } from "@/env";
import { getTvDetails } from "../details/getDetails";
import { handleManualAlert } from "../email/handleManualAlert";

const getHowManySeasons = (payload: OverseerrWebhookPayload): number | null => {
    const extras = payload.extra
    if(extras) {
        const requestedSeasons = extras.find(extra => extra.name === "Requested Seasons")
        if(requestedSeasons){
            try {
                const requestedSeasonsArray = requestedSeasons.value.split(",")
                return requestedSeasonsArray.length
            } catch (error) {
                console.error(`Error parsing requested seasons ${requestedSeasons.value}`, error)
                return null
            }
        }
    }
    return null
}

const isLargeShow = async (tmdbId: number) => {
    const tvDetails = await getTvDetails(tmdbId)
    console.log(tvDetails)
    // if(tvDetails.seasons.length > env.MAX_ANIME_SEASONS) {
    //     return true
    // }
    return false
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
    if(requestedSeasons > env.MAX_ANIME_SEASONS) {
        return handleManualReq(request, payload)
    } else {
        //Check to see if the show is large (how many episodes in a season)
        const isLarge = await isLargeShow(payload.media!.tmdbId)
        if(isLarge) {
            return handleManualReq(request, payload)
        } else {
            //Auto approve
            return true
        }
    }
};

export const handleTVNonAnime = async (request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    const requestedSeasons = getHowManySeasons(payload)
    if(requestedSeasons && requestedSeasons > env.MAX_NON_ANIME_SEASONS) {
        return false
    } else {
        return true
    }
};