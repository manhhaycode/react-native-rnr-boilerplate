import queryClient from '@/libs/tanstack-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClientProvider as QueryProvider } from '@tanstack/react-query';
import * as React from 'react';

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'development') {
    useReactQueryDevTools(queryClient);
  }
  return (
    // Provide the client to your App
    <QueryProvider client={queryClient}>{children}</QueryProvider>
  );
}
