import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Ops! Algo deu errado
        </h3>
        <p className="text-red-600 mb-6 text-sm leading-relaxed">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium 
                   rounded-lg hover:bg-red-700 transition-colors duration-200 transform 
                   hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 
                   focus:ring-offset-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}