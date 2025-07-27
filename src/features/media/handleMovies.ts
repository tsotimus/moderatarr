import { findAnimeFolder } from "../profiles/findAnimeFolder";
import { findAnimeProfile } from "../profiles/findAnimeProfile";
import { getRequest } from "../requests/getRequest";
import { putRequest } from "../requests/putRequest";
import { updateRequestStatus } from "../requests/updateRequestStatus";
import {
  getProfiles,
  getRootFolders,
  getServerByServerIdAndType,
} from "../serverData/getServer";

export const handleMovieNonAnime = async (requestId: number) => {
  try {
    const updateRequest = await updateRequestStatus(requestId, "approved");
    return updateRequest;
  } catch (error) {
    console.error(`Error handling movie non-anime request ${requestId}`, error);
    return null;
  }
};

export const handleMovieAnime = async (requestId: number) => {
  const currentRequest = await getRequest(requestId);
  const currentServerId = currentRequest.serverId;

  const server = await getServerByServerIdAndType(currentServerId, "radarr");
  if (server) {
    const profiles = getProfiles(server);
    const animeProfile = findAnimeProfile(profiles);
    const rootFolders = getRootFolders(server);
    const animeFolder = findAnimeFolder(rootFolders);
    if (animeProfile && animeFolder) {
      try {
        await putRequest(requestId, {
          mediaType: "movie",
          serverId: currentServerId,
          profileId: animeProfile.id,
          rootFolder: animeFolder.path,
        });
        return true;
      } catch (error) {
        console.error(`Error handling movie anime request ${requestId}`, error);
        return false;
      }
    } else {
      console.log(
        `No profile found for server ${currentServerId} for a movie request`
      );
      return null;
    }
  } else {
    console.log(`No server found for request ${requestId}`);
    return null;
  }
};
