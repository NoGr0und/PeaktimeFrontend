export type UserRole = 'PROFESSOR' | 'ALUNO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  birthDate: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  user: User;
  session: Session | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}
