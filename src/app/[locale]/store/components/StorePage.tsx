'use client';

import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useGetProfileQuery } from 'hooks/profile';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import StoreItem from './StoreItem';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  name: string;
}

interface App {
  id: string;
  name: string;
  iconurl: string;
  category: string;
  type?: string;
  url?: string;
}

export default function StorePage() {
  const t = useTranslations('storePage');
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const categories: Category[] = [
    { id: 'socialMedia', name: t('socialMedia') },
    { id: 'chatting', name: t('chatting') },
    { id: 'business', name: t('business') },
    { id: 'meeting', name: t('meeting') },
    { id: 'payment', name: t('payment') },
    { id: 'creative', name: t('creative') },
    { id: 'music', name: t('music') },
    { id: 'workSpace', name: t('workSpace') },
  ];

  const apps: App[] = [
    //social media
    { id: 'facebook', name: 'Facebook', iconurl: 'facebook.svg',type: 'link', category: 'socialMedia' },
    { id: 'instagram', name: 'Instagram', iconurl: 'instagram.svg', type: 'username', category: 'socialMedia' , url:'https://instagram.com/' },
    { id: 'youtube', name: 'YouTube', iconurl: 'youtube.svg',type: 'link', category: 'socialMedia' },
    { id: 'tiktok', name: 'TikTok', iconurl: 'tiktok.svg',type: 'username', category: 'socialMedia' , url:'https://tiktok.com/' },
    { id: 'x', name: 'X', iconurl: 'x.svg',type: 'username', category: 'socialMedia' , url:'https://x.com/' },
    { id: 'snapchat', name: 'Snapchat', iconurl: 'snapchat.svg',type: 'username', category: 'socialMedia' , url:'https://snapchat.com/add/' },
    { id: 'linkedin', name: 'LinkedIn', iconurl: 'linkedin.svg',type: 'link', category: 'socialMedia' },
    { id: 'threads', name: 'Threads', iconurl: 'threads.svg',type: 'username', category: 'socialMedia' , url:'https://threads.net/' },
    { id: 'clubhouse', name: 'Clubhouse', iconurl: 'clubhouse.svg', type: 'link', category: 'socialMedia' },
    {id: 'vimeo', name: 'Vimeo', iconurl: 'vimeo.svg', type: 'link', category: 'socialMedia' },
   
    //chatting
    { id: 'mergencyPhone', name: 'Emergency Phone',  iconurl: 'phone.svg', type:'number', category: 'chatting' },
    { id: 'whatsapp', name: 'WhatsApp', iconurl: 'whatsapp.svg', type: 'number', category: 'chatting' },
    { id: 'messenger', name: 'Messenger', iconurl: 'messenger.svg', type: 'link', category: 'chatting' },
    { id: 'telegram', name: 'Telegram', iconurl: 'telegram.svg', type: 'username', category: 'chatting', url:'https://t.me/' },
    { id: 'webchat', name: 'WebChat', iconurl: 'wechat.svg', type:'link', category: 'chatting' },
    { id: 'viber', name: 'Viber', iconurl: 'viber.svg', type:'number', category: 'chatting' },
    {id:'faceTime', name: 'FaceTime', iconurl: 'facetime.svg', type:'number', category: 'chatting' },
    { id: 'imo', name: 'IMO', iconurl: 'imo.svg', type:'number', category: 'chatting' },
    { id: 'line', name: 'Line', iconurl: 'line.svg', type:'number', category: 'chatting' },
  
    //business
    { id: 'website', name: 'website', iconurl: 'globe.svg', type:'link', category: 'business' },
    { id: 'businessEmail', name: 'Business Email', iconurl: 'email.svg', type:'email', category: 'business' },
    { id: 'businessPhone', name: 'Business Phone', iconurl: 'phone.svg', type:'number', category: 'business' },
    { id: 'address', name: 'Address Location', iconurl: 'map.svg', type:'link' ,category: 'business' },
    {id:'WA Business', name: 'WhatsApp Business', iconurl: 'whatsappBusiness.svg', type:'number', category: 'business' },
    {id:"gmail", name: 'Gmail', iconurl: 'gmail.svg', type:'email', category: 'business' },
    {id:'googleReviews', name: 'Google Reviews', iconurl: 'googleReviews.svg', type:'link', category: 'business' },
    {id:'Trustpilot', name: 'Trustpilot', iconurl: 'trustpilot.svg', type:'link', category: 'business' },
    { id: 'notion', name: 'Notion', iconurl: 'notion.svg', type:'link', category: 'business' },
    {id:'googleForms', name: 'Google Forms', iconurl: 'googleForms.svg', type:'link', category: 'business' },
    { id: 'appStore', name: 'App Store', iconurl: 'appstore.svg', type:'link', category: 'business' },
    { id: 'googlePlay', name: 'Google Play', iconurl: 'googleplay.svg', type:'link', category: 'business' },

    //meeting
    { id: 'zoom', name: 'Zoom', iconurl: 'zoom.svg', type:'link', category: 'meeting' },
    { id: 'googleMeet', name: 'Google Meet', iconurl: 'googlemeet.svg', type:'link', category: 'meeting' },
    { id: 'slack', name: 'Slack', iconurl: 'slack.svg', type:'link', category: 'meeting' },
    {id:'calendly', name: 'Calendly', iconurl: 'calendly.svg', type:'link', category: 'meeting' },
    { id: 'skype', name: 'Skype', iconurl: 'skype.svg', type:'link', category: 'meeting' },
    { id: 'teams', name: 'Teams', iconurl: 'teams.svg', type:'link', category: 'meeting' },

    //payment
    { id: 'instapay', name: 'Instapay', iconurl: 'instapay.svg', type:'link', category: 'payment' },
    { id: 'telda', name: 'Telda', iconurl: 'telda.svg', type:'link', category: 'payment' },
    { id: 'wallets', name: 'Wallets', iconurl: 'wallets.svg', type:'number', category: 'payment' },
    { id: 'cashApp', name: 'Cash App', iconurl: 'cashApp.svg', type:'link', category: 'payment' },
    {id:'paypal', name: 'Paypal', iconurl: 'paypal.svg', type:'link', category: 'payment' },


    //creative
    { id: 'figma', name: 'Figma', iconurl: 'figma.svg', type:'link', category: 'creative' },
    { id: 'dribbble', name: 'Dribbble', iconurl: 'dribbble.svg', type:'link', category: 'creative' },
    { id: 'behance', name: 'Behance', iconurl: 'behance.svg', type:'link', category: 'creative' },
    { id: 'podcasts', name: 'Podcasts', iconurl: 'podcasts.svg', type:'link', category: 'creative' },
    { id: 'gitHub', name: 'GitHub', iconurl: 'github.svg', type:'link', category: 'creative' },
    { id: 'pinterest', name: 'Pinterest', iconurl: 'pinterest.svg', type:'link', category: 'creative' },
    { id: 'gitLab', name: 'GitLab', iconurl: 'gitlab.svg', type:'link', category: 'creative' },
    { id: 'medium', name: 'Medium', iconurl: 'medium.svg', type:'link', category: 'creative' },
    { id: 'ted', name: 'TED', iconurl: 'ted.svg', type:'link', category: 'creative' },
    // { id: 'StackOverflow', name: 'StackOverflow', iconurl: 'stackoverflow.svg', category: 'creative' },

      //music
      { id: 'spotify', name: 'Spotify', iconurl: 'spotify.svg', type:'username', category: 'music' },
      { id: 'appleMusic', name: 'Apple Music', iconurl: 'apple.svg', type:'link', category: 'music' },
      { id: 'soundcloud', name: 'Soundcloud', iconurl: 'soundcloud.svg', type:'username', category: 'music' },
      { id: 'anghami', name: 'Anghami', iconurl: 'anghami.svg', type:'username', category: 'music' },
      { id: 'castbox', name: 'Castbox', iconurl: 'castbox.svg', type:'link', category: 'music' },
      {id:'youtubeMusic', name: 'YouTube Music', iconurl: 'youtubeMusic.svg', type:'link', category: 'music' },
    //custom
    { id: 'addALink', name: 'Add a link', iconurl: 'link.svg', type:'customLink', category: 'workSpace' },
    { id: 'addAFile', name: 'Add a file', iconurl: 'file.svg', type:'customFile', category: 'workSpace' },
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
            className="rtl:rotate-180"
          >
            <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
          </svg>
        </Link>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('search')}
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
