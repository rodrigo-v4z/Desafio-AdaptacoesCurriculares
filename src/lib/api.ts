import { 
  authStorage, 
  studentStorage, 
  adaptationStorage, 
  reportStorage,
  getStudentReport as getStudentReportFromStorage 
} from './storage';
import type { User, Student, Adaptation, Report, StudentReport } from '../types';

export class ApiClient {
  // Auth
  async getCurrentUser(): Promise<User> {
    const user = authStorage.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    return user;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    return studentStorage.getAll();
  }

  async createStudent(student: Partial<Student>): Promise<Student> {
    return studentStorage.create(student);
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const updated = studentStorage.update(id, updates);
    if (!updated) {
      throw new Error('Estudante não encontrado');
    }
    return updated;
  }

  async deleteStudent(id: string): Promise<void> {
    const deleted = studentStorage.delete(id);
    if (!deleted) {
      throw new Error('Estudante não encontrado');
    }
  }

  // Adaptations
  async getAdaptations(studentId: string): Promise<Adaptation[]> {
    return adaptationStorage.getByStudent(studentId);
  }

  async createAdaptation(adaptation: Partial<Adaptation>): Promise<Adaptation> {
    return adaptationStorage.create(adaptation);
  }

  async updateAdaptation(studentId: string, id: string, updates: Partial<Adaptation>): Promise<Adaptation> {
    const updated = adaptationStorage.update(id, updates);
    if (!updated) {
      throw new Error('Adaptação não encontrada');
    }
    return updated;
  }

  async deleteAdaptation(studentId: string, id: string): Promise<void> {
    const deleted = adaptationStorage.delete(id);
    if (!deleted) {
      throw new Error('Adaptação não encontrada');
    }
  }

  // Reports
  async getReports(studentId: string): Promise<Report[]> {
    return reportStorage.getByStudent(studentId);
  }

  async createReport(report: Partial<Report>): Promise<Report> {
    return reportStorage.create(report);
  }

  async updateReport(studentId: string, id: string, updates: Partial<Report>): Promise<Report> {
    const updated = reportStorage.update(id, updates);
    if (!updated) {
      throw new Error('Relato não encontrado');
    }
    return updated;
  }

  async deleteReport(studentId: string, id: string): Promise<void> {
    const deleted = reportStorage.delete(id);
    if (!deleted) {
      throw new Error('Relato não encontrado');
    }
  }

  // Full student report
  async getStudentReport(studentId: string): Promise<StudentReport> {
    const report = getStudentReportFromStorage(studentId);
    if (!report) {
      throw new Error('Estudante não encontrado');
    }
    return report;
  }
}

export const api = new ApiClient();
