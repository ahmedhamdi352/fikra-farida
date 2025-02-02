import { AxiosInstance } from 'api';

import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpClient = {
  get<T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>;
  delete<T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const httpClient: HttpClient = {
  get: async function <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>) {
    return await AxiosInstance.get<T>(url, config).then(responseBody);
  },
  post: async function <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return await AxiosInstance.post<T>(url, data, config).then(responseBody);
  },
  put: async function <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return await AxiosInstance.put<T>(url, data, config).then(responseBody);
  },
  delete: async function <T, D = unknown>(url: string, config?: AxiosRequestConfig<D>) {
    return await AxiosInstance.delete<T>(url, config).then(responseBody);
  },
  patch: async function <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return await AxiosInstance.patch<T>(url, data, config).then(responseBody);
  },
};

export default httpClient;
