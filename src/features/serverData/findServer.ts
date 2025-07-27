import { db } from "@/lib/db";
import { serversTable } from "@/lib/db/schema/servers";
import { eq } from "drizzle-orm";
import { match } from "ts-pattern";

interface FindServerProps {
    mediaType: "movie" | "tv"
    is4k: boolean
    isAnime: boolean
}

export const findServer = async ({mediaType, is4k, isAnime}: FindServerProps) => {
    const serverType = match(mediaType)
        .with("movie", () => "radarr")
        .with("tv", () => "sonarr")
        .exhaustive();
    
    const servers = await db.select().from(serversTable).where(eq(serversTable.serverType, serverType));

    const numberOfServers = servers.length;

    if(numberOfServers === 0) {
        throw new Error("No server found");
    }

    if(numberOfServers === 1) {
        return servers[0];
    }

    if(numberOfServers > 1) {
        // If there's more than 1 server, prioritize based on the request type
        
        // If this is an anime request, look for an anime server
        if(isAnime) {
            const animeServer = servers.find(server => server.name.toLowerCase().includes("anime"));
            if(animeServer) {
                return animeServer;
            }
        }

        // If this is a 4k request, look for a 4k server
        if(is4k) {
            const bigServer = servers.find(server => server.is4k);
            if(bigServer) {
                return bigServer;
            }
        }

        // Look for the default server
        const defaultServer = servers.find(server => server.isDefault);
        if(defaultServer) {
            return defaultServer;
        }

        // Fallback to first server if no default server found
        return servers[0];
    }

    return servers[0];
}