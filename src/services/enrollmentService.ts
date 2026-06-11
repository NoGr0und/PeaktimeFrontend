import { api } from './api';

export interface InviteCode {
  id: string;
  code: string;
  professorId: string;
  expiresAt: string;
  createdAt: string;
}

export interface EnrollmentResponse {
  id: string;
  professorId: string;
  studentId: string;
  inviteCodeId?: string;
  active: boolean;
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  professorId: string;
  studentId: string;
  active: boolean;
  student: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface ProfessorEnrollment {
  id: string;
  professorId: string;
  studentId: string;
  active: boolean;
  professor: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export const enrollmentService = {
  // Professor methods
  async generateInvite(): Promise<InviteCode> {
    return await api.post<InviteCode>('/enrollment/invite', {});
  },

  async getStudents(): Promise<StudentEnrollment[]> {
    return await api.get<StudentEnrollment[]>('/enrollment/students');
  },

  // Student methods
  async joinProfessor(code: string): Promise<EnrollmentResponse> {
    return await api.post<EnrollmentResponse>('/enrollment/join', { code });
  },

  async getProfessor(): Promise<ProfessorEnrollment | null> {
    try {
      return await api.get<ProfessorEnrollment | null>('/enrollment/professor');
    } catch (e) {
      return null;
    }
  },

  async unenroll(enrollmentId: string): Promise<{ success: boolean }> {
    return await api.delete<{ success: boolean }>(`/enrollment/${enrollmentId}`);
  }
};
