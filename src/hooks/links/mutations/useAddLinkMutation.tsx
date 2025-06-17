import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LinksService } from 'api/services/LinksService';
import { ProfileService } from 'api/services/ProfileService';

interface AddLinkPayload {
  title: string;
  url: string;
  iconurl: string;
  type?: number;
  sort?: number;
}

export function useAddLinkMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddLinkPayload) => {
      setIsLoading(true);
      try {
        const formattedPayload = {
          iconurl: payload.iconurl,
          sort: payload.sort || 0,
          title: payload.title,
          type: payload.type || 0,
          url: payload.url,
        };

        return await LinksService.addLink.request(formattedPayload);
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: async () => {
      // First invalidate the query cache
      queryClient.invalidateQueries({ queryKey: [ProfileService.getProfile.mutationKey] });
      
      // Then force a direct refetch to ensure fresh data
      try {
        await ProfileService.getProfile.request();
      } catch (error) {
        console.error('Error refetching profile after adding link:', error);
      }
    },
  });

  const onAddLink = async (payload: AddLinkPayload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  };

  return {
    onAddLink,
    isLoading,
    error: mutation.error,
  };
}
