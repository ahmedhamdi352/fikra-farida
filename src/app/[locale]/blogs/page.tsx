'use client';
// import Image from 'next/image';
import Link from 'next/link';
// import blog1 from 'assets/images/blogs/blog1.png'
// import blog2 from 'assets/images/blogs/blog2.png'
// import blog3 from 'assets/images/blogs/blog3.png'
import { Button } from 'components/ui/Button';
import { Newsletter } from 'components/Newsletter';
import { useTranslations } from 'next-intl';
import { useGetAllBlogsQuery } from 'hooks';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useEffect, useState } from 'react';
import { BlogsForReadDTO } from 'types';


export default function BlogsPage() {
  const { data: blogsData, isLoading } = useGetAllBlogsQuery();
  const t = useTranslations('blogs');
  const tCommon = useTranslations('common');
  const [blogs, setBlogs] = useState<BlogsForReadDTO[]>([]);

  useEffect(() => {
    if (blogsData) {
      const blogs = blogsData?.map((blog) => ({
        BlogId: blog.BlogId,
        Title: blog.Title,
        Subtitle: blog.Subtitle,
        Content: blog.Content,
        MediaUrl: blog.MediaUrl,
      }));
      setBlogs(blogs || []);
    }
  }, [blogsData]);



  // const [firstBlog, ...otherBlogs] = blogs;

  // const blogs = [
  //   {
  //     id: 1,
  //     title: t('blog1'),
  //     description: t('blog1Des'),
  //     image: blog1,
  //   },
  //   {
  //     id: 2,
  //     title: t('blog2'),
  //     description: t('blog2Des'),
  //     image: blog2,
  //   },
  //   {
  //     id: 3,
  //     title: t('blog3'),
  //     description: t('blog3Des'),
  //     image: blog3,
  //   },
  // ];

  const [firstBlog, ...otherBlogs] = blogs || [];

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  // Handle case when no blogs are available
  if (!blogs || blogs.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-600">{t('noBlogsAvailable') || 'No blogs available at the moment.'}</p>
        </div>
      </main>
    );
  }
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-[var(--main-color1)] text-3xl sm:text-4xl mb-4 font-bold  tracking-[0.12px] md:tracking-normal uppercase">{t('headTitle')}</h1>
        <p className="lg:max-w-[50%] text-[var(--small-text)] text-lg font-normal">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Large blog post */}
        {firstBlog && (
          <Link href={`/blogs/${firstBlog.BlogId}`}
            className='bg-[rgba(217,217,217,0.20)] backdrop-blur-[50px] lg:bg-transparent overflow-hidden
            p-5 lg:p-0 lg:pr-8 flex flex-col justify-center items-center shadow-sm'
          >
            <article className="flex flex-col pb-5">
              <div className="relative  w-full mb-6">
                <video
                  src={firstBlog.MediaUrl ? `https://fikrafarida.com/Media/Blogs/${firstBlog.MediaUrl}` : ''}
                  className="object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-h2 text-[#FEC400] font-semibold self-start">{firstBlog.Title || 'Untitled'}</h2>
                <p className="text-h4 line-clamp-3">{firstBlog.Subtitle || 'No description available'}</p>
                <p className="text-body line-clamp-3">{firstBlog.Content || 'No description available'}</p>
              </div>

              <div className="hidden lg:block self-start w-[55%]">
                <Button href={`/blogs/${firstBlog.BlogId}`} withArrow>
                  {tCommon("actions.readMore")}
                </Button>
              </div>
            </article>
          </Link>
        )}

        {/* Right side - Two smaller blog posts */}
        <div className="flex flex-col space-y-8">
          {otherBlogs && otherBlogs.length > 0 && otherBlogs.map((blog) => (
            <Link href={`/blogs/${blog.BlogId}`} key={blog.BlogId}
              className='bg-[rgba(217,217,217,0.20)] backdrop-blur-[50px] lg:bg-transparent overflow-hidden
               p-5 lg:p-0 lg:pr-8 flex flex-col justify-center items-center shadow-sm'
            >
              <article key={blog.BlogId} className="flex flex-col">
                <div className="relative h-[250px] lg:h-[360px] w-full mb-6">
                  <video
                    src={blog.MediaUrl ? `https://fikrafarida.com/Media/Blogs/${blog.MediaUrl}` : ''}
                    // className="object-cover "
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-h2 text-[#FEC400] font-semibold self-start">{blog.Title || 'Untitled'}</h2>
                  <p className="text-h4 line-clamp-3">{blog.Subtitle || 'No description available'}</p>
                  <p className="text-body line-clamp-3">{blog.Content || 'No description available'}</p>
                </div>
                <div className="hidden lg:block self-start w-[55%]">
                  <Button href={`/blogs/${blog.BlogId}`} withArrow>
                    {tCommon("actions.readMore")}
                  </Button>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 lg:mx-0">
        <Newsletter />
      </div>

    </main>
  );
}
