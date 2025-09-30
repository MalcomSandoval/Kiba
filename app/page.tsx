'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">K</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">KIBA</h1>
        <p className="text-gray-600">Cargando sistema...</p>
      </div>
    </div>
  );
}