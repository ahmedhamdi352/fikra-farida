export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
