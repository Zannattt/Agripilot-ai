export interface User {
  id: string;
  name: string;
  email: string;
  region?: string;
  primaryCrop?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends Credentials {
  name: string;
  region?: string;
}
