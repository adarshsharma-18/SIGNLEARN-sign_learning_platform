import { User } from '../types';

const STORAGE_KEYS = {
  USER: 'sign_language_user',
  AUTH: 'sign_language_auth',
  REGISTERED_USERS: 'sign_language_registered_users'
};

export const storage = {
  setUser: (user: User) => {
    if (!user) {
      storage.clearUser();
      return;
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): User | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      storage.clearUser();
      return null;
    }
  },
  
  setAuth: (token: string | null) => {
    if (!token) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return;
    }
    localStorage.setItem(STORAGE_KEYS.AUTH, token);
  },
  
  getAuth: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH);
  },

  addRegisteredUser: (user: User) => {
    if (!user.email) return;
    const users = storage.getRegisteredUsers();
    if (!users.some(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    }
  },

  getRegisteredUsers: (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error parsing registered users:', error);
      return [];
    }
  },

  findRegisteredUser: (email: string): User | undefined => {
    if (!email) return undefined;
    const users = storage.getRegisteredUsers();
    return users.find(u => u.email === email);
  },
  
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  clearAll: () => {
    storage.clearUser();
    // Don't clear registered users on logout as they represent the local database
  },
};