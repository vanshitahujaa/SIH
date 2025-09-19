import { User, LoginRequest, RegisterRequest, AuthResponse } from './userApi';

// Mock demo users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@demo.com',
    name: 'Demo User',
    role: 'user',
    preferences: {
      notifications: true,
      favoriteRoutes: [],
      defaultLocation: null,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'admin',
    preferences: {
      notifications: true,
      favoriteRoutes: [],
      defaultLocation: null,
    },
    createdAt: new Date().toISOString(),
  },
];

// Mock authentication service
export const mockAuth = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    if (credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    
    // Generate a mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    return {
      user,
      token,
    };
  },
  
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: 'user',
      preferences: {
        notifications: true,
        favoriteRoutes: [],
        defaultLocation: null,
      },
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    // Generate a mock token
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    return {
      user: newUser,
      token,
    };
  },
  
  fetchProfile: async (): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token');
    }
    
    // Extract user ID from mock token
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
};
