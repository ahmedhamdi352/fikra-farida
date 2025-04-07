import Image from 'next/image';
import { Newsletter } from 'components/Newsletter';
import blog1 from 'assets/images/blogs/blogDetails.png';
import blog2 from 'assets/images/blogs/blog2.png';
import blog3 from 'assets/images/blogs/blog3.png';

const blogs = [
  {
    id: 1,
    titleEn: 'Digital Transformation and Vision 2030: Toward an Integrated Digital Future',
    titleAr: 'حول الرقمي ورؤية 2030: نحو مستقبل رقمي متكامل',
    image: blog1,
    date: '2024-01-20',
    contentAr: `
      ما هو التحول الرقمي؟
      التحول الرقمي هو عملية دمج التكنولوجيا الرقمية في جميع مجالات الحياة، سواء على مستوى الحكومة أو القطاع الخاص أو الأفراد. يهدف هذا التحول إلى تحسين الأداء وتبسيط العمليات وجعل الخدمات أكثر فعالية وكفاءة. يتطلب التحول الرقمي إعادة التفكير في كيفية استخدام التكنولوجيا لتوفير خدمات جديدة أو تحسين الخدمات الحالية، سواء كانت في مجالات مثل التعليم، الصحة، الاقتصاد، أو حتى التواصل بين الأفراد.

      رؤية الدولة 2030 والتحول الرقمي
      تهدف رؤية 2030 إلى تحقيق تحول رقمي شامل يمكنه تحسين مستويات الإنتاجية، وتقديم خدمات حكومية أكثر ذكاءً وسهولة للمواطنين.

      دور بطاقات العمل الرقمية في دعم التحول الرقمي
      بطاقات العمل الرقمية تعتبر جزءًا أساسيًا من هذا التحول، فهي ليست مجرد وسيلة لتبادل المعلومات بل أداة فعالة تسهم في تعزيز التواصل الرقمي بين الأفراد والشركات. إليك كيف تساهم هذه البطاقات في دعم رؤية 2030:

      تقليل الاعتماد على الورق وتعزيز الاستدامة
      من أهم المبادرات في رؤية 2030 هو تعزيز الاستدامة البيئية وتقليل الاعتماد على الموارد غير المتجددة. بطاقات العمل الرقمية تساعد في تحقيق هذا الهدف عبر الاستغناء عن البطاقات الورقية التقليدية. من خلال تحويل بطاقات العمل إلى صيغة رقمية، يمكن تقليل الهدر البيئي والحد من قطع الأشجار المستخدمة في صناعة الورق، مما يسهم في الحفاظ على الموارد الطبيعية للأجيال القادمة.

      تعزيز التواصل الذكي والفعّال
      ضمن رؤية 2030، تسعى الدول إلى توفير بنية تحتية رقمية متقدمة تسهم في تعزيز التواصل بين الأفراد والشركات والحكومة. بطاقات العمل الرقمية تمثل أداة فعالة في هذا السياق، حيث تتيح تبادل المعلومات بسرعة وسهولة دون الحاجة إلى اللقاءات الشخصية. يمكن تبادل بطاقات العمل عبر الأجهزة الذكية وتخزينها، ما يسهم في توفير الوقت والجهد وتحسين تجربة التواصل بين جميع الأطراف.

      دعم الشركات الناشئة وريادة الأعمال
      تعد ريادة الأعمال ودعم الشركات الناشئة من الأهداف المهمة لرؤية 2030. التكنولوجيا الرقمية، بما فيها بطاقات العمل الرقمية، تتيح لرواد الأعمال تسويق أنفسهم ومنتجاتهم بطريقة مبتكرة وحديثة. يمكنهم تضمين روابط إلى مواقعهم الإلكترونية أو حساباتهم على وسائل التواصل الاجتماعي في البطاقة الرقمية، مما يسهم في زيادة الوعي بخدماتهم وتسهيل الوصول إلى معلوماتهم.

      تسهيل التحديث المستمر
      واحدة من أكبر التحديات التي تواجه الشركات هي الحاجة إلى تحديث المعلومات بشكل مستمر. بفضل بطاقات العمل الرقمية، يمكن للشركات والأفراد تعديل بياناتهم بشكل فوري، مما يتيح توفير الوقت والتكلفة المرتبطة بإعادة طباعة البطاقات الورقية في كل مرة يحدث تغيير. هذا يتماشى مع أهداف رؤية 2030 لتبسيط العمليات وتقليل الهدر.

      تعزيز التحليل والبيانات الرقمية
      إحدى الركائز الأساسية للتحول الرقمي هي تحليل البيانات والاستفادة منها في تحسين العمليات واتخاذ القرارات. بطاقات العمل الرقمية توفر ميزة تتبع التفاعل معها، حيث يمكن للمستخدمين معرفة من قام بفتح البطاقة، وما هي المعلومات التي أثارت اهتمامهم. هذه البيانات تساعد الشركات في تحسين استراتيجيات التواصل وزيادة فعاليتها.

      التحول الرقمي ليس خيارًا بل ضرورة
      في ظل رؤية 2030، التحول الرقمي لم يعد مجرد خيار أو رفاهية، بل أصبح ضرورة لتحقيق تنمية مستدامة وبناء اقتصاد قوي قادر على مواجهة تحديات المستقبل. ومن خلال تبني أدوات مثل بطاقات العمل الرقمية، يمكن للأفراد والشركات أن يواكبوا هذا التحول ويساهموا في بناء مستقبل رقمي أكثر إشراقًا.
    `,
    contentEn: `
      What is Digital Transformation?
      Digital transformation is the process of integrating digital technology into all aspects of life, whether at the governmental level, private sector, or among individuals. This transformation aims to enhance performance, streamline processes, and make services more effective and efficient. It requires rethinking how technology is used to deliver new services or improve existing ones in areas like education, healthcare, the economy, and even interpersonal communication.

      Vision 2030 and Digital Transformation
      Vision 2030 aims to achieve a comprehensive digital transformation that enhances productivity levels and provides smarter, more accessible government services to citizens.

      The Role of Digital Business Cards in Supporting Digital Transformation
      Digital business cards are a crucial component of this transformation. They are not just a means of exchanging information but also a powerful tool for enhancing digital communication between individuals and businesses. Here's how these cards support Vision 2030:

      Reducing Paper Use and Promoting Sustainability
      One of the key initiatives of Vision 2030 is to promote environmental sustainability and reduce reliance on non-renewable resources. Digital business cards support this goal by eliminating the need for traditional paper cards. By transitioning to digital formats, environmental waste can be minimized, and deforestation for paper production can be reduced, preserving natural resources for future generations.

      Enhancing Smart and Effective Communication
      Under Vision 2030, countries aim to establish advanced digital infrastructures that enhance communication among individuals, businesses, and governments. Digital business cards serve as an efficient tool in this context, enabling the rapid and easy exchange of information without the need for in-person meetings. They can be shared via smart devices and stored conveniently, saving time and effort while improving the communication experience for all parties.

      Supporting Startups and Entrepreneurship
      Entrepreneurship and supporting startups are key objectives of Vision 2030. Digital technologies, including business cards, enable entrepreneurs to market themselves and their products innovatively. These cards can include links to websites or social media profiles, increasing awareness of their services and facilitating access to their information.

      Facilitating Continuous Updates
      One of the significant challenges businesses face is the need to update information continuously. Thanks to digital business cards, individuals and companies can instantly update their details, saving time and costs associated with reprinting paper cards whenever changes occur. This aligns with Vision 2030's goals of simplifying processes and reducing waste.

      Enhancing Analytics and Digital Data
      One of the cornerstones of digital transformation is leveraging data analytics to improve operations and decision-making. Digital business cards offer features to track interactions, allowing users to see who opened the card, and which information piqued their interest. This data helps businesses refine their communication strategies and increase effectiveness.

      Digital Transformation is a Necessity, Not an Option
      In the context of Vision 2030, digital transformation is no longer a choice or a luxury; it is a necessity for achieving sustainable development and building a strong economy capable of facing future challenges. By adopting tools like digital business cards, individuals and companies can embrace this transformation and contribute to building a brighter digital future.
    `,
  },

  {
    id: 2,
    titleEn: 'How Digital Business Cards Can Help Develop Professional Relationships',
    titleAr: 'كيف يمكن أن تساعد بطاقة العمل الرقمية في تطوير العلاقات المهنية',
    image: blog2,
    date: '2024-01-18',
    contentAr: `في عصر التكنولوجيا المتسارعة، أصبح من الضروري اعتماد أدوات حديثة لتعزيز التواصل وبناء العلاقات المهنية. وبينما كانت بطاقات العمل التقليدية عنصرًا أساسيًا في الاجتماعات المهنية، أصبحت بطاقة العمل الرقمية اليوم الحل المبتكر الذي يعكس احترافية الفرد أو الشركة، مع توافقها الكامل مع متطلبات العصر الرقمي.

لماذا بطاقة العمل الرقمية أكثر من مجرد أداة للتواصل؟
بطاقة العمل الرقمية ليست فقط وسيلة لإرسال المعلومات بسرعة، بل هي أداة استراتيجية لتطوير العلاقات المهنية بطرق مبتكرة. إليك كيفية تأثيرها على تعزيز تواصلك مع الآخرين:

التفاعل الفوري وتبادل المعلومات الفعّال
بطاقة العمل الرقمية تُرسل مباشرة إلى الهاتف الذكي للطرف الآخر، مما يجعل من السهل حفظ معلوماتك والعودة إليها عند الحاجة. كما تتيح تضمين روابط لحساباتك على وسائل التواصل الاجتماعي أو موقعك الإلكتروني، مما يزيد من فاعلية التواصل.

سهولة التحديث المستمر
تتيح البطاقة الرقمية تحديث بياناتك بشكل فوري، سواء كنت قد غيرت وظيفتك أو رقم هاتفك. كل من يمتلك بطاقتك الرقمية يحصل على أحدث معلوماتك تلقائيًا دون الحاجة إلى إعادة الطباعة.

تعزيز الاحترافية من خلال التخصيص
يمكنك تصميم بطاقة رقمية تتناسب مع هوية علامتك التجارية، مع إضافة ألوان وشعارات وصور وفيديوهات أو عروض تقديمية، مما يترك انطباعًا دائمًا لدى العملاء والشركاء.

التحليل والبيانات لتعزيز التواصل
تتيح لك البطاقة الرقمية معرفة من قام بفتحها، عدد المشاركات، وأكثر الروابط تفاعلًا. هذه البيانات تمنحك رؤى قيمة لتحسين استراتيجياتك في المستقبل.

التواصل الدولي بسهولة
تُرسل البطاقة الرقمية عبر البريد الإلكتروني أو وسائل التواصل الاجتماعي أو الرسائل النصية، مما يتيح لك الوصول إلى جمهور عالمي دون الحاجة إلى مقابلة شخصية.

مواكبة المستقبل بتقنيات جديدة
استخدام البطاقة الرقمية يعكس تطلعك إلى المستقبل ويفتح أبوابًا جديدة للتواصل، مما يمنحك ميزة تنافسية ويعزز ثقة عملائك.

الخلاصة
بطاقة العمل الرقمية ليست مجرد بديل للبطاقات الورقية، بل هي أداة متكاملة لتطوير العلاقات المهنية بفضل خصائصها الفريدة مثل التحديث السريع، التخصيص، والقدرة على التحليل.

هل أنت مستعد للمستقبل؟
ابدأ باستخدام بطاقتك الرقمية الآن واجعل التواصل أكثر احترافية وتأثيرًا.`,
    contentEn: `In today’s fast-paced technological era, adopting modern tools to enhance communication and build professional relationships is essential. While traditional business cards have been a staple in professional meetings, digital business cards have emerged as an innovative solution that reflects individual or company professionalism while aligning with the demands of the digital age.

Why are Digital Business Cards More Than Just a Communication Tool?
Digital business cards are not merely a means to share information quickly. They are strategic tools for developing professional relationships in new and impactful ways. Here's how they can transform your networking approach:

Instant Interaction and Efficient Information Sharing
Digital business cards can be sent directly to a recipient's smartphone, ensuring your information is easily saved and readily accessible. They also allow you to include interactive elements like social media links or your website, enhancing communication effectiveness.

Effortless Continuous Updates
With a rapidly changing business environment, your contact details may need frequent updates. Digital business cards enable instant updates, ensuring recipients always have your latest information without the need for reprinting.

Enhanced Professionalism Through Customization
You can design your digital card to match your brand identity, adding colors, logos, images, videos, or even presentations. This level of customization leaves a lasting impression on clients and partners.

Analytics and Data to Boost Engagement
Digital cards allow you to track who opened your card, how many times it was shared, and which links were most clicked. These insights provide valuable data to refine your communication strategies.

Seamless International Communication
Unlike traditional cards, digital business cards can be shared via email, social media, or text messages, allowing you to connect with a global audience without needing face-to-face meetings.

Embracing the Future with New Technologies
Using a digital business card showcases your forward-thinking approach and opens up new avenues for networking, giving you a competitive edge and enhancing client trust.

Conclusion
Digital business cards are not just a replacement for paper cards; they are comprehensive tools for developing professional relationships. With features like instant updates, customization, and analytics, they provide a modern and efficient way to communicate.

Are You Ready for the Future?
Start using your digital business card today and take your networking to a professional and impactful level.`,
  },
  {
    id: 3,
    titleEn: 'Why Should I Switch from Traditional to Digital Business Cards?',
    titleAr: 'لماذا أقوم بتغيير بطاقتي التقليدية إلى رقمية؟',
    image: blog3,
    date: '2024-01-19',
    contentAr: `في عالم الأعمال المتطور، تُعد بطاقة العمل الرقمية المزودة بتقنية NFC واحدة من أهم الابتكارات التي غيرت طريقة تبادل المعلومات. بدلًا من تبادل بطاقات العمل الورقية التي يمكن أن تُفقد أو تتلف بسهولة، تتيح البطاقة الرقمية المدمجة بتقنية NFC إمكانية نقل البيانات بمجرد تقريب الهاتف الذكي منها.

ما هي مميزات بطاقة العمل الرقمية؟
بطاقة العمل الرقمية تتفوق على البطاقة التقليدية بعدة مزايا:

سهولة التحديث الفوري
عند تغيير معلومات الاتصال مثل رقم الهاتف أو البريد الإلكتروني، يمكن تحديث البيانات في النظام بسهولة، ليتمكن الجميع من الحصول على النسخة المحدثة فورًا، دون الحاجة لطباعة بطاقات جديدة.

التفاعل السريع والمباشر
يمكن تضمين روابط مباشرة إلى مواقع الإنترنت، حسابات وسائل التواصل الاجتماعي، وحتى الملفات التقديمية الخاصة بالشركة، مما يعزز التواصل الفعّال مع العملاء والشركاء.

فوائد بيئية
باستخدام البطاقة الرقمية، يمكن تقليل الحاجة إلى طباعة ملايين البطاقات الورقية، مما يساعد في الحفاظ على البيئة وتقليل النفايات الورقية.

تخصيص فريد يعكس هويتك
تتيح لك البطاقة الرقمية تخصيص التصميم وإضافة المحتوى مثل الفيديوهات والعروض التقديمية الخاصة بك أو بشركتك، مما يعكس هويتك المهنية بشكل أكثر فعالية.

تعزيز الاحترافية والمصداقية
استخدام بطاقة عمل رقمية يعطي انطباعًا قويًا عن احترافيتك وتطلعك نحو تبني الحلول التكنولوجية المتقدمة.

الخلاصة
بطاقة العمل الرقمية المزودة بتقنية NFC هي أكثر من مجرد أداة للتواصل؛ إنها ابتكار يعزز شبكاتك المهنية بطريقة سهلة وفعّالة. مع إمكانية التحديث الفوري والفوائد البيئية، توفر لك هذه البطاقة طريقة أكثر احترافية لبناء علاقات مهنية.

هل حان الوقت لتبني بطاقة عمل رقمية؟
ابدأ بتحديث طريقتك في التواصل الآن ولا تفوت فرصة تحسين علاقاتك المهنية باستخدام هذه التكنولوجيا الحديثة.`,
    contentEn: `In the evolving business world, the NFC-enabled digital business card is one of the most significant innovations that have changed how we exchange information. Unlike traditional paper business cards, which can easily be lost or damaged, the NFC-enabled digital card allows for instant data transfer just by bringing the smartphone close to it.

What Are the Benefits of Digital Business Cards?
Digital business cards offer several advantages over traditional cards:

Instant Updates
When your contact information changes, such as a new phone number or email, you can easily update the data in the system, ensuring everyone gets the latest version right away, without needing to reprint new cards.

Quick and Direct Interaction
You can include direct links to websites, social media accounts, and even company presentations or catalogs, enhancing effective communication with clients and partners.

Environmental Benefits
By using a digital business card, the need for printing millions of paper cards is eliminated, helping reduce paper waste and contributing to environmental conservation.

Unique Customization that Reflects Your Identity
The digital card allows you to customize the design and include content like videos and presentations, showcasing your professional identity more effectively.

Professionalism and Credibility Boost
Using a digital business card gives a strong impression of your professionalism and shows that you're adopting advanced technological solutions.

Conclusion
The NFC-enabled digital business card is more than just a communication tool; it's an innovation that strengthens your professional network in an easy and efficient way. With instant updates and environmental benefits, this card offers a more professional way to build business relationships.

Is It Time to Adopt a Digital Business Card?
Start upgrading your communication method now and take advantage of the opportunity to enhance your professional relationships with this modern technology.`,
  },
];

interface BlogDetailsProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function BlogDetails({ params }: BlogDetailsProps) {
  const { locale, id } = params;
  const blogId = parseInt(id);
  const blog = blogs.find((blog) => blog.id === blogId);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const content = locale === 'ar' ? blog.contentAr : blog.contentEn;
  const title = locale === 'ar' ? blog.titleAr : blog.titleEn;


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Image
          src={blog.image}
          alt={title}
          className="w-full h-auto rounded-lg shadow-lg mt-3"
        />
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
                {content}
              </div>
            </article>
          </div>

        </div>
        <div className="mt-6 lg:mx-0">
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
