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
  phoneNumber1: string;
  email: string;
  password: string;
  confirmPassword: string;
}
