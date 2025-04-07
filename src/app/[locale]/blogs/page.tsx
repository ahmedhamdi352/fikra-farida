import Image from 'next/image';
import Link from 'next/link';
import blog1 from 'assets/images/blogs/blog1.png'
import blog2 from 'assets/images/blogs/blog2.png'
import blog3 from 'assets/images/blogs/blog3.png'
import { Button } from 'components/ui/Button';
import { Newsletter } from 'components/Newsletter';
import { useTranslations } from 'next-intl';


export default function BlogsPage() {
  const t = useTranslations('blogs');
  const tCommon = useTranslations('common');

  const blogs = [
    {
      id: 1,
      title: t('blog1'),
      description: t('blog1Des'),
      image: blog1,
    },
    {
      id: 2,
      title: t('blog2'),
      description: t('blog2Des'),
      image: blog2,
    },
    {
      id: 3,
      title: t('blog3'),
      description: t('blog3Des'),
      image: blog3,
    },
  ];

  const [firstBlog, ...otherBlogs] = blogs;
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
        <Link href={`/blogs/${firstBlog.id}`}
          className='bg-[rgba(217,217,217,0.20)] backdrop-blur-[50px] lg:bg-transparent overflow-hidden
          p-5 lg:p-0 lg:pr-8 flex flex-col justify-center items-center shadow-sm'
        >
          <article className="flex flex-col justify-center items-center ">
            <div className="relative h-[250px] lg:h-[400px] w-full mb-6">
              <Image
                src={firstBlog.image}
                alt={firstBlog.title}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-[#FEC400]  text-[12px] font-semibold leading-[150%] tracking-[0.12px] md:text-[32px] md:font-medium md:leading-[48px] md:[font-variant-numeric:lining-nums_proportional-nums] md:[font-feature-settings:'liga'_off] mb-4 self-start">{firstBlog.title}</h2>
            <p className="text-[10px] font-light leading-[12px] [font-feature-settings:'liga'_off] md:text-[24px] md:leading-[32px] mb-6 line-clamp-3">{firstBlog.description}</p>
            <div className="hidden lg:block self-start w-[55%]">
              <Button href={`/blogs/${firstBlog.id}`} withArrow>
                {tCommon("actions.readMore")}
              </Button>
            </div>
          </article>
        </Link>

        {/* Right side - Two smaller blog posts */}
        <div className="flex flex-col space-y-8">
          {otherBlogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}
              className='bg-[rgba(217,217,217,0.20)] backdrop-blur-[50px] lg:bg-transparent overflow-hidden
               p-5 lg:p-0 lg:pr-8 flex flex-col justify-center items-center shadow-sm'
            >
              <article key={blog.id} className="flex flex-col">
                <div className="relative h-[250px] lg:h-[360px] w-full mb-6">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover "
                  />
                </div>
                <h2 className="text-[#FEC400]  text-[12px] font-semibold leading-[150%] tracking-[0.12px] md:text-[32px] md:font-medium md:leading-[48px] md:[font-variant-numeric:lining-nums_proportional-nums] md:[font-feature-settings:'liga'_off] mb-4">{blog.title}</h2>
                <p className="text-[10px] font-light leading-[12px] [font-feature-settings:'liga'_off] md:text-[24px] md:leading-[32px] mb-6 line-clamp-3">{blog.description}</p>
                <div className="hidden lg:block self-start w-[55%]">
                  <Button href={`/blogs/${blog.id}`} withArrow>
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
