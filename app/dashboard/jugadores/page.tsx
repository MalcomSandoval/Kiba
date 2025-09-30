'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '@/lib/database';
import type { Jugador, Categoria, Posicion } from '@/lib/supabase';
import { Plus, Search, CreditCard as Edit, Trash2, User } from 'lucide-react';
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

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJugador, setEditingJugador] = useState<Jugador | null>(null);

  const [formData, setFormData] = useState({
    nombre_completo: '',
    sexo: '',
    fecha_nacimiento: '',
    edad: 0,
    telefono: '',
    email: '',
    direccion: '',
    categoria_id: '',
    posicion_id: '',
    estado: 'activo'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jugadoresData, categoriasData, posicionesData] = await Promise.all([
        DatabaseService.getJugadores(),
        DatabaseService.getCategorias(),
        DatabaseService.getPosiciones()
      ]);
      
      setJugadores(jugadoresData);
      setCategorias(categoriasData);
      setPosiciones(posicionesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJugadores = jugadores.filter(jugador =>
    jugador.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jugador.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      nombre_completo: '',
      sexo: '',
      fecha_nacimiento: '',
      edad: 0,
      telefono: '',
      email: '',
      direccion: '',
      categoria_id: '',
      posicion_id: '',
      estado: 'activo'
    });
    setEditingJugador(null);
  };

  const handleEdit = (jugador: Jugador) => {
    setEditingJugador(jugador);
    setFormData({
      nombre_completo: jugador.nombre_completo,
      sexo: jugador.sexo,
      fecha_nacimiento: jugador.fecha_nacimiento.split('T')[0],
      edad: jugador.edad,
      telefono: jugador.telefono,
      email: jugador.email,
      direccion: jugador.direccion,
      categoria_id: jugador.categoria_id,
      posicion_id: jugador.posicion_id,
      estado: jugador.estado
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJugador) {
        await DatabaseService.updateJugador(editingJugador.id, formData);
      } else {
        await DatabaseService.createJugador(formData);
      }
      
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving jugador:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
      try {
        await DatabaseService.deleteJugador(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting jugador:', error);
      }
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      suspendido: 'bg-red-100 text-red-800'
    };
    return variants[estado as keyof typeof variants] || variants.activo;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Jugadores</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando jugadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jugadores</h1>
          <p className="text-gray-600 mt-2">Gestiona los jugadores del club KIBA</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Jugador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingJugador ? 'Editar Jugador' : 'Nuevo Jugador'}
              </DialogTitle>
              <DialogDescription>
                {editingJugador ? 'Modifica los datos del jugador.' : 'Completa la información del nuevo jugador.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre Completo</Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select value={formData.sexo} onValueChange={(value) => setFormData({...formData, sexo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => {
                      const fecha = e.target.value;
                      const edad = new Date().getFullYear() - new Date(fecha).getFullYear();
                      setFormData({...formData, fecha_nacimiento: fecha, edad});
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoría</Label>
                  <Select value={formData.categoria_id} onValueChange={(value) => setFormData({...formData, categoria_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="posicion_id">Posición</Label>
                  <Select value={formData.posicion_id} onValueChange={(value) => setFormData({...formData, posicion_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {posiciones.map(posicion => (
                        <SelectItem key={posicion.id} value={posicion.id}>
                          {posicion.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingJugador ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar jugadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJugadores.map((jugador) => (
          <Card key={jugador.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{jugador.nombre_completo}</CardTitle>
                    <p className="text-sm text-gray-600">{jugador.edad} años</p>
                  </div>
                </div>
                <Badge className={getEstadoBadge(jugador.estado)}>
                  {jugador.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{jugador.categoria?.nombre || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Posición:</span>
                  <span className="font-medium">{jugador.posicion?.nombre || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sexo:</span>
                  <span className="font-medium">{jugador.sexo}</span>
                </div>
                {jugador.telefono && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium">{jugador.telefono}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(jugador)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(jugador.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredJugadores.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay jugadores
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No se encontraron jugadores con ese término de búsqueda.' : 'Comienza agregando tu primer jugador al club.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Jugador
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}