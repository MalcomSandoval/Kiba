import { supabase } from './supabase';
import type { Usuario } from './supabase';

// Simple authentication without encryption
export class AuthService {
  private static instance: AuthService;
  private currentUser: Usuario | null = null;

  private constructor() {
    // Load user from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kiba_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: Usuario; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      this.currentUser = data;
      localStorage.setItem('kiba_user', JSON.stringify(data));
      
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  }

  async register(nombre: string, email: string, password: string, rol: string = 'user'): Promise<{ success: boolean; user?: Usuario; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, email, password, rol }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('kiba_user');
  }

  getCurrentUser(): Usuario | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.rol === 'admin';
  }
}

export const authService = AuthService.getInstance();