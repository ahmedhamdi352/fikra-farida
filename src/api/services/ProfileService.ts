import { ApiURLs, httpClient } from 'api/core';
import { ProfileForReadDTO } from 'types';

async function getProfile() {
  return await httpClient.post<ProfileForReadDTO>(`${ApiURLs.myProfile}`);
}

export const ProfileService = {
  getProfile: {
    request: getProfile,
    mutationKey: 'get-profile',
  },
};
