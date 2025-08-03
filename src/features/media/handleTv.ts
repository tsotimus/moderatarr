import { GeneralWebhookPayload } from "@/lib/overseerr/schema";
import { GetRequestResponse } from "../requests/types";
import { env } from "@/env";
import { getTvDetails } from "../details/getDetails";
import { updateRequestStatus } from "../requests/updateRequestStatus";
import { findServer } from "../serverData/findServer";
import { getProfiles, getRootFolders, getServerByServerIdAndType } from "../serverData/getServer";
import { findAnimeProfile } from "../profiles/findAnimeProfile";
import { findAnimeFolder } from "../profiles/findAnimeFolder";
import { putRequest } from "../requests/putRequest";
import { customLogger } from "../logging/customLogger";

type ReturnType = {
    success: true,
} | {
    success: false,
    reason: "REQUESTED_LARGE_SEASON"| "TOO_MANY_SEASONS" | "NO_SERVER_FOUND" | "NO_PROFILE_FOUND" | "NO_FOLDER_FOUND" | "ERROR_UPDATING_REQUEST" | "NO_SEASONS_FOUND"
}

const getHowManySeasons = (payload: GeneralWebhookPayload): {requestedSeasons: string[], totalRequestedSeasons: number} | null => {
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
                customLogger.error(`Error parsing requested seasons ${requestedSeasons.value}`, { error, requestedSeasonsValue: requestedSeasons.value });
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



export const handleTVAnime = async (request: GetRequestResponse, payload: GeneralWebhookPayload): Promise<ReturnType> => {
    const requestedSeasons = getHowManySeasons(payload)
    customLogger.debug("Processing TV anime request", { payload, requestId: request.id });
    if(!requestedSeasons) {
        return {
            success: false,
            reason: "NO_SEASONS_FOUND"
        }
    }
    const {requestedSeasons: requestedSeasonsArray, totalRequestedSeasons} = requestedSeasons

    if(totalRequestedSeasons > env.MAX_ANIME_SEASONS) {
        //TODO: Still run anime logic, but don't approve the request.
        return {
            success: false,
            reason: "TOO_MANY_SEASONS"
        }
    } else {
        const isLarge = await isLargeSeason(payload.media!.tmdbId, requestedSeasonsArray)
        //TODO: Still run anime logic, but don't approve the request.
        if(isLarge) {
            return {
                success: false,
                reason: "REQUESTED_LARGE_SEASON"
            }
        } else {

            let currentServerId = request.serverId;

                if(!currentServerId) {
                    const server = await findServer({mediaType: "tv", is4k: request.is4k, isAnime: true});
                    currentServerId = server.serverId;
                }

            const server = await getServerByServerIdAndType(currentServerId, "sonarr");
            if (server) {
                const profiles = getProfiles(server);
                const animeProfile = findAnimeProfile(profiles);
                const rootFolders = getRootFolders(server);
                const animeFolder = findAnimeFolder(rootFolders);
                if (animeProfile && animeFolder) {  
                  try {
                    await putRequest(request.id, {
                      mediaType: "tv",
                      serverId: currentServerId,
                      profileId: animeProfile.id,
                      rootFolder: animeFolder.path,
                      seasons: requestedSeasonsArray.map(season => parseInt(season))
                    });
                    await updateRequestStatus(request.id, "approve")
                    return {
                        success: true
                    }
                  } catch (error) {
                    customLogger.error(`Error handling tv anime request ${request.id}`, { error, requestId: request.id });
                    return {
                        success: false,
                        reason: "ERROR_UPDATING_REQUEST"
                    }
                  }
                } else {
                  customLogger.warn(
                    `No profile found or folder found for server ${currentServerId} for a tv request`,
                    { serverId: currentServerId, requestId: request.id }
                  );
                  return {
                    success: false,
                    reason: "NO_PROFILE_FOUND"
                  }
                }
              } else {
                customLogger.warn(`No server found for request ${request.id}`, { requestId: request.id });
                return {
                    success: false,
                    reason: "NO_SERVER_FOUND"
                }
              }
        }
    }
};

export const handleTVNonAnime = async (request: GetRequestResponse, payload: GeneralWebhookPayload): Promise<ReturnType> => {
    const requestedSeasons = getHowManySeasons(payload)

    if(!requestedSeasons){
        return {
            success: false,
            reason: "NO_SEASONS_FOUND"
        }
    }

    const {requestedSeasons: requestedSeasonsArray, totalRequestedSeasons} = requestedSeasons

    if(totalRequestedSeasons > env.MAX_NON_ANIME_SEASONS) {
        return {
            success: false,
            reason: "TOO_MANY_SEASONS"
        }
    } else {
        const isLarge = await isLargeSeason(payload.media!.tmdbId, requestedSeasonsArray)
        if(isLarge) {
            return {
                success: false,
                reason: "REQUESTED_LARGE_SEASON"
            }
        } else {
            await updateRequestStatus(request.id, "approve")
            return {
                success: true
            }
        }
    }
};