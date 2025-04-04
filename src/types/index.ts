export interface User {
  id: string;
  name: string;
  email: string;
  national_id: string;
  role: 'admin' | 'guest';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
} 