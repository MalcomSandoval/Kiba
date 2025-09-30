'use client';

import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseService } from '@/lib/database';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp,
  Trophy,
  Target,
  Activity
} from 'lucide-react';

interface DashboardMetrics {
  jugadoresActivos: number;
  totalJugadores: number;
  pagosPendientes: number;
  totalPagos: number;
  porcentajeAsistencia: number;
  totalAsistencias: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await DatabaseService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Panel de control del club KIBA</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 lg:mt-2">Panel de control del club KIBA</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Jugadores Activos"
          value={metrics?.jugadoresActivos || 0}
          change={`${metrics?.totalJugadores || 0} total`}
          changeType="neutral"
          icon={Users}
          color="bg-purple-600"
        />
        
        <MetricCard
          title="Pagos Pendientes"
          value={metrics?.pagosPendientes || 0}
          change={`${metrics?.totalPagos || 0} total`}
          changeType={metrics?.pagosPendientes ? 'negative' : 'positive'}
          icon={CreditCard}
          color="bg-red-600"
        />
        
        <MetricCard
          title="Asistencia Promedio"
          value={`${metrics?.porcentajeAsistencia || 0}%`}
          change={`${metrics?.totalAsistencias || 0} registros`}
          changeType={metrics && metrics.porcentajeAsistencia >= 80 ? 'positive' : 'negative'}
          icon={Calendar}
          color="bg-green-600"
        />
        
        <MetricCard
          title="Rendimiento"
          value="Excelente"
          change="↗ Mejorando"
          changeType="positive"
          icon={TrendingUp}
          color="bg-blue-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Gestión de Jugadores</span>
            </CardTitle>
            <CardDescription>
              Administra el registro de jugadores del club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {metrics?.totalJugadores || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">jugadores registrados</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Categorías</span>
            </CardTitle>
            <CardDescription>
              Organización por grupos de edad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">4</div>
            <p className="text-sm text-gray-500 mt-1">categorías disponibles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Posiciones</span>
            </CardTitle>
            <CardDescription>
              Especialización en voleibol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="text-sm text-gray-500 mt-1">posiciones técnicas</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-purple-600 to-black text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span>Bienvenido al Sistema KIBA</span>
          </CardTitle>
          <CardDescription className="text-purple-100">
            Administra todos los aspectos de tu club de voleibol desde un solo lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100">
            Gestiona jugadores, pagos, asistencias y más con nuestro sistema integral de administración deportiva.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}