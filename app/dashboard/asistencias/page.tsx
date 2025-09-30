'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '@/lib/database';
import type { Asistencia, Jugador } from '@/lib/supabase';
import { Plus, Search, Calendar, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    jugador_id: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'presente',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [asistenciasData, jugadoresData] = await Promise.all([
        DatabaseService.getAsistencias(),
        DatabaseService.getJugadores()
      ]);
      
      setAsistencias(asistenciasData);
      setJugadores(jugadoresData.filter(j => j.estado === 'activo'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      jugador_id: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'presente',
      observaciones: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await DatabaseService.createAsistencia(formData);
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving asistencia:', error);
    }
  };

  const markAttendance = async (jugadorId: string, fecha: string, estado: string) => {
    try {
      await DatabaseService.createAsistencia({
        jugador_id: jugadorId,
        fecha,
        estado,
        observaciones: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const filteredAsistencias = asistencias.filter(asistencia =>
    asistencia.jugador?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asistencia.fecha.includes(searchTerm)
  );

  const getEstadoBadge = (estado: string) => {
    const variants = {
      presente: 'bg-green-100 text-green-800',
      ausente: 'bg-red-100 text-red-800',
      justificado: 'bg-yellow-100 text-yellow-800'
    };
    return variants[estado as keyof typeof variants] || variants.presente;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Asistencias</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando asistencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asistencias</h1>
          <p className="text-gray-600 mt-2">Control de asistencia de los entrenamientos</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Asistencia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Asistencia</DialogTitle>
                <DialogDescription>
                  Marca la asistencia de un jugador para una fecha específica.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jugador_id">Jugador</Label>
                  <Select value={formData.jugador_id} onValueChange={(value) => setFormData({...formData, jugador_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar jugador" />
                    </SelectTrigger>
                    <SelectContent>
                      {jugadores.map(jugador => (
                        <SelectItem key={jugador.id} value={jugador.id}>
                          {jugador.nombre_completo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presente">Presente</SelectItem>
                      <SelectItem value="ausente">Ausente</SelectItem>
                      <SelectItem value="justificado">Justificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                  <Input
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    placeholder="Notas adicionales..."
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Registrar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              // Quick attendance for all active players as present
              jugadores.forEach(jugador => {
                markAttendance(jugador.id, today, 'presente');
              });
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Marcar Todos Presentes
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar asistencias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAsistencias.map((asistencia) => (
          <Card key={asistencia.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{asistencia.jugador?.nombre_completo || 'N/A'}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {new Date(asistencia.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getEstadoBadge(asistencia.estado)}>
                  {asistencia.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium capitalize">{asistencia.estado}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{asistencia.jugador?.categoria?.nombre || 'N/A'}</span>
                </div>
                {asistencia.observaciones && (
                  <div className="text-sm">
                    <span className="text-gray-600">Observaciones:</span>
                    <p className="font-medium mt-1">{asistencia.observaciones}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  onClick={() => markAttendance(asistencia.jugador_id, asistencia.fecha, 'presente')}
                  disabled={asistencia.estado === 'presente'}
                >
                  Presente
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  onClick={() => markAttendance(asistencia.jugador_id, asistencia.fecha, 'ausente')}
                  disabled={asistencia.estado === 'ausente'}
                >
                  Ausente
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Today's Attendance */}
      <Card className="bg-gradient-to-r from-purple-600 to-black text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Asistencia de Hoy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jugadores.slice(0, 8).map(jugador => (
              <div key={jugador.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <span className="text-sm font-medium truncate">{jugador.nombre_completo}</span>
                <div className="flex space-x-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-green-400 hover:bg-green-500/20"
                    onClick={() => markAttendance(jugador.id, new Date().toISOString().split('T')[0], 'presente')}
                  >
                    ✓
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/20"
                    onClick={() => markAttendance(jugador.id, new Date().toISOString().split('T')[0], 'ausente')}
                  >
                    ✗
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredAsistencias.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay registros de asistencia
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No se encontraron registros con ese término de búsqueda.' : 'Comienza registrando la asistencia de los entrenamientos.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Asistencia
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}