export interface User {
  id: number;
  email: string;
  username: string;
  plexToken: string;
  plexUsername: string;
  userType: number;
  permissions: number;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  requestCount: number;
}

export interface Media {
  id: number;
  tmdbId: number;
  tvdbId: number;
  status: number;
  requests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRequest {
  id: number;
  status: number;
  media: Media;
  createdAt: string;
  updatedAt: string;
  requestedBy: User;
  modifiedBy: User;
  is4k: boolean;
  serverId: number;
  profileId: number;
  rootFolder: string;
}

// Specific response types
export interface GetRequestResponse extends BaseRequest {}

export interface PutRequestResponse extends BaseRequest {}

export interface UpdateRequestStatusResponse extends BaseRequest {}

// Request body interfaces
export interface PutRequestBody {
  mediaType: "movie" | "tv";
  seasons?: number[];
  is4k?: boolean;
  serverId?: number;
  profileId?: number;
  rootFolder?: string;
  languageProfileId?: number;
  userId?: number;
}

export interface UpdateRequestStatusBody {
  status: "approved" | "rejected";
} 