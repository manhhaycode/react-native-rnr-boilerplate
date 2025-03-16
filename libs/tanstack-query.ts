import { DefaultOptions } from '@tanstack/query-core';
import { QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    placeholderData: (prevData: unknown) => prevData,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 2,
  },
};

const queryClient = new QueryClient({ defaultOptions: queryConfig });

export default queryClient;
