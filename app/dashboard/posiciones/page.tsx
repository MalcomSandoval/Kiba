'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '@/lib/database';
import type { Posicion } from '@/lib/supabase';
import { Plus, Target, CreditCard as Edit } from 'lucide-react';
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

export default function PosicionesPage() {
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosicion, setEditingPosicion] = useState<Posicion | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    loadPosiciones();
  }, []);

  const loadPosiciones = async () => {
    try {
      const data = await DatabaseService.getPosiciones();
      setPosiciones(data);
    } catch (error) {
      console.error('Error loading posiciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setEditingPosicion(null);
  };

  const handleEdit = (posicion: Posicion) => {
    setEditingPosicion(posicion);
    setFormData({
      nombre: posicion.nombre,
      descripcion: posicion.descripcion
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPosicion) {
        // Update functionality would go here
        console.log('Update posicion:', editingPosicion.id, formData);
      } else {
        await DatabaseService.createPosicion(formData);
      }
      
      await loadPosiciones();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving posicion:', error);
    }
  };

  const getPosicionColor = (nombre: string) => {
    const colors = {
      'Armador': 'bg-blue-500',
      'Opuesto': 'bg-red-500',
      'Central': 'bg-green-500',
      'Líbero': 'bg-yellow-500',
      'Receptor-Atacante': 'bg-purple-500'
    };
    return colors[nombre as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Posiciones</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando posiciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posiciones</h1>
          <p className="text-gray-600 mt-2">Gestiona las posiciones técnicas del voleibol</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Posición
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPosicion ? 'Editar Posición' : 'Nueva Posición'}
              </DialogTitle>
              <DialogDescription>
                {editingPosicion ? 'Modifica los datos de la posición.' : 'Completa la información de la nueva posición.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="ej: Armador"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción de la posición"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editingPosicion ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posiciones.map((posicion) => (
          <Card key={posicion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full ${getPosicionColor(posicion.nombre)} flex items-center justify-center`}>
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{posicion.nombre}</CardTitle>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Activa
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{posicion.descripcion}</p>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(posicion)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {posiciones.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay posiciones
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando las posiciones técnicas de voleibol para asignar a tus jugadores.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Posición
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}