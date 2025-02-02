import { ApiURLs, httpClient } from 'api/core';
import {
  AuthForReadDTo,
  ResultForReadDTo,
  ForgetPasswordPayloadForCreateDto,
  LoginPayloadForCreateDto,
  RegisterPayloadForCreateDto,
} from 'types';

async function login(payload: LoginPayloadForCreateDto) {
  return await httpClient.post<AuthForReadDTo>(`${ApiURLs.login}`, {
    ...payload,
  });
}

async function forgetPassword(payload: ForgetPasswordPayloadForCreateDto) {
  return await httpClient.post<ResultForReadDTo>(`${ApiURLs.forgetPassword}`, {
    ...payload,
  });
}

async function resetPassword(payload: { newPassword: string; token: string }) {
  return await httpClient.post(
    `${ApiURLs.resetPassword}`,
    {
      newPassword: payload.newPassword,
    },
    {
      headers: payload.token ? { token: payload.token } : undefined,
    }
  );
}

async function register(payload: RegisterPayloadForCreateDto) {
  return await httpClient.post<ResultForReadDTo>(`${ApiURLs.register}`, {
    ...payload,
  });
}

export const AuthService = {
  login: {
    request: login,
    mutationKey: 'login',
  },
  forgetPassword: {
    request: forgetPassword,
    mutationKey: 'forget-password',
  },
  resetPassword: {
    request: resetPassword,
    mutationKey: 'reset-password',
  },
  register: {
    request: register,
    mutationKey: 'register',
  },
};
