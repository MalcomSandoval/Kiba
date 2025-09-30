'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  color = 'bg-purple-600'
}: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs lg:text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={cn('h-7 w-7 lg:h-8 lg:w-8 rounded-lg flex items-center justify-center', color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl lg:text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className={cn(
            'text-xs mt-1',
            changeType === 'positive' && 'text-green-600',
            changeType === 'negative' && 'text-red-600',
            changeType === 'neutral' && 'text-gray-600'
          )}>
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}