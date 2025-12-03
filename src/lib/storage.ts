import type { User, Student, Adaptation, Report, StudentReport } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'adaptacao_users',
  STUDENTS: 'adaptacao_students',
  ADAPTATIONS: 'adaptacao_adaptations',
  REPORTS: 'adaptacao_reports',
  CURRENT_USER: 'adaptacao_current_user',
};

// Helper functions for localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate UUID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize default users if none exist
export function initializeDefaultUsers(): void {
  const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  
  if (users.length === 0) {
    const defaultUsers: User[] = [
      {
        id: generateId(),
        email: 'coordenador@escola.com',
        name: 'Maria Silva',
        role: 'coordenador',
      },
      {
        id: generateId(),
        email: 'professor@escola.com',
        name: 'João Santos',
        role: 'professor',
      },
    ];
    setToStorage(STORAGE_KEYS.USERS, defaultUsers);
  }
}

// Auth functions
export const authStorage = {
  signIn(email: string, password: string): User | null {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    
    // Simple password validation (in real app, this would be more secure)
    // coordenador@escola.com -> coord123
    // professor@escola.com -> prof123
    const validCredentials = [
      { email: 'coordenador@escola.com', password: 'coord123' },
      { email: 'professor@escola.com', password: 'prof123' },
    ];
    
    const isValid = validCredentials.some(
      cred => cred.email === email && cred.password === password
    );
    
    if (!isValid) {
      return null;
    }
    
    const user = users.find(u => u.email === email);
    if (user) {
      setToStorage(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    }
    
    return null;
  },

  signOut(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
};

// Student functions
export const studentStorage = {
  getAll(): Student[] {
    return getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
  },

  getById(id: string): Student | null {
    const students = this.getAll();
    return students.find(s => s.id === id) || null;
  },

  create(data: Partial<Student>): Student {
    const students = this.getAll();
    const currentUser = authStorage.getCurrentUser();
    
    const newStudent: Student = {
      id: generateId(),
      name: data.name || '',
      course: data.course || '',
      class: data.class || '',
      birthDate: data.birthDate || '',
      registrationNumber: data.registrationNumber || '',
      guardianName: data.guardianName,
      guardianContact: data.guardianContact,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || '',
    };
    
    students.push(newStudent);
    setToStorage(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  },

  update(id: string, updates: Partial<Student>): Student | null {
    const students = this.getAll();
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    const currentUser = authStorage.getCurrentUser();
    students[index] = {
      ...students[index],
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.id,
    };
    
    setToStorage(STORAGE_KEYS.STUDENTS, students);
    return students[index];
  },

  delete(id: string): boolean {
    const students = this.getAll();
    const filtered = students.filter(s => s.id !== id);
    
    if (filtered.length === students.length) return false;
    
    setToStorage(STORAGE_KEYS.STUDENTS, filtered);
    
    // Also delete related adaptations and reports
    adaptationStorage.deleteByStudent(id);
    reportStorage.deleteByStudent(id);
    
    return true;
  },
};

// Adaptation functions
export const adaptationStorage = {
  getAll(): Adaptation[] {
    return getFromStorage<Adaptation[]>(STORAGE_KEYS.ADAPTATIONS, []);
  },

  getByStudent(studentId: string): Adaptation[] {
    const adaptations = this.getAll();
    return adaptations.filter(a => a.studentId === studentId);
  },

  create(data: Partial<Adaptation>): Adaptation {
    const adaptations = this.getAll();
    const currentUser = authStorage.getCurrentUser();
    
    const newAdaptation: Adaptation = {
      id: generateId(),
      studentId: data.studentId || '',
      description: data.description || '',
      justification: data.justification || '',
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || '',
    };
    
    adaptations.push(newAdaptation);
    setToStorage(STORAGE_KEYS.ADAPTATIONS, adaptations);
    return newAdaptation;
  },

  update(id: string, updates: Partial<Adaptation>): Adaptation | null {
    const adaptations = this.getAll();
    const index = adaptations.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    adaptations[index] = {
      ...adaptations[index],
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    
    setToStorage(STORAGE_KEYS.ADAPTATIONS, adaptations);
    return adaptations[index];
  },

  delete(id: string): boolean {
    const adaptations = this.getAll();
    const filtered = adaptations.filter(a => a.id !== id);
    
    if (filtered.length === adaptations.length) return false;
    
    setToStorage(STORAGE_KEYS.ADAPTATIONS, filtered);
    return true;
  },

  deleteByStudent(studentId: string): void {
    const adaptations = this.getAll();
    const filtered = adaptations.filter(a => a.studentId !== studentId);
    setToStorage(STORAGE_KEYS.ADAPTATIONS, filtered);
  },
};

// Report functions
export const reportStorage = {
  getAll(): Report[] {
    return getFromStorage<Report[]>(STORAGE_KEYS.REPORTS, []);
  },

  getByStudent(studentId: string): Report[] {
    const reports = this.getAll();
    return reports.filter(r => r.studentId === studentId);
  },

  create(data: Partial<Report>): Report {
    const reports = this.getAll();
    const currentUser = authStorage.getCurrentUser();
    
    const newReport: Report = {
      id: generateId(),
      studentId: data.studentId || '',
      teacherId: currentUser?.id || '',
      teacherName: currentUser?.name || '',
      subject: data.subject || '',
      date: data.date || new Date().toISOString().split('T')[0],
      result: data.result || 'neutro',
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };
    
    reports.push(newReport);
    setToStorage(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  },

  update(id: string, updates: Partial<Report>): Report | null {
    const reports = this.getAll();
    const index = reports.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    reports[index] = {
      ...reports[index],
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    
    setToStorage(STORAGE_KEYS.REPORTS, reports);
    return reports[index];
  },

  delete(id: string): boolean {
    const reports = this.getAll();
    const filtered = reports.filter(r => r.id !== id);
    
    if (filtered.length === reports.length) return false;
    
    setToStorage(STORAGE_KEYS.REPORTS, filtered);
    return true;
  },

  deleteByStudent(studentId: string): void {
    const reports = this.getAll();
    const filtered = reports.filter(r => r.studentId !== studentId);
    setToStorage(STORAGE_KEYS.REPORTS, filtered);
  },
};

// Get full student report
export function getStudentReport(studentId: string): StudentReport | null {
  const student = studentStorage.getById(studentId);
  if (!student) return null;

  const adaptations = adaptationStorage.getByStudent(studentId);
  const reports = reportStorage.getByStudent(studentId);

  return {
    student,
    adaptations,
    reports,
  };
}
