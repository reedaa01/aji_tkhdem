import api from './api';
import { Portfolio, Skill, Experience, Project, Job, JobApplication } from '@/types';

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Portfolio ────────────────────────────────────────────────────────────────
export const portfolioService = {
  getMyPortfolio: () => api.get('/portfolio'),
  upsert: (data: Partial<Portfolio>) => api.put('/portfolio', data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.post('/portfolio/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCV: (file: File) => {
    const form = new FormData();
    form.append('cv', file);
    return api.post('/portfolio/cv', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillService = {
  getAll: () => api.get('/skills'),
  create: (data: { name: string; level: string }) => api.post('/skills', data),
  update: (id: number, data: { name: string; level: string }) =>
    api.put(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

// ─── Experience ───────────────────────────────────────────────────────────────
export const experienceService = {
  getAll: () => api.get('/experience'),
  create: (data: Partial<Experience>) => api.post('/experience', data),
  update: (id: number, data: Partial<Experience>) => api.put(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectService = {
  getAll: () => api.get('/projects'),
  create: (data: Partial<Project>) => api.post('/projects', data),
  update: (id: number, data: Partial<Project>) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  uploadImage: (id: number, file: File) => {
    const form = new FormData();
    form.append('image', file);
    return api.post(`/projects/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobService = {
  getJobs: (params?: { search?: string; category?: string; limit?: number }) =>
    api.get('/jobs', { params }),
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const applicationService = {
  getAll: () => api.get('/applications'),
  getStats: () => api.get('/applications/stats'),
  apply: (data: Partial<JobApplication>) => api.post('/applications', data),
  updateStatus: (id: number, status: string, notes?: string) =>
    api.patch(`/applications/${id}`, { status, notes }),
  delete: (id: number) => api.delete(`/applications/${id}`),
};
