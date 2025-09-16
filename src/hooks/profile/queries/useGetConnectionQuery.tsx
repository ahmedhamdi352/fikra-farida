import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

// Define the interface for filter parameters
export interface ConnectionFilters {
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export function useGetConnectionQuery() {
  const mutation = useMutation({
    mutationKey: [ProfileService.getConnections.mutationKey],
    mutationFn: async (filters?: ConnectionFilters) => {
      try {
        // Pass filters to your service method
        const response = await ProfileService.getConnections.request(filters);
        return response;
      } catch (error) {
        console.error('Connection fetch error:', error);
        throw error;
      }
    },
  });

  const onGetConnections = (filters?: ConnectionFilters) => {
    try {
      // Pass filters as a single object parameter to mutate
      mutation.mutate(filters);
    } catch (error) {
      console.error('Error triggering Connection fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getConnections.mutationKey);
  console.log('mutation.data', mutation);

  return {
    data: mutation.data,
    isLoading,
    error: mutation.error,
    onGetConnections,
  };
}
