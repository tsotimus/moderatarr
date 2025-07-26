import { overseerrApi } from '@/lib/overseerr';

export const getRequest = async (requestId: number) => {
    const response = await overseerrApi.get(`/api/v1/request/${requestId}`);
    return response.data;
};