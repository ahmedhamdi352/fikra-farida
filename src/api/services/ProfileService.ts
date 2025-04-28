import { ApiURLs, httpClient } from 'api/core';
import { ProfileForReadDTO, ProfileQrCodeDTO } from 'types';

async function getProfile() {
  return await httpClient.post<ProfileForReadDTO>(`${ApiURLs.myProfile}`);
}

async function getQRCode(userpk: number) {
  return await httpClient.post<ProfileQrCodeDTO>(`${ApiURLs.QrCode}?userpk=${userpk}`);
}

export const ProfileService = {
  getProfile: {
    request: getProfile,
    mutationKey: 'get-profile',
  },
  getQRCode: {
    request: getQRCode,
    mutationKey: 'get-qr-code',
  },
};
