import { overseerrApi } from '@/lib/overseerr';
import { PutRequestBody, PutRequestResponse } from './types';

export const putRequest = async (requestId: number, requestBody: PutRequestBody): Promise<PutRequestResponse> => {
    const response = await overseerrApi.put(`/request/${requestId}`, requestBody);
    return response.data;
};

