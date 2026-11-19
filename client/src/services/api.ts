import axios from 'axios';
import { IPortfolio, IAdminUser, IDashboardStats, IPagination } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Intercept responses to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/admin/login')) {
      // Session expired or unauthenticated
      // Optionally: window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: IAdminUser; token?: string }> => {
    const res = await api.post('/auth/login', credentials);
    return res.data.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  getMe: async (): Promise<IAdminUser> => {
    const res = await api.get('/auth/me');
    if (!res.data?.data?.user) {
      throw new Error('Authentication check failed - token may be expired or invalid');
    }
    return res.data.data.user;
  },
};

// Admin Portfolio Management API
export const adminApi = {
  getStats: async (): Promise<IDashboardStats> => {
    const res = await api.get('/admin/stats');
    return res.data.data;
  },
  getPortfolios: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ portfolios: IPortfolio[]; pagination: IPagination }> => {
    const res = await api.get('/admin/portfolios', { params });
    return res.data.data;
  },
  getPortfolio: async (id: string): Promise<IPortfolio> => {
    const res = await api.get(`/admin/portfolios/${id}`);
    return res.data.data;
  },
  createPortfolio: async (data: Partial<IPortfolio>): Promise<IPortfolio> => {
    const res = await api.post('/admin/portfolios', data);
    return res.data.data;
  },
  updatePortfolio: async (id: string, data: Partial<IPortfolio>): Promise<IPortfolio> => {
    const res = await api.patch(`/admin/portfolios/${id}`, data);
    return res.data.data;
  },
  deletePortfolio: async (id: string): Promise<void> => {
    await api.delete(`/admin/portfolios/${id}`);
  },
  togglePublish: async (id: string): Promise<IPortfolio> => {
    const res = await api.patch(`/admin/portfolios/${id}/publish`);
    return res.data.data;
  },
  updateStatus: async (id: string, status: 'draft' | 'published' | 'disabled'): Promise<IPortfolio> => {
    const res = await api.patch(`/admin/portfolios/${id}/status`, { status });
    return res.data.data;
  },
  checkSlug: async (slug: string, currentId?: string): Promise<{ available: boolean; normalized: string; reason?: string }> => {
    const res = await api.get('/admin/portfolios/check-slug', {
      params: { slug, currentId },
    });
    return res.data.data;
  },
  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};

// Public API
export const publicApi = {
  getPortfolio: async (slug: string): Promise<{ portfolio: IPortfolio; redirectSlug?: string }> => {
    const res = await api.get(`/public/portfolios/${slug}`);
    return {
      portfolio: res.data.data,
      redirectSlug: res.data.redirectSlug,
    };
  },
  getDirectory: async (params?: {
    search?: string;
    role?: string;
    featured?: boolean;
  }): Promise<IPortfolio[]> => {
    const res = await api.get('/public/portfolios', { params });
    return res.data.data;
  },
  submitInquiry: async (data: {
    portfolioSlug: string;
    senderName: string;
    senderEmail: string;
    subject?: string;
    message: string;
  }): Promise<{ message: string }> => {
    const res = await api.post('/public/contact', data);
    return res.data;
  },
};

export default api;