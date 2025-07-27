import { overseerrApi } from "@/lib/overseerr";
import { UpdateRequestStatusResponse } from './types';

export const updateRequestStatus = async (requestId: number, status: "approve" | "decline"): Promise<UpdateRequestStatusResponse> => {
    const response = await overseerrApi.post(`/request/${requestId}/status`, {
        status: status
    })
    return response.data
}