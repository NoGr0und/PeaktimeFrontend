export interface InviteCode {
  id: string;
  code: string;
  professorId: string;
  expiresAt: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  professorId: string;
  studentId: string;
  active: boolean;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  professor?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface JoinRequest {
  code: string;
}
