import { overseerrApi } from "@/lib/overseerr";
import { UpdateRequestStatusResponse } from './types';

export const updateRequestStatus = async (requestId: number, status: "approved" | "rejected"): Promise<UpdateRequestStatusResponse> => {
    const response = await overseerrApi.patch(`/request/${requestId}/status`, {
        status: status
    })
    return response.data
}