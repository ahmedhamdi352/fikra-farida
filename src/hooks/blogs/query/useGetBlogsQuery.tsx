import { useQuery } from '@tanstack/react-query';
import { BlogsService } from 'api';
import { BlogsForReadDTO } from 'types/api';

export function useGetAllBlogsQuery() {
  const query = useQuery<BlogsForReadDTO[]>({
    queryKey: [BlogsService.getBlogs.mutationKey],
    queryFn: BlogsService.getBlogs.request,
  });

  return {
    data: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
