import { ApiURLs, httpClient } from 'api/core';
import { OrderPayloadForCreateDto, ResultOrderForReadDto } from 'types';

async function createOrder(payload: OrderPayloadForCreateDto) {
  return await httpClient.post<ResultOrderForReadDto>(`${ApiURLs.order}`, {
    ...payload,
  });
}

export const OrderService = {
  order: {
    request: createOrder,
    mutationKey: 'create-order',
  },
};
