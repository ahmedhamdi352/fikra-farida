'use client';

type HomeContentProps = {
  data: {
    title: string;
    description: string;
  };
};

export default function HomeContent({ data }: HomeContentProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 animate-fadeIn">{data.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 animate-fadeIn [animation-delay:200ms]">
        {data.description}
      </p>
    </div>
  );
}
