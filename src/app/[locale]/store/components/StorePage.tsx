'use client';

import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useGetProfileQuery } from 'hooks/profile';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import StoreItem from './StoreItem';

interface Category {
  id: string;
  name: string;
}

interface App {
  id: string;
  name: string;
  iconurl: string;
  category: string;
}

export default function StorePage() {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const categories: Category[] = [
    { id: 'socialMedia', name: 'Social Media' },
    { id: 'chatting', name: 'Chatting' },
    { id: 'music', name: 'Music' },
    { id: 'business', name: 'Business' },
    { id: 'meeting', name: 'Meeting' },
    { id: 'appsSoftware', name: 'Apps & Software' },
    { id: 'custom', name: 'Custom' },
  ];

  const apps: App[] = [
    //social media
    { id: 'facebook', name: 'Facebook', iconurl: 'facebook.svg', category: 'socialMedia' },
    { id: 'instagram', name: 'Instagram', iconurl: 'instagram.svg', category: 'socialMedia' },
    { id: 'youtube', name: 'YouTube', iconurl: 'youtube.svg', category: 'socialMedia' },
    { id: 'snapchat', name: 'Snapchat', iconurl: 'snapchat.svg', category: 'socialMedia' },
    { id: 'x', name: 'X', iconurl: 'twitter.svg', category: 'socialMedia' },
    { id: 'tiktok', name: 'TikTok', iconurl: 'tiktok.svg', category: 'socialMedia' },
    { id: 'pinterest', name: 'Pinterest', iconurl: 'pinterest.svg', category: 'socialMedia' },
    { id: 'linkedin', name: 'LinkedIn', iconurl: 'linkedin.svg', category: 'socialMedia' },
    { id: 'quora', name: 'Quora', iconurl: 'quora.svg', category: 'socialMedia' },
    { id: 'reddit', name: 'Reddit', iconurl: 'reddit.svg', category: 'socialMedia' },
    { id: 'clubhouse', name: 'Clubhouse', iconurl: 'clubhouse.svg', category: 'socialMedia' },
    //chatting
    { id: 'whatsapp', name: 'WhatsApp', iconurl: 'whatsapp.svg', category: 'chatting' },
    { id: 'messenger', name: 'Messenger', iconurl: 'messenger.svg', category: 'chatting' },
    { id: 'telegram', name: 'Telegram', iconurl: 'telegram.svg', category: 'chatting' },
    { id: 'signal', name: 'Signal', iconurl: 'signal.svg', category: 'chatting' },
    { id: 'webchat', name: 'WebChat', iconurl: 'wechat.svg', category: 'chatting' },
    { id: 'line', name: 'Line', iconurl: 'line.svg', category: 'chatting' },
    { id: 'imo', name: 'IMO', iconurl: 'imo.svg', category: 'chatting' },
    { id: 'viber', name: 'Viber', iconurl: 'viber.svg', category: 'chatting' },
    //music
    { id: 'spotify', name: 'Spotify', iconurl: 'spotify.svg', category: 'music' },
    { id: 'anghami', name: 'Anghami', iconurl: 'anghami.svg', category: 'music' },
    { id: 'castbox', name: 'Castbox', iconurl: 'castbox.svg', category: 'music' },
    { id: 'soundcloud', name: 'Soundcloud', iconurl: 'soundcloud.svg', category: 'music' },
    { id: 'appleMusic', name: 'Apple Music', iconurl: 'apple.svg', category: 'music' },
    //business
    { id: 'businessPhone', name: 'Business Phone', iconurl: 'phone.svg', category: 'business' },
    { id: 'businessEmail', name: 'Business Email', iconurl: 'email.svg', category: 'business' },
    { id: 'website', name: 'website', iconurl: 'globe.svg', category: 'business' },
    { id: 'hotline', name: 'hotline', iconurl: 'hotline.svg', category: 'business' },
    { id: 'address', name: 'address', iconurl: 'map.svg', category: 'business' },
    { id: 'paypal', name: 'paypal', iconurl: 'paypal.svg', category: 'business' },
    { id: 'medium', name: 'medium', iconurl: 'medium.svg', category: 'business' },
    { id: 'ted', name: 'TED', iconurl: 'ted.svg', category: 'business' },
    //meeting
    { id: 'skype', name: 'Skype', iconurl: 'skype.svg', category: 'meeting' },
    { id: 'zoom', name: 'Zoom', iconurl: 'zoom.svg', category: 'meeting' },
    { id: 'googleMeet', name: 'Google Meet', iconurl: 'googlemeet.svg', category: 'meeting' },
    { id: 'slack', name: 'Slack', iconurl: 'slack.svg', category: 'meeting' },
    { id: 'faceTime', name: 'FaceTime', iconurl: 'facetime.svg', category: 'meeting' },

    //apps&software
    { id: 'googlePlay', name: 'Google Play', iconurl: 'googleplay.svg', category: 'appsSoftware' },
    { id: 'appStore', name: 'App Store', iconurl: 'appstore.svg', category: 'appsSoftware' },
    { id: 'notion', name: 'Notion', iconurl: 'notion.svg', category: 'appsSoftware' },
    { id: 'github', name: 'Github', iconurl: 'github.svg', category: 'appsSoftware' },
    { id: 'gitlab', name: 'Gitlab', iconurl: 'gitlab.svg', category: 'appsSoftware' },
    { id: 'bitbucket', name: 'Bitbucket', iconurl: 'bitbucket.svg', category: 'appsSoftware' },
    { id: 'stackoverflow', name: 'Stackoverflow', iconurl: 'stackoverflow.svg', category: 'appsSoftware' },
    //custom
    { id: 'addALink', name: 'Add a link', iconurl: 'link.svg', category: 'custom' },
    { id: 'addAFile', name: 'Add a file', iconurl: 'file.svg', category: 'custom' },
  ];

  useEffect(() => {
    onGetProfile();
  }, []);

  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const categoryId = entry.target.getAttribute('data-category');
          if (!categoryId) return;

          setVisibleCategories(prev => {
            if (entry.isIntersecting && !prev.includes(categoryId)) {
              return [...prev, categoryId];
            } else if (!entry.isIntersecting && prev.includes(categoryId)) {
              return prev.filter(id => id !== categoryId);
            }
            return prev;
          });
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    // Observe all category sections
    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  // Filter apps based on search query
  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group filtered apps by category
  const appsByCategory = filteredApps.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = [];
    }
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, App[]>);

  return (
    <div className="min-h-screen w-full py-8 px-4">
      <div className="w-full max-w-screen-md mx-auto py-8 flex items-center gap-8">
        <Link href="/profile" className="flex items-center text-[--main-color1] gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
          </svg>
        </Link>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full p-3 pl-10 border border-[--main-color1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--main-color1] focus:border-transparent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-[--main-color1]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="pb-2 px-2">
        <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category: Category) => {
            const isVisible = visibleCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                  activeCategory === category.id || isVisible
                    ? 'bg-[--main-color1] text-black'
                    : 'bg-white dark:bg-transparent border border-[--main-color1] text-[--main-color1] hover:bg-[--main-color1] hover:text-black dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apps by Category */}
      <div className="px-2 pb-8">
        {Object.entries(appsByCategory).map(([categoryId, categoryApps]) => {
          const category = categories.find(c => c.id === categoryId) || { id: categoryId, name: categoryId };
          return (
            <StoreItem
              key={categoryId}
              categoryId={categoryId}
              category={category}
              categoryApps={categoryApps}
              categoryRefs={categoryRefs}
              activeCategory={activeCategory}
              profileData={profileData}
            />
          );
        })}
      </div>
    </div>
  );
}
