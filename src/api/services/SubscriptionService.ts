import { ApiURLs, httpClient } from 'api/core';
import { subscriptionForCreateDTO, ResultForReadDTo } from 'types';

async function updateSubscription(payload: subscriptionForCreateDTO) {
  return await httpClient.post<ResultForReadDTo>(`${ApiURLs.updateSubscription}`, {
    ...payload,
  });
}

export const SubscriptionService = {
  updateSubscription: {
    request: updateSubscription,
    mutationKey: 'updateSubscription',
  },
};
