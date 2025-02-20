import { ApiURLs, httpClient } from 'api/core';
import { GetAllCategoriesResponse } from 'types';

async function getCategories() {
  return await httpClient.post<GetAllCategoriesResponse>(`${ApiURLs.catergories}`);
}

export const CategoriesService = {
  getCategories: {
    request: getCategories,
    mutationKey: 'get-categories',
  },
};
