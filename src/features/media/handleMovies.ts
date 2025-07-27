import { findAnimeFolder } from "../profiles/findAnimeFolder";
import { findAnimeProfile } from "../profiles/findAnimeProfile";
import { getRequest } from "../requests/getRequest";
import { putRequest } from "../requests/putRequest";
import { GetRequestResponse } from "../requests/types";
import { updateRequestStatus } from "../requests/updateRequestStatus";
import { findServer } from "../serverData/findServer";
import {
  getProfiles,
  getRootFolders,
  getServerByServerIdAndType,
} from "../serverData/getServer";

export const handleMovieNonAnime = async (request: GetRequestResponse) => {
  try {
    const updateRequest = await updateRequestStatus(request.id, "approve");
    return updateRequest;
  } catch (error) {
    console.error(`Error handling movie non-anime request ${request.id}`, error);
    return null;
  }
};

export const handleMovieAnime = async (request: GetRequestResponse) => {
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
        return true;
      } catch (error) {
        console.error(`Error handling movie anime request ${request.id}`, error);
        return false;
      }
    } else {
      console.log(
        `No profile found or folder found for server ${currentServerId} for a movie request`
      );
      return null;
    }
  } else {
    console.log(`No server found for request ${request.id}`);
    return null;
  }
};
