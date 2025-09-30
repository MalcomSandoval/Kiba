import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  // Create a dummy client for development
  const dummyClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
  };
  // @ts-ignore
  export const supabase = dummyClient;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Disable Supabase auth
    },
  });
}

// Database types
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  created_at: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  edad_minima: number;
  edad_maxima: number;
  descripcion: string;
  created_at: string;
}

export interface Posicion {
  id: string;
  nombre: string;
  descripcion: string;
  created_at: string;
}

export interface Jugador {
  id: string;
  nombre_completo: string;
  sexo: string;
  fecha_nacimiento: string;
  edad: number;
  telefono: string;
  email: string;
  direccion: string;
  foto_url: string;
  categoria_id: string;
  posicion_id: string;
  estado: string;
  created_at: string;
  categoria?: Categoria;
  posicion?: Posicion;
}

export interface Pago {
  id: string;
  jugador_id: string;
  monto: number;
  mes: string;
  año: number;
  metodo_pago: string;
  estado: string;
  fecha_pago: string | null;
  recibo_url: string;
  created_at: string;
  jugador?: Jugador;
}

export interface Asistencia {
  id: string;
  jugador_id: string;
  fecha: string;
  estado: string;
  observaciones: string;
  created_at: string;
  jugador?: Jugador;
}