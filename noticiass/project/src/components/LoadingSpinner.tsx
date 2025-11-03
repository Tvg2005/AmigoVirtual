import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-blue-200 animate-pulse" />
      </div>
      <p className="mt-4 text-gray-600 font-medium">Carregando notícias...</p>
      <p className="text-sm text-gray-500">Buscando as últimas atualizações para você</p>
    </div>
  );
}