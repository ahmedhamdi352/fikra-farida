import { ApiURLs, httpClient } from 'api/core';
import { ProfileForReadDTO, ProfileQrCodeDTO, GroupForCreateDTO, GroupResponseDTO } from 'types';

async function getProfile() {
  return await httpClient.post<ProfileForReadDTO>(`${ApiURLs.myProfile}`);
}

async function getQRCode(userpk: number) {
  return await httpClient.post<ProfileQrCodeDTO>(`${ApiURLs.QrCode}?userpk=${userpk}`);
}

async function getConnections() {
  return await httpClient.post<ProfileQrCodeDTO>(`${ApiURLs.connections}`);
}

async function getGroups() {
  return await httpClient.get<GroupResponseDTO[]>(`${ApiURLs.groups}`);
}

async function addGroup(group: GroupForCreateDTO) {
  return await httpClient.post<GroupResponseDTO>(`${ApiURLs.groups}`, group);
}

async function deleteGroup(groupid: number): Promise<void> {
  await httpClient.delete(`${ApiURLs.groups}/${groupid}`);
}

async function updateGroup(group: { GroupId: number } & Record<string, unknown>) {
  const { GroupId, ...updateData } = group;
  return await httpClient.put<GroupResponseDTO>(`${ApiURLs.groups}/${GroupId}`, updateData);
}

async function getGroupsById(groupId: number) {
  return await httpClient.get<GroupResponseDTO>(`${ApiURLs.groups}/${groupId}`);
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
  getConnections: {
    request: getConnections,
    mutationKey: 'get-connections',
  },
  getGroups: {
    request: getGroups,
    mutationKey: 'get-groups',
  },
  addGroup: {
    request: addGroup,
    mutationKey: 'add-group',
  },
  deleteGroup: {
    request: deleteGroup,
    mutationKey: 'delete-group',
  },
  updateGroup: {
    request: updateGroup,
    mutationKey: 'update-group',
  },
  getGroupsById: {
    request: getGroupsById,
    mutationKey: 'get-groups-by-id',
  },
};
