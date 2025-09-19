import axiosClient from './axiosClient';
import { mockAuth } from './mockAuth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  favoriteRoutes: string[];
  defaultLocation: {
    latitude: number;
    longitude: number;
    name: string;
  } | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const userApi = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      return await axiosClient.post('/auth/login', credentials).then(res => res.data);
    } catch (error: any) {
      // If network error or backend not available, use mock authentication
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error') || 
          error.message?.includes('ERR_NETWORK') || error.response === undefined) {
        console.log('Backend not available, using mock authentication');
        return await mockAuth.login(credentials);
      }
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      return await axiosClient.post('/auth/register', userData).then(res => res.data);
    } catch (error: any) {
      // If network error or backend not available, use mock authentication
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error') || 
          error.message?.includes('ERR_NETWORK') || error.response === undefined) {
        console.log('Backend not available, using mock authentication');
        return await mockAuth.register(userData);
      }
      throw error;
    }
  },

  logout: (): Promise<void> =>
    axiosClient.post('/auth/logout'),

  // Profile management
  fetchProfile: async (): Promise<User> => {
    try {
      return await axiosClient.get('/user/profile').then(res => res.data);
    } catch (error: any) {
      // If network error or backend not available, use mock authentication
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error') || 
          error.message?.includes('ERR_NETWORK') || error.response === undefined) {
        console.log('Backend not available, using mock authentication');
        return await mockAuth.fetchProfile();
      }
      throw error;
    }
  },

  updateProfile: (userData: Partial<User>): Promise<User> =>
    axiosClient.put('/user/profile', userData).then(res => res.data),

  updatePreferences: (preferences: UserPreferences): Promise<UserPreferences> =>
    axiosClient.put('/user/preferences', preferences).then(res => res.data),
};