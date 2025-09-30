'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import type { Usuario } from '@/lib/supabase';
import { Plus, UserCog, Shield, User } from 'lucide-react';
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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'user'
  });

  useEffect(() => {
    // For demo purposes, we'll use mock data since we can't directly query users table
    const mockUsuarios: Usuario[] = [
      {
        id: '1',
        nombre: 'Administrador KIBA',
        email: 'admin@kiba.com',
        password: 'admin123',
        rol: 'admin',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Entrenador Principal',
        email: 'entrenador@kiba.com',
        password: 'coach123',
        rol: 'coach',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Asistente',
        email: 'asistente@kiba.com',
        password: 'user123',
        rol: 'user',
        created_at: new Date().toISOString()
      }
    ];
    
    setTimeout(() => {
      setUsuarios(mockUsuarios);
      setIsLoading(false);
    }, 1000);
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'user'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await authService.register(
        formData.nombre,
        formData.email,
        formData.password,
        formData.rol
      );
      
      if (result.success) {
        // Add to local state for demo
        const newUser: Usuario = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setUsuarios([...usuarios, newUser]);
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const getRolBadge = (rol: string) => {
    const variants = {
      admin: 'bg-red-100 text-red-800',
      coach: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return variants[rol as keyof typeof variants] || variants.user;
  };

  const getRolIcon = (rol: string) => {
    const icons = {
      admin: Shield,
      coach: UserCog,
      user: User
    };
    return icons[rol as keyof typeof icons] || User;
  };

  const getRolName = (rol: string) => {
    const names = {
      admin: 'Administrador',
      coach: 'Entrenador',
      user: 'Usuario'
    };
    return names[rol as keyof typeof names] || 'Usuario';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">Gestiona los usuarios del sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Crear un nuevo usuario para el sistema KIBA.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Nombre del usuario"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@kiba.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Contraseña del usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol</Label>
                <Select value={formData.rol} onValueChange={(value) => setFormData({...formData, rol: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="coach">Entrenador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Crear Usuario
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => {
          const IconComponent = getRolIcon(usuario.rol);
          return (
            <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{usuario.nombre}</CardTitle>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                    </div>
                  </div>
                  <Badge className={getRolBadge(usuario.rol)}>
                    {getRolName(usuario.rol)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rol:</span>
                    <span className="font-medium">{getRolName(usuario.rol)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-xs">{usuario.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Creado:</span>
                    <span className="font-medium">
                      {new Date(usuario.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <strong>Contraseña:</strong> {usuario.password}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    * Las contraseñas se almacenan en texto plano según especificación
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Warning Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Nota de Seguridad</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 text-sm">
            Este sistema almacena las contraseñas en texto plano según la especificación del proyecto. 
            En un entorno de producción real, se recomienda usar hash de contraseñas con bcrypt o similar.
          </p>
        </CardContent>
      </Card>

      {/* Empty State */}
      {usuarios.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <UserCog className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay usuarios
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza creando usuarios para acceder al sistema.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}