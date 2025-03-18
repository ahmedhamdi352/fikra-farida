import Image from 'next/image';
import Link from 'next/link';
import blog1 from 'assets/images/blogs/blog1.png'
import blog2 from 'assets/images/blogs/blog2.png'
import blog3 from 'assets/images/blogs/blog3.png'
import { Button } from 'components/ui/Button';
import { Newsletter } from 'components/Newsletter';
import { useTranslations } from 'next-intl';

const blogs = [
  {
    id: 1,
    title: 'Digital Transformation and Vision 2030: Toward an Integrated Digital Future',
    description: 'Digital transformation is the process of integrating digital technology into all aspects of life, whether at the government level, private sector, or among individuals. This transformation aims to enhance performance, streamline processes, and make services more effective and efficient.',
    image: blog1,
  },
  {
    id: 2,
    title: 'Why Should I Switch from Traditional to Digital Business Cards?',
    description: 'In the evolving business world, the NFC-enabled digital business card is one of the most significant innovations that have changed how we exchange information. Unlike traditional paper business cards, which can easily be lost or damaged, the NFC-enabled digital card allows for instant data transfer just by bringing the smartphone close to it.',
    image: blog2,
  },
  {
    id: 3,
    title: 'How Digital Business Cards Can Help Develop Professional Relationships',
    description: "In today's fast-paced technological era, adopting modern tools to enhance communication and build professional relationships is essential. While traditional business cards have been a staple in professional...",
    image: blog3,
  },
];

export default function BlogsPage() {
  const [firstBlog, ...otherBlogs] = blogs;
  const t = useTranslations('blogs');
  const tCommon = useTranslations('common');
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-[var(--main-color1)]  text-h1 font-bold  tracking-[0.12px] md:tracking-normal uppercase">{t('headTitle')}</h1>
        <p className="lg:max-w-[50%] text-[var(--small-text)] text-body  font-normal">
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
            <h2 className="text-[#FEC400] font-semibold text-h3  md:font-medium md:[font-variant-numeric:lining-nums_proportional-nums] md:[font-feature-settings:'liga'_off] mb-4">{firstBlog.title}</h2>
            <p className="[font-feature-settings:'liga'_off] text-body mb-6">{firstBlog.description}</p>
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
                <h2 className="text-[#FEC400] font-poppins text-[12px] font-semibold leading-[150%] tracking-[0.12px] md:text-[32px] md:font-medium md:leading-[48px] md:[font-variant-numeric:lining-nums_proportional-nums] md:[font-feature-settings:'liga'_off] mb-4">{blog.title}</h2>
                <p className="font-poppins text-[10px] font-light leading-[12px] [font-feature-settings:'liga'_off] md:text-[24px] md:leading-[32px] mb-6 line-clamp-3">{blog.description}</p>
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
