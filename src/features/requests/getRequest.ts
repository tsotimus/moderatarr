import { overseerrApi } from '@/lib/seerr';
import { GetRequestResponse } from './types';

export const getRequest = async (requestId: number): Promise<GetRequestResponse> => {
    const response = await overseerrApi.get(`/request/${requestId}`);
    return response.data;
};