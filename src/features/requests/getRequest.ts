import { overseerrApi } from '@/lib/overseerr';
import { GetRequestResponse } from './types';

export const getRequest = async (requestId: number): Promise<GetRequestResponse> => {
    const response = await overseerrApi.get(`/request/${requestId}`);
    return response.data;
};