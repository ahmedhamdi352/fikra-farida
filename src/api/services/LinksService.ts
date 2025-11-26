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

interface UploadLinkFileResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

async function uploadLinkFile(linkpk: string | number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  // Don't set Content-Type header - let the browser set it with the boundary
  return await httpClient.post<UploadLinkFileResponse>(`${ApiURLs.uploadLinkFile}?linkpk=${linkpk}`, formData);
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
  uploadLinkFile: {
    request: uploadLinkFile,
    mutationKey: 'upload-link-file',
  },
};
