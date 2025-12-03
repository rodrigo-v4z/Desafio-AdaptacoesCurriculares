export type UserRole = 'coordenador' | 'professor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  course: string;
  class: string;
  birthDate: string;
  registrationNumber: string;
  guardianName?: string;
  guardianContact?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Adaptation {
  id: string;
  studentId: string;
  description: string;
  justification: string;
  date: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

export type ReportResult = 'positivo' | 'neutro' | 'negativo';

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  result: ReportResult;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StudentReport {
  student: Student;
  adaptations: Adaptation[];
  reports: Report[];
}
