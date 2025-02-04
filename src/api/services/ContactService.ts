import { ApiURLs, httpClient } from 'api/core';
import { ContactPayloadForCreateDto, ResultForReadDTo } from 'types';

async function contact(payload: ContactPayloadForCreateDto) {
  return await httpClient.post<ResultForReadDTo>(`${ApiURLs.contact}`, {
    ...payload,
  });
}

export const ContactService = {
  contact: {
    request: contact,
    mutationKey: 'contact',
  },
};
