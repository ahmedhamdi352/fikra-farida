import { useTranslations } from 'next-intl';
import LanguageSwitcher from 'components/LanguageSwitcher';
import ThemeSwitcher from 'components/ThemeSwitcher';
import Navigation from 'components/Navigation';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-end items-center gap-4 mb-4">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <Navigation />
      <h1 className="text-4xl font-bold mb-4">
        {t('title')}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {t('description')}
      </p>
    </main>
  );
}
