import { useQuery } from '@tanstack/react-query';
import { BlogsService } from 'api';
import { BlogsForReadDTO } from 'types/api';

export function useGetBlogByIdQuery(blogId: number) {
  const query = useQuery<BlogsForReadDTO>({
    queryKey: [BlogsService.getBlogById.mutationKey],
    queryFn: () => BlogsService.getBlogById.request(blogId),
  });

  return {
    data: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
