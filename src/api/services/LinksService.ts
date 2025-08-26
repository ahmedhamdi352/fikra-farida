import { ApiURLs, httpClient } from 'api/core';

interface LinkPayload {
  iconurl: string;
  pk?: string | number;
  sort: number;
  title: string;
  type: number;
  url: string;
}

interface LinkResponse {
  pk: number;
  title: string;
  url: string;
  iconurl: string;
  type: number;
  sort: number;
}

async function addLink(payload: LinkPayload) {
  return await httpClient.post<LinkResponse>(`${ApiURLs.links}/Add`, payload);
}

async function updateLink(payload: Partial<LinkPayload>) {
  return await httpClient.post<LinkResponse>(`${ApiURLs.links}/Update`, payload);
}

async function deleteLink(pk: string | number) {
  return await httpClient.post(`${ApiURLs.links}/Delete?linkpk=${pk}`);
}

async function updateVisitCount(pk: string | number) {
  return await httpClient.post(`${ApiURLs.visitCount}?linkpk=${pk}`);
}

export const LinksService = {
  addLink: {
    request: addLink,
    mutationKey: 'add-link',
  },
  updateLink: {
    request: updateLink,
    mutationKey: 'update-link',
  },
  deleteLink: {
    request: deleteLink,
    mutationKey: 'delete-link',
  },
  updateVisitCount: {
    request: updateVisitCount,
    mutationKey: 'update-visit-count',
  },
};
