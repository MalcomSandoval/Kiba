'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, Download, Upload, Shield, Trophy } from 'lucide-react';

export default function ConfiguracionPage() {
  const handleExportData = () => {
    // Simulate data export
    const data = {
      exported_at: new Date().toISOString(),
      jugadores: 'Datos de jugadores...',
      pagos: 'Datos de pagos...',
      asistencias: 'Datos de asistencias...'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiba-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Administra la configuración del sistema KIBA</p>
      </div>

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Información del Sistema</span>
            </CardTitle>
            <CardDescription>
              Detalles del sistema KIBA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Versión:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Club:</span>
              <span className="font-medium">KIBA Voleibol</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base de Datos:</span>
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Última Actualización:</span>
              <span className="font-medium">Hoy</span>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Gestión de Datos</span>
            </CardTitle>
            <CardDescription>
              Respaldo y restauración de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Importar Datos
            </Button>
            <p className="text-xs text-gray-500">
              Crea respaldos regulares de tu información
            </p>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Configuración de Seguridad</span>
            </CardTitle>
            <CardDescription>
              Ajustes de seguridad del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Autenticación:</span>
              <span className="font-medium text-yellow-600">Básica</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Contraseñas:</span>
              <span className="font-medium text-red-600">Texto Plano</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sesiones:</span>
              <span className="font-medium text-green-600">Local Storage</span>
            </div>
            <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ Sistema básico según especificaciones
            </p>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <span>Configuración General</span>
            </CardTitle>
            <CardDescription>
              Ajustes generales del club
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nombre del Club:</span>
              <span className="font-medium">KIBA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Deporte:</span>
              <span className="font-medium">Voleibol</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Moneda:</span>
              <span className="font-medium">USD ($)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Zona Horaria:</span>
              <span className="font-medium">UTC-6</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card className="bg-gradient-to-r from-purple-600 to-black text-white">
        <CardHeader>
          <CardTitle>Características del Sistema KIBA</CardTitle>
          <CardDescription className="text-purple-100">
            Funcionalidades implementadas en esta versión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Gestión de Jugadores</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>• CRUD completo de jugadores</li>
                <li>• Categorías por edad</li>
                <li>• Posiciones técnicas</li>
                <li>• Estados (activo, inactivo, suspendido)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Control Financiero</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>• Registro de pagos mensuales</li>
                <li>• Generación de recibos PDF</li>
                <li>• Estados de pago</li>
                <li>• Métodos de pago</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Asistencias</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>• Control de asistencia diaria</li>
                <li>• Estados múltiples</li>
                <li>• Reportes por fecha</li>
                <li>• Registro masivo</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Administración</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>• Dashboard con métricas</li>
                <li>• Gestión de usuarios</li>
                <li>• Autenticación básica</li>
                <li>• Diseño responsive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Stack Tecnológico</CardTitle>
          <CardDescription>
            Tecnologías utilizadas en el desarrollo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Frontend</h4>
              <p className="text-sm text-blue-700">Next.js 14</p>
              <p className="text-sm text-blue-700">React + TypeScript</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Base de Datos</h4>
              <p className="text-sm text-green-700">PostgreSQL</p>
              <p className="text-sm text-green-700">Supabase</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Estilos</h4>
              <p className="text-sm text-purple-700">TailwindCSS</p>
              <p className="text-sm text-purple-700">Shadcn/ui</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900">Deploy</h4>
              <p className="text-sm text-yellow-700">Vercel</p>
              <p className="text-sm text-yellow-700">Responsive</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}