import { findAnimeFolder } from "../profiles/findAnimeFolder";
import { findAnimeProfile } from "../profiles/findAnimeProfile";
import { putRequest } from "../requests/putRequest";
import { GetRequestResponse } from "../requests/types";
import { updateRequestStatus } from "../requests/updateRequestStatus";
import { findServer } from "../serverData/findServer";
import {
  getProfiles,
  getRootFolders,
  getServerByServerIdAndType,
} from "../serverData/getServer";
import { customLogger } from "../logging/customLogger";

type ReturnType = {
  success: true,
} | {
  success: false,
  reason: "ERROR_APPROVING_REQUEST" | "ERROR_UPDATING_REQUEST" | "NO_PROFILE_FOUND" | "NO_SERVER_FOUND"
}

export const handleMovieNonAnime = async (request: GetRequestResponse): Promise<ReturnType> => {
  try {
    await updateRequestStatus(request.id, "approve");
    return {
      success: true
    };
  } catch (error) {
    customLogger.error(`Error handling movie non-anime request ${request.id}`, { error, requestId: request.id });
    return {
      success: false,
      reason: "ERROR_APPROVING_REQUEST"
    }
  }
};

export const handleMovieAnime = async (request: GetRequestResponse): Promise<ReturnType> => {
  let currentServerId = request.serverId;

  if(!currentServerId) {
    const server = await findServer({mediaType: "movie", is4k: request.is4k, isAnime: true});
    currentServerId = server.serverId;
  }

  const server = await getServerByServerIdAndType(currentServerId, "radarr");
  if (server) {
    const profiles = getProfiles(server);
    const animeProfile = findAnimeProfile(profiles);
    const rootFolders = getRootFolders(server);
    const animeFolder = findAnimeFolder(rootFolders);
    if (animeProfile && animeFolder) {  
      try {
        await putRequest(request.id, {
          mediaType: "movie",
          serverId: currentServerId,
          profileId: animeProfile.id,
          rootFolder: animeFolder.path,
        });
        await updateRequestStatus(request.id, "approve");
        return {
          success: true
        };
      } catch (error) {
        customLogger.error(`Error handling movie anime request ${request.id}`, { error, requestId: request.id });
        return {
          success: false,
          reason: "ERROR_UPDATING_REQUEST"
        }
      }
    } else {
      customLogger.warn(
        `No profile found or folder found for server ${currentServerId} for a movie request`,
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
};
