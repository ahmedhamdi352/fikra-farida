/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiURLs, httpClient } from 'api/core';
import { ConnectionFilters } from 'hooks/profile';
import {
  ProfileForReadDTO,
  ProfileAnalyticsForReadDTO,
  ProfileQrCodeDTO,
  GroupForCreateDTO,
  ProfileForCreateDTO,
  GroupResponseDTO,
  ConnectionForCreateDTO,
  ExportFileDTO,
} from 'types';

async function getProfile() {
  return await httpClient.get<ProfileForReadDTO>(`${ApiURLs.myProfile}`);
}

async function getQRCode(userpk: number) {
  return await httpClient.post<ProfileQrCodeDTO>(`${ApiURLs.QrCode}?userpk=${userpk}`);
}

async function getConnections(filters?: ConnectionFilters) {
  const params = new URLSearchParams();

  // Only add parameters if they have actual values
  if (filters?.dateFrom) {
    params.append('from', filters.dateFrom);
  }

  if (filters?.dateTo) {
    params.append('to', filters.dateTo);
  }

  const queryString = params.toString();
  const url = `${ApiURLs.connections}${queryString ? `?${queryString}` : ''}`;

  return await httpClient.post<ConnectionForCreateDTO[]>(url);
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

async function updateLockStatus(data: { isLocked: boolean }) {
  return await httpClient.post<{
    success?: boolean;
    sucess?: boolean;
    errorcode: number;
    message: string;
  }>(`${ApiURLs.lockStatus}`, data);
}

async function updateCollectInfo(data: { autoconnect: boolean }) {
  return await httpClient.post<{
    success?: boolean;
    sucess?: boolean;
    errorcode: number;
    message: string;
  }>(`${ApiURLs.collectInfo}`, data);
}

async function updateDirectLink(data: { directurl: string }) {
  return await httpClient.post<{
    success?: boolean;
    sucess?: boolean;
    errorcode: number;
    message: string;
  }>(`${ApiURLs.directLink}`, data);
}

async function getOfflineQrCode(userpk: number) {
  return await httpClient.post<ProfileQrCodeDTO>(`${ApiURLs.OfflineQrCode}?userpk=${userpk}`);
}

async function getProfileByKey(key: string) {
  return await httpClient.get<ProfileForReadDTO>(`${ApiURLs.myProfileByKey}?key=${key}`);
}

async function linkQrCode(params: { key: string; productId: string }) {
  return await httpClient.post<{
    success?: boolean;
    sucess?: boolean;
    errorcode: number;
    message: string;
  }>(`${ApiURLs.linkQrCode}?key=${params.key}&productId=${params.productId}`);
}

async function getProfiles() {
  return await httpClient.get<ProfileForReadDTO[]>(`${ApiURLs.myProfiles}`);
}

async function addProfile(profile: ProfileForCreateDTO) {
  return await httpClient.post<{
    success?: boolean;
    sucess?: boolean;
    errorcode: number;
    message: string;
  }>(`${ApiURLs.createProfile}`, profile);
}

async function getAnalytics(payload: { StartDate: string; EndDate: string }) {
  return await httpClient.post<ProfileAnalyticsForReadDTO>(`${ApiURLs.analytics}`, payload);
}

async function addConnection(payload: ConnectionForCreateDTO) {
  return await httpClient.post<any>(`${ApiURLs.addConnection}`, payload);
}

async function updateProfile(payload: any) {
  return await httpClient.post<any>(`${ApiURLs.updateProfile}`, payload);
}

async function updateBulkLinksSort(payload: { pk: number; sort: number }[]) {
  return await httpClient.post<any>(`${ApiURLs.updateBulkLinksSort}`, payload);
}

async function deleteConnection(payload: { ConnectionId: number }) {
  return await httpClient.post<{ success?: boolean; sucess?: boolean; errorcode: number; message: string }>(
    `${ApiURLs.deleteConnection}?connectionpk=${payload.ConnectionId}`
  );
}

async function exportContactsFile() {
  return await httpClient.post<ExportFileDTO>(`${ApiURLs.exportContactsFile}`);
}

async function addContactToGroup(payload: { groupId: number; connectionId: number }) {
  return await httpClient.post<any>(
    `${ApiURLs.addContactToGroup}?groupId=${payload.groupId}&connectionPk=${payload.connectionId}`
  );
}

async function uploadProfileImage(payload: FormData) {
  return await httpClient.post<any>(`${ApiURLs.uploadProfileImage}`, payload);
}

async function uploadCoverImage(payload: FormData) {
  return await httpClient.post<any>(`${ApiURLs.uploadCoverImage}`, payload);
}

async function updateUserVisits(payload: { userpk: number, action: number }) {
  return await httpClient.post<any>(`${ApiURLs.updateUserVisits}?userpk=${payload.userpk}&action=${payload.action}`);
}

async function updateEmail(payload: { email: string }) {
  return await httpClient.post<any>(`${ApiURLs.updateEmail}`, payload);
}

async function getGroupMembers(groupId: number) {
  return await httpClient.get<ConnectionForCreateDTO[]>(`${ApiURLs.groups}/${groupId}/connections`);
}

export const ProfileService = {
  getGroupMembers: {
    request: getGroupMembers,
    mutationKey: 'get-group-members',
  },
  getProfile: {
    request: getProfile,
    queryKey: 'get-profile',
  },
  updateProfile: {
    request: updateProfile,
    mutationKey: 'update-profile',
  },
  updateEmail: {
    request: updateEmail,
    mutationKey: 'update-email',
  },
  addProfile: {
    request: addProfile,
    mutationKey: 'add-profile',
  },
  getAnalytics: {
    request: getAnalytics,
    mutationKey: 'get-analytics',
  },
  addConnection: {
    request: addConnection,
    mutationKey: 'add-connection',
  },
  getProfileByKey: {
    request: getProfileByKey,
    mutationKey: 'get-profile-by-key',
  },
  getQRCode: {
    request: getQRCode,
    mutationKey: 'get-qr-code',
  },
  updateLockStatus: {
    request: updateLockStatus,
    mutationKey: 'update-lock-status',
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
  updateCollectInfo: {
    request: updateCollectInfo,
    mutationKey: 'update-collect-info',
  },
  updateDirectLink: {
    request: updateDirectLink,
    mutationKey: 'update-direct-link',
  },
  linkQrCode: {
    request: linkQrCode,
    mutationKey: 'link-qr-code',
  },
  getOfflineQrCode: {
    request: getOfflineQrCode,
    mutationKey: 'get-offline-qr-code',
  },
  getProfiles: {
    request: getProfiles,
    queryKey: 'get-profiles',
  },
  updateBulkLinksSort: {
    request: updateBulkLinksSort,
    mutationKey: 'update-bulk-links-sort',
  },
  deleteConnection: {
    request: deleteConnection,
    mutationKey: 'delete-connection',
  },
  exportContactsFile: {
    request: exportContactsFile,
    mutationKey: 'export-contacts-file',
  },
  addContactToGroup: {
    request: addContactToGroup,
    mutationKey: 'add-contact-to-group',
  },
  uploadProfileImage: {
    request: uploadProfileImage,
    mutationKey: 'upload-profile-image',
  },
  uploadCoverImage: {
    request: uploadCoverImage,
    mutationKey: 'upload-cover-image',
  },
  updateUserVisits: {
    request: updateUserVisits,
    mutationKey: 'update-user-visits',
  },
};
