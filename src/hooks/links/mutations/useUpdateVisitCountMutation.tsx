import { useMutation } from '@tanstack/react-query';
import { LinksService } from 'api/services/LinksService';

export function useUpdateVisitCountMutation() {

  const mutation = useMutation({
    mutationFn: async (pk: string | number) => {
      try {
        return await LinksService.updateVisitCount.request(pk);
      } catch (error) {
        console.error('Error updating link:', error);
        throw error;
      }
    },

  });

  const onUpdateVisitCount = async (pk: string | number) => {
    try {
      return await mutation.mutateAsync(pk);
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  };

  return {
    onUpdateVisitCount,
    error: mutation.error,
  };
}
