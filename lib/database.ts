import { supabase } from './supabase';
import type { Jugador, Categoria, Posicion, Pago, Asistencia, Usuario } from './supabase';

export class DatabaseService {
  // Jugadores
  static async getJugadores(): Promise<Jugador[]> {
    const { data, error } = await supabase
      .from('jugadores')
      .select(`
        *,
        categoria:categorias(*),
        posicion:posiciones(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createJugador(jugador: Omit<Jugador, 'id' | 'created_at'>): Promise<Jugador> {
    const { data, error } = await supabase
      .from('jugadores')
      .insert([jugador])
      .select(`
        *,
        categoria:categorias(*),
        posicion:posiciones(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateJugador(id: string, jugador: Partial<Jugador>): Promise<Jugador> {
    const { data, error } = await supabase
      .from('jugadores')
      .update(jugador)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias(*),
        posicion:posiciones(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteJugador(id: string): Promise<void> {
    const { error } = await supabase
      .from('jugadores')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Categorías
  static async getCategorias(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('edad_minima');

    if (error) throw error;
    return data || [];
  }

  static async createCategoria(categoria: Omit<Categoria, 'id' | 'created_at'>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .insert([categoria])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Posiciones
  static async getPosiciones(): Promise<Posicion[]> {
    const { data, error } = await supabase
      .from('posiciones')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data || [];
  }

  static async createPosicion(posicion: Omit<Posicion, 'id' | 'created_at'>): Promise<Posicion> {
    const { data, error } = await supabase
      .from('posiciones')
      .insert([posicion])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Pagos
  static async getPagos(): Promise<Pago[]> {
    const { data, error } = await supabase
      .from('pagos')
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createPago(pago: Omit<Pago, 'id' | 'created_at'>): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .insert([pago])
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePago(id: string, pago: Partial<Pago>): Promise<Pago> {
    const { data, error } = await supabase
      .from('pagos')
      .update(pago)
      .eq('id', id)
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Asistencias
  static async getAsistencias(): Promise<Asistencia[]> {
    const { data, error } = await supabase
      .from('asistencias')
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createAsistencia(asistencia: Omit<Asistencia, 'id' | 'created_at'>): Promise<Asistencia> {
    const { data, error } = await supabase
      .from('asistencias')
      .insert([asistencia])
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAsistencia(id: string, asistencia: Partial<Asistencia>): Promise<Asistencia> {
    const { data, error } = await supabase
      .from('asistencias')
      .update(asistencia)
      .eq('id', id)
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Dashboard metrics
  static async getDashboardMetrics() {
    const [jugadores, pagos, asistencias] = await Promise.all([
      this.getJugadores(),
      this.getPagos(),
      this.getAsistencias()
    ]);

    const jugadoresActivos = jugadores.filter(j => j.estado === 'activo').length;
    const pagosPendientes = pagos.filter(p => p.estado === 'pendiente').length;
    
    // Calculate attendance percentage
    const totalAsistencias = asistencias.length;
    const asistenciasPresentes = asistencias.filter(a => a.estado === 'presente').length;
    const porcentajeAsistencia = totalAsistencias > 0 ? (asistenciasPresentes / totalAsistencias) * 100 : 0;

    return {
      jugadoresActivos,
      totalJugadores: jugadores.length,
      pagosPendientes,
      totalPagos: pagos.length,
      porcentajeAsistencia: Math.round(porcentajeAsistencia),
      totalAsistencias
    };
  }
}