import { OverseerrWebhookPayload } from "@/lib/overseerr";
import { GetRequestResponse } from "../requests/types";

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

export const handleTVAnime = async (request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    console.log(payload)
    const requestedSeasons = getHowManySeasons(payload)
    console.log("requestedSeasons", requestedSeasons)
  return true;
};

export const handleTVNonAnime = async (request: GetRequestResponse, payload: OverseerrWebhookPayload) => {
    //Check how many seasons are in the request and how many there are in total
    console.log(payload)
    const requestedSeasons = getHowManySeasons(payload)
    console.log("requestedSeasons", requestedSeasons)
  return true;
};