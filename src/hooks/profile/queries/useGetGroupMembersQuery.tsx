import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetGroupMembersQuery(groupId: string) {
  const query = useQuery({
    queryKey: [ProfileService.getGroupMembers.mutationKey, groupId],
    queryFn: async () => {
      try {
        const response = await ProfileService.getGroupMembers.request(Number(groupId));
        return response;
      } catch (error) {
        console.error('group members fetch error:', error);
        throw error;
      }
    },
  });

  const onGetGroupMembers = () => {
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering group members fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getGroupMembers.mutationKey);

  return {
    data: query.data,
    isLoading,
    error: query.error,
    onGetGroupMembers,
  };
}
