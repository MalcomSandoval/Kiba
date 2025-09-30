'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Target, 
  CreditCard, 
  Calendar, 
  UserCog, 
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jugadores', href: '/dashboard/jugadores', icon: Users },
  { name: 'Categorías', href: '/dashboard/categorias', icon: Trophy },
  { name: 'Posiciones', href: '/dashboard/posiciones', icon: Target },
  { name: 'Pagos', href: '/dashboard/pagos', icon: CreditCard },
  { name: 'Asistencias', href: '/dashboard/asistencias', icon: Calendar },
  { name: 'Usuarios', href: '/dashboard/usuarios', icon: UserCog },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-black transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-purple-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-purple-900 font-bold text-lg">K</span>
              </div>
              <span className="text-white font-bold text-xl">KIBA</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden text-white hover:bg-purple-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-purple-900 shadow-lg"
                      : "text-purple-100 hover:bg-purple-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-purple-800">
            <div className="mb-4">
              <p className="text-purple-100 text-sm">Bienvenido</p>
              <p className="text-white font-medium">
                {authService.getCurrentUser()?.nombre || 'Usuario'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-800 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}