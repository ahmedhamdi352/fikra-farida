import Image from 'next/image';
import { Newsletter } from 'components/Newsletter';
import blog1 from 'assets/images/blogs/blogDetails.png';
import blog2 from 'assets/images/blogs/blog2.png';
import blog3 from 'assets/images/blogs/blog3.png';

const blogs = [
  {
    id: 1,
    title: 'Digital Transformation and Vision 2030: Toward an Integrated Digital Future',
    image: blog1,
    date: '2024-01-20',
    content: `
      What is Digital Transformation?
      Digital transformation is the process of integrating digital technology into all aspects of life, whether at the governmental level, private sector, or among individuals. This transformation aims to enhance performance, streamline processes, and make services more effective and efficient. It requires fundamental changes in technology, culture, and operations, affecting various sectors including education, healthcare, the economy, and even interpersonal communication.

      Vision 2030 and Digital Transformation
      Vision 2030 aims to achieve a comprehensive digital transformation that enhances productivity levels and provides smarter, more accessible government services to citizens.

      The Role of Digital Business Cards in Supporting Digital Transformation
      Digital business cards are a crucial component of this transformation. They are not just a means of exchanging information but also a powerful tool for enhancing digital communication between individuals and businesses. Here's how these cards support Vision 2030:

      Reducing Paper Use and Promoting Sustainability
      One of the key initiatives of Vision 2030 is to promote environmental sustainability and reduce reliance on paper-based systems. Digital business cards help achieve this goal by minimizing the need for traditional paper cards. By transitioning to digital formats, environmental waste can be minimized, and deforestation for paper production can be reduced, preserving natural resources for future generations.

      Enhancing Smart and Effective Communication
      Under Vision 2030, countries aim to establish advanced digital infrastructures that enhance communication among individuals, businesses, and governments. Digital business cards serve as an important tool in this transformation. They allow for instant sharing of contact information without in-person meetings. They can be shared via smart devices and stored conveniently, saving time and effort while improving the communication experience for all parties.

      Supporting Startups and Entrepreneurship
      Entrepreneurship and supporting startups are key objectives of Vision 2030. Digital technologies, including business cards, enable entrepreneurs to market themselves and their products innovatively. These cards can include links to websites or social media profiles, increasing awareness of their businesses and facilitating networking opportunities.

      Facilitating Continuous Updates
      One of the significant challenges businesses face is the need to update information continuously. Thanks to digital business cards, individuals and companies can instantly update their details, saving time and costs associated with reprinting paper cards whenever changes occur. This aligns with Vision 2030's goals of simplifying processes and reducing waste.

      Enhancing Analytics and Digital Data
      One of the cornerstones of digital transformation is leveraging data analytics to improve operations and decision-making. Digital business cards offer features to track interactions, allowing users to see when their cards are viewed or shared. This data helps businesses and professionals better understand their communication strategies and increase effectiveness.

      Digital Transformation is a Journey, Not an Option
      In the context of Vision 2030, digital transformation is no longer a choice or a luxury; it is a necessity for achieving sustainable development and building a strong economy capable of facing future challenges. By adopting tools like digital business cards, individuals and companies can embrace this transformation and contribute to building a true digital future.
    `
  },
  {
    id: 2,
    title: 'Blog Title 2',
    image: blog2,
    date: '2024-01-19',
    content: 'Blog content 2...'
  },
  {
    id: 3,
    title: 'Blog Title 3',
    image: blog3,
    date: '2024-01-18',
    content: 'Blog content 3...'
  }
];

interface BlogDetailsProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function BlogDetails({
  params,
}: BlogDetailsProps) {
  const resolvedParams = await params;
  const blog = blogs.find(b => b.id === parseInt(resolvedParams.id));

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <main className="min-h-screen mx-auto  pb-12">
      <div className="relative w-full h-[500px] mb-8 overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="border border-[var(--main-color1)] rounded-[5px] p-6 mb-8 bg-black/30">
          <div className="flex items-center">
            <span className="inline-block border-t-2 border-[var(--main-color1)] w-4"></span>
            <span className="text-[var(--main-color1)] text-sm mx-2">Recently Added</span>
            <span className="inline-block border-t-2 border-[var(--main-color1)] w-4"></span>
          </div>
          <article className="mt-4">
            <div className="space-y-6">
              <h1 className="text-[24px] md:text-[32px] lg:text-[50px] font-medium text-[var(--main-color1)] leading-[110.5%]">
                {blog.title}
              </h1>

              <div className="prose prose-invert max-w-none">
                {blog.content.split('\n\n').map((paragraph, index) => {
                  const trimmedParagraph = paragraph.trim();
                  if (!trimmedParagraph) return null;

                  if (trimmedParagraph.endsWith('?') || trimmedParagraph.includes('Vision 2030:')) {
                    return (
                      <h2 key={index} className="text-white text-xl font-semibold mb-4">
                        {trimmedParagraph}
                      </h2>
                    );
                  }

                  return (
                    <p key={index} className="text-white/80 text-base leading-relaxed mb-4">
                      {trimmedParagraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </article>
        </div>

        <div className="mt-16 lg:mx-0">
          <Newsletter />
        </div>
      </div>
    </main>
  );
}
