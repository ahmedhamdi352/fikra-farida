import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

interface GroupData {
  GroupId: number;
  GroupName: string;
  CompanyName: string;
  Note?: string;
  CreatedDate: string;
  UpdatedDate: string;
}

export function useGetGroupByIdQuery(groupId: string | null) {
  const query = useQuery<GroupData | null>({
    queryKey: [ProfileService.getGroupsById.mutationKey, groupId],
    queryFn: async () => {
      if (!groupId) return null;
      try {
        const response = await ProfileService.getGroupsById.request(Number(groupId));
        return response;
      } catch (error) {
        console.error('Group fetch error:', error);
        throw error;
      }
    },
    enabled: !!groupId,
  });

  const onGetGroupById = () => {
    if (!groupId) return;
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering group fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getGroupsById.mutationKey);

  return {
    data: query.data || null,
    isLoading,
    error: query.error,
    onGetGroupById,
  };
}
