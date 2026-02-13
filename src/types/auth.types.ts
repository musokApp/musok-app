export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'customer' | 'shaman' | 'admin';
  avatarUrl: string | null;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: 'customer' | 'shaman';
}

export interface AuthResponse {
  user: User;
  token: string;
}
