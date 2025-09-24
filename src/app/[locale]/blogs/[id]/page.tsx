'use client';

import { Newsletter } from 'components/Newsletter';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useGetBlogByIdQuery } from 'hooks/blogs/query/useGetBlogByIdQuery';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function BlogDetails() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const blogId = parseInt(id);

  const { data: blog, isLoading, isError } = useGetBlogByIdQuery(blogId);

  console.log(blog)

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  if (isError || !blog) {
    return <div>Blog not found</div>;
  }

  const content = blog.Content || '';
  const title = blog.Title || '';


  return (
    <div className="container mt-4 mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-6">
        {blog.MediaUrl && blog.BlogType === 'Pic' && (
          <Image
            alt='blog image'
            src={blog.MediaUrl ? `https://fikrafarida.com/Media/Blogs/${blog.MediaUrl}` : ''}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        {blog.MediaUrl && blog.BlogType === 'Video' && (
          <video
            src={blog.MediaUrl ? `https://fikrafarida.com/Media/Blogs/${blog.MediaUrl}` : ''}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg mb-6"
            autoPlay
            loop
            playsInline
          />
        )}
        <div className="container mx-auto my-6 p-0 w-full">
          <div className="card-container">
            <div className="flex items-center">
              <span className="inline-block border-t-2 border-[var(--main-color1)] w-4"></span>
              <span className="text-[var(--main-color1)] text-sm mx-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {locale === 'ar' ? 'أضيف حديثاً' : 'Recently Added'}
              </span>
              <span className="inline-block border-t-2 border-[var(--main-color1)] w-4"></span>
            </div>
            <article className="mt-4">
              <div className="space-y-6">
                <h1 className="mb-4 text-[24px] md:text-[32px] lg:text-[50px] font-medium text-[var(--main-color1)] leading-[110.5%]">
                  {title}
                </h1>
              </div>
              <div
                className="prose prose-invert max-w-none"
                style={{ whiteSpace: 'pre-line' }}
              >
                {blog.Subtitle}
              </div>
              <div
                className="prose prose-invert max-w-none"
                style={{ whiteSpace: 'pre-line' }}
              >
                {content}
              </div>
            </article>
          </div>
          <div className="mt-6 lg:mx-0">
            <Newsletter />
          </div>
        </div>
      </div>
    </div>
  );
}