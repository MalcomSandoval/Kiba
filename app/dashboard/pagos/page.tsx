'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '@/lib/database';
import type { Pago, Jugador } from '@/lib/supabase';
import { Plus, Search, Download, CreditCard, Calendar } from 'lucide-react';
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

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    jugador_id: '',
    monto: 0,
    mes: '',
    año: new Date().getFullYear(),
    metodo_pago: 'efectivo',
    estado: 'pendiente',
    fecha_pago: ''
  });

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pagosData, jugadoresData] = await Promise.all([
        DatabaseService.getPagos(),
        DatabaseService.getJugadores()
      ]);
      
      setPagos(pagosData);
      setJugadores(jugadoresData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      jugador_id: '',
      monto: 0,
      mes: '',
      año: new Date().getFullYear(),
      metodo_pago: 'efectivo',
      estado: 'pendiente',
      fecha_pago: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pagoData = {
        ...formData,
        fecha_pago: formData.estado === 'pagado' ? new Date().toISOString() : null
      };
      
      await DatabaseService.createPago(pagoData);
      await loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving pago:', error);
    }
  };

  const markAsPaid = async (pagoId: string) => {
    try {
      await DatabaseService.updatePago(pagoId, {
        estado: 'pagado',
        fecha_pago: new Date().toISOString()
      });
      await loadData();
    } catch (error) {
      console.error('Error updating pago:', error);
    }
  };

  const generateReceipt = (pago: Pago) => {
    // Simple PDF generation simulation
    const receiptData = `
      RECIBO DE PAGO - CLUB KIBA
      ========================
      
      Jugador: ${pago.jugador?.nombre_completo || 'N/A'}
      Mes: ${pago.mes} ${pago.año}
      Monto: $${pago.monto}
      Método: ${pago.metodo_pago}
      Fecha: ${pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : 'N/A'}
      
      ¡Gracias por tu pago!
    `;
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${pago.jugador?.nombre_completo}-${pago.mes}-${pago.año}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPagos = pagos.filter(pago =>
    pago.jugador?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pagado: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      vencido: 'bg-red-100 text-red-800'
    };
    return variants[estado as keyof typeof variants] || variants.pendiente;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-600 mt-2">Gestiona los pagos mensuales de los jugadores</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Pago</DialogTitle>
              <DialogDescription>
                Registra un nuevo pago mensual para un jugador.
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Select value={formData.mes} onValueChange={(value) => setFormData({...formData, mes: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {meses.map(mes => (
                        <SelectItem key={mes} value={mes}>
                          {mes}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="año">Año</Label>
                  <Input
                    id="año"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.año}
                    onChange={(e) => setFormData({...formData, año: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value)})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metodo_pago">Método de Pago</Label>
                  <Select value={formData.metodo_pago} onValueChange={(value) => setFormData({...formData, metodo_pago: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="deposito">Depósito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Registrar Pago
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
            placeholder="Buscar pagos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPagos.map((pago) => (
          <Card key={pago.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{pago.jugador?.nombre_completo || 'N/A'}</CardTitle>
                    <p className="text-sm text-gray-600">{pago.mes} {pago.año}</p>
                  </div>
                </div>
                <Badge className={getEstadoBadge(pago.estado)}>
                  {pago.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium text-lg">${pago.monto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Método:</span>
                  <span className="font-medium capitalize">{pago.metodo_pago}</span>
                </div>
                {pago.fecha_pago && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fecha de pago:</span>
                    <span className="font-medium">
                      {new Date(pago.fecha_pago).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-3">
                {pago.estado !== 'pagado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => markAsPaid(pago.id)}
                  >
                    Marcar Pagado
                  </Button>
                )}
                {pago.estado === 'pagado' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => generateReceipt(pago)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Recibo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPagos.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pagos
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No se encontraron pagos con ese término de búsqueda.' : 'Comienza registrando el primer pago mensual.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Pago
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}