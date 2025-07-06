export interface LoginPayloadForCreateDto {
  email: string;
  password: string;
}

export interface ForgetPasswordPayloadForCreateDto {
  email: string;
  redirectUrl: string;
}

export interface RegisterPayloadForCreateDto {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  productId?: string;
  key?: string;
}
