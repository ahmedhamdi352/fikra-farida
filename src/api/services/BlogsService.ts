import { ApiURLs, httpClient } from 'api/core';
import { BlogsForReadDTO } from 'types/api';

async function getBlogs() {
  return await httpClient.get<BlogsForReadDTO[]>(`${ApiURLs.blogs}`);
}

async function getBlogById(blogId: number) {
  return await httpClient.get<BlogsForReadDTO>(`${ApiURLs.blogs}/${blogId}`);
}

export const BlogsService = {
  getBlogs: {
    request: getBlogs,
    mutationKey: 'get-blogs',
  },
  getBlogById: {
    request: getBlogById,
    mutationKey: 'get-blog-by-id',
  },
};
