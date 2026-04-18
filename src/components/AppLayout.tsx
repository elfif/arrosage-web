import { Outlet } from '@tanstack/react-router';
import { Droplets } from 'lucide-react';
import { Sidebar } from './layout/sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-card-foreground">Système d'Arrosage</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>    
    </div>
  )
}

