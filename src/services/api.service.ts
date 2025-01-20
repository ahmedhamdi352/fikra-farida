import axiosInstance from '../config/axios.config';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { AxiosError } from 'axios';
import { errorService } from '../services/error.service';

// Request payload types
export interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async request<T>(method: string, url: string, data?: unknown): Promise<T> {
    try {
      const response = await axiosInstance({
        method,
        url,
        ...(method === 'GET' ? { params: data } : { data }),
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        errorService.handleError(error);
        throw error;
      }
      throw error;
    }
  }

  // Generic GET request
  public async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('GET', url, params);
  }

  // Generic POST request
  public async post<T, D = unknown>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('POST', url, data);
  }

  // Generic PUT request
  public async put<T, D = unknown>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('PUT', url, data);
  }

  // Generic DELETE request
  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>('DELETE', url);
  }

  // Generic paginated GET request
  public async getPaginated<T>(
    url: string,
    page: number,
    limit: number,
    params?: RequestParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<T>>(url, {
        params: {
          ...params,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        errorService.handleError(error);
        throw error;
      }
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  email: string;
  password: string;
  name: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteData {
  name: string;
  code: string;
  domain: string;
  currency: string;
  siteLogo: string;
  siteName: string;
  contactLocation: string;
  contactEmail: string;
  contactPhone: string;
  contactFacebook: string;
  contactWhatsapp: string;
  contactTiktok: string;
  contactInstagram: string;
  contactX: string | null;
  contactSnapchat: string | null;
  connectUser1: string | null;
  connectUser2: string | null;
  reviewMedia1: string | null;
  reviewMedia2: string | null;
  reviewMedia3: string | null;
  reviewMedia4: string | null;
  reviewMedia5: string | null;
  updateDate: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<{ token: string }, LoginCredentials>('/auth/login', credentials),
  register: (userData: UserData) => apiService.post<{ userId: string }, UserData>('/auth/register', userData),
  refreshToken: (token: string) => apiService.post<{ token: string }, { token: string }>('/auth/refresh', { token }),
};

export const userApi = {
  getProfile: () => apiService.get<UserProfile>('/user/profile'),
  updateProfile: (userData: Partial<UserProfile>) =>
    apiService.put<UserProfile, Partial<UserProfile>>('/user/profile', userData),
};

export const siteApi = {
  getSiteData: (countryCode: string, domain: string) =>
    apiService.get<SiteData>(`/api/Store/SiteData`, { CountryCode: countryCode, domain }),
};
