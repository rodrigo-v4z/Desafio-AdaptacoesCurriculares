import type { User, Student, Adaptation, Report, StudentReport } from '../types';

// A URL da API é injetada durante o processo de build pelo Vite.
// Certifique-se de ter um arquivo .env na raiz do projeto com: VITE_API_URL=https://sua-api.com/
const API_URL = import.meta.env.VITE_API_URL;

// Função auxiliar para tratamento de respostas da API
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    // Se a resposta de erro for JSON, extrai a mensagem.
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || `Erro na API: ${response.status}`);
    }
    // Se for HTML ou outro tipo, lança um erro genérico.
    throw new Error(`Erro no servidor: ${response.status} ${response.statusText}. A resposta não é um JSON válido.`);
  }

  // Garante que a resposta de sucesso seja JSON antes de fazer o parse.
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  throw new Error('A resposta da API não está no formato JSON esperado.');
}

export class ApiClient {
  // Auth
  // A autenticação agora será gerenciada pelo backend.
  // Esta função pode ser usada para buscar os dados do usuário logado a partir de um token.
  async getCurrentUser(): Promise<User> {
    // Supondo que a API tenha um endpoint '/me' ou similar para obter o usuário atual
    // e que o token de autenticação é enviado automaticamente (ex: em um cookie httpOnly)
    // ou que você adicionará um header 'Authorization' aqui.
    // Por enquanto, vamos simular o retorno de um usuário para manter a compatibilidade.
    // TODO: Implementar a lógica real de autenticação (ex: /auth/me)
    const response = await fetch(`${API_URL}auth/me`); // Exemplo de endpoint
    return handleResponse<User>(response);
  }

  // Students
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_URL}students`);
    return handleResponse<Student[]>(response);
  }

  async createStudent(student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_URL}students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return handleResponse<Student>(response);
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_URL}students/${id}`, {
      method: 'PUT', // ou 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Student>(response);
  }

  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(`${API_URL}students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      // O método DELETE pode não retornar um corpo JSON, então tratamos o erro separadamente
      throw new Error('Falha ao deletar estudante.');
    }
  }

  // Adaptations
  async getAdaptations(studentId: string): Promise<Adaptation[]> {
    // Assumindo que a API tem um endpoint para buscar adaptações por estudante
    const response = await fetch(`${API_URL}students/${studentId}/adaptations`);
    return handleResponse<Adaptation[]>(response);
  }

  async createAdaptation(adaptation: Partial<Adaptation>): Promise<Adaptation> {
    // O endpoint pode variar, ex: /adaptations ou /students/:studentId/adaptations
    const response = await fetch(`${API_URL}adaptations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adaptation),
    });
    return handleResponse<Adaptation>(response);
  }

  async updateAdaptation(studentId: string, id: string, updates: Partial<Adaptation>): Promise<Adaptation> {
    const response = await fetch(`${API_URL}adaptations/${id}`, {
      method: 'PUT', // ou 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Adaptation>(response);
  }

  async deleteAdaptation(studentId: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}adaptations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Falha ao deletar adaptação.');
    }
  }

  // Reports
  async getReports(studentId: string): Promise<Report[]> {
    // Assumindo que a API tem um endpoint para buscar relatórios por estudante
    const response = await fetch(`${API_URL}students/${studentId}/reports`);
    return handleResponse<Report[]>(response);
  }

  async createReport(report: Partial<Report>): Promise<Report> {
    const response = await fetch(`${API_URL}reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    return handleResponse<Report>(response);
  }

  async updateReport(studentId: string, id: string, updates: Partial<Report>): Promise<Report> {
    const response = await fetch(`${API_URL}reports/${id}`, {
      method: 'PUT', // ou 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Report>(response);
  }

  async deleteReport(studentId: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Falha ao deletar relato.');
    }
  }

  // Full student report
  async getStudentReport(studentId: string): Promise<StudentReport> {
    // Assumindo que a API tem um endpoint que já consolida essas informações
    const response = await fetch(`${API_URL}reports/student/${studentId}`);
    return handleResponse<StudentReport>(response);
  }
}

export const api = new ApiClient();
