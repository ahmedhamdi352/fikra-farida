import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LinksService } from 'api/services/LinksService';
import { ProfileService } from 'api/services/ProfileService';
import { useState } from 'react';

interface UpdateLinkPayload {
  pk: number | string;
  url: string;
  title?: string;
  iconurl?: string;
  type?: number;
  sort?: number;
}

export function useUpdateLinkMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateLinkPayload) => {
      setIsLoading(true);
      try {
        const formattedPayload = {
          pk: payload.pk,
          url: payload.url,
          title: payload.title,
          iconurl: payload.iconurl,
          type: payload.type || 0,
          sort: payload.sort || 0,
        };

        return await LinksService.updateLink.request(formattedPayload);
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProfileService.getProfile.queryKey] });
    },
  });

  const onUpdateLink = async (payload: UpdateLinkPayload) => {
    try {
      return await mutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  };

  return {
    onUpdateLink,
    isLoading,
    error: mutation.error,
  };
}
