import {
  User,
  Resume,
  JobDescription,
  AnalysisResult,
  AnalysisHistoryItem,
  DailySchedule,
} from '../types';

const API_BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('skillgap_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ success: boolean; token: string; user: User }>(res);
  },

  async register(data: { name: string; email: string; password: string; targetRole?: string; experienceLevel?: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; token: string; user: User }>(res);
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ success: boolean; token: string; user: User }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  async updateProfile(updates: Partial<User>) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  // Resumes
  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<{ success: boolean; resume: Resume }>(res);
  },

  async getResumes() {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; resumes: Resume[] }>(res);
  },

  async getResumeById(id: string) {
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; resume: Resume & { extractedText: string } }>(res);
  },

  async deleteResume(id: string) {
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Job Descriptions
  async createJobDescription(data: { title: string; company: string; text: string }) {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; jobDescription: JobDescription }>(res);
  },

  async getJobDescriptions() {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; jobDescriptions: JobDescription[] }>(res);
  },

  async deleteJobDescription(id: string) {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Gap Analysis
  async runAnalysis(data: { resumeId: string; jobDescriptionId: string; customRoleTitle?: string }) {
    const res = await fetch(`${API_BASE_URL}/analysis/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; analysis: AnalysisResult }>(res);
  },

  async getAnalysisHistory() {
    const res = await fetch(`${API_BASE_URL}/analysis/history`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; history: AnalysisHistoryItem[] }>(res);
  },

  async getAnalysisById(id: string) {
    const res = await fetch(`${API_BASE_URL}/analysis/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; analysis: AnalysisResult }>(res);
  },

  async updateLearningPlanDay(analysisId: string, dayNumber: number, data: { isCompleted?: boolean; notes?: string }) {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}/learning-plan/day/${dayNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; dailySchedules: DailySchedule[] }>(res);
  },

  async deleteAnalysis(id: string) {
    const res = await fetch(`${API_BASE_URL}/analysis/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  getExportUrl(id: string) {
    return `${API_BASE_URL}/analysis/${id}/export`;
  },

  // Skills & Synonyms
  async getSkillsDictionary() {
    const res = await fetch(`${API_BASE_URL}/skills`);
    return handleResponse<{ success: boolean; totalSkills: number; categories: Record<string, any[]> }>(res);
  },

  async checkSynonym(skillA: string, skillB: string) {
    const res = await fetch(`${API_BASE_URL}/skills/check-synonym`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillA, skillB }),
    });
    return handleResponse<{
      success: boolean;
      inputA: string;
      canonicalA: string;
      inputB: string;
      canonicalB: string;
      isEquivalent: boolean;
      explanation: string;
    }>(res);
  },

  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string; service: string; database: any }>(res);
  }
};
