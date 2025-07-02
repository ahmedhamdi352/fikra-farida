'use client';

import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query';
// Removed ReactQueryDevtools import to hide TanStack icon
import { type ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: ProvidersProps) {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
      mutations: {
        retry: false,
      },
    },
  });


  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ReactQueryDevtools removed to hide TanStack icon */}
    </QueryClientProvider>
  );
}
