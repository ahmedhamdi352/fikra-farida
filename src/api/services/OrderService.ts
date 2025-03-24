import { ApiURLs, httpClient } from 'api/core';
import { ApplyDiscountParams, OrderPayloadForCreateDto, ResultOrderForReadDto } from 'types';

async function createOrder(payload: OrderPayloadForCreateDto) {
  return await httpClient.post<ResultOrderForReadDto>(`${ApiURLs.order}`, {
    ...payload,
  });
}

async function applyDiscount({ discountCode, totalPrice, isCash, countryCode, domain }: ApplyDiscountParams) {
  const params = new URLSearchParams({
    discountCode,
    TotalPrice: totalPrice.toString(),
    IsCash: isCash.toString(),
    CountryCode: countryCode,
    domain,
  });

  // Use our Next.js API route as a proxy
  return await fetch(`/api/discount?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

export const OrderService = {
  order: {
    request: createOrder,
    mutationKey: 'create-order',
  },
  discount: {
    request: applyDiscount,
    mutationKey: 'apply-discount',
  },
};
