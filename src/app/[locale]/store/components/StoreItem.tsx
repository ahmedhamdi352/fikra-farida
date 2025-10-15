import { MutableRefObject, useState } from 'react';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import Image from 'next/image';
import { useAddLinkMutation, useUpdateLinkMutation, useDeleteLinkMutation } from 'hooks/links';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useTranslations } from 'next-intl';

interface App {
  id: string;
  name: string;
  iconurl: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

interface StoreItemProps {
  categoryId: string;
  category: Category;
  categoryApps: App[];
  categoryRefs: MutableRefObject<{ [key: string]: HTMLDivElement }>;
  activeCategory: string;
  profileData?: { links?: ProfileLink[] };
}

const getButtonConfig = (
  appId: string,
  t: ReturnType<typeof useTranslations<'storePage'>>,
  profileData?: { links?: ProfileLink[] }
): { type: 'add' | 'update'; label: string; color: string } => {
  // Function to check if an app exists in the user's profile links
  const getProfileLink = (appId: string): ProfileLink | undefined => {
    if (!profileData?.links) return undefined;
    return profileData.links.find(link => link.title.toLowerCase() === appId.toLowerCase());
  };

  const profileLink = getProfileLink(appId);

  if (!profileLink) {
    return { type: 'add', label: t('add'), color: 'bg-[--main-color1]' };
  }

  return { type: 'update', label: t('update'), color: 'bg-[--main-color1]' };
};

// Function to construct the proper URL for each platform type
const constructSocialMediaUrl = (platform: string, username: string): string => {
  // Remove @ symbol if present for social media handles
  const cleanUsername = username.startsWith('@') ? username.substring(1) : username;

  // Convert platform to lowercase for case-insensitive matching
  const platformLower = platform.toLowerCase();

  // Special handling for phone numbers
  if (platformLower === 'businessphone' || platformLower === 'hotline') {
    // Clean the phone number - remove spaces, dashes, parentheses
    const cleanPhone = cleanUsername.replace(/[\s\-()]/g, '');
    return `tel:${cleanPhone}`;
  }

  // Special handling for email
  if (platformLower === 'businessemail') {
    return `mailto:${cleanUsername}`;
  }

  // Special handling for maps/address - use as is
  if (platformLower === 'address') {
    // For maps, we use the full URL as entered by the user without modification
    return cleanUsername;
  }

  // Map of platform IDs to their URL formats
  const platformUrlFormats: Record<string, string> = {
    // Social Media
    'facebook': 'https://facebook.com/',
    'instagram': 'https://instagram.com/',
    'twitter': 'https://twitter.com/',
    'x': 'https://x.com/',
    'linkedin': 'https://linkedin.com/in/',
    'youtube': 'https://youtube.com/',
    'tiktok': 'https://tiktok.com/@',
    'pinterest': 'https://pinterest.com/',
    'snapchat': 'https://snapchat.com/add/',
    'quora': 'https://quora.com/profile/',
    'reddit': 'https://reddit.com/user/',
    'clubhouse': 'https://clubhouse.com/@',

    // Chatting
    'whatsapp': 'https://wa.me/',
    'messenger': 'https://m.me/',
    'telegram': 'https://t.me/',
    'signal': 'https://signal.me/#p/',
    'webchat': 'https://web.wechat.com/',
    'line': 'https://line.me/ti/p/',
    'imo': 'https://imo.im/',
    'viber': 'viber://chat?number=',

    // Music
    'spotify': 'https://open.spotify.com/user/',
    'anghami': 'https://play.anghami.com/',
    'castbox': 'https://castbox.fm/',
    'soundcloud': 'https://soundcloud.com/',
    'applemusic': 'https://music.apple.com/',

    // Business
    'website': '',
    'paypal': 'https://paypal.me/',
    'medium': 'https://medium.com/@',
    'ted': 'https://ted.com/',

    // Meeting
    'skype': 'skype:',
    'zoom': 'https://zoom.us/j/',
    'googlemeet': 'https://meet.google.com/',
    'slack': 'https://slack.com/app_redirect?channel=',
    'facetime': 'facetime:',

    // Apps & Software
    'googleplay': 'https://play.google.com/store/apps/details?id=',
    'appstore': 'https://apps.apple.com/app/',
    'notion': 'https://notion.so/',
    'github': 'https://github.com/',
    'gitlab': 'https://gitlab.com/',
    'bitbucket': 'https://bitbucket.org/',
    'stackoverflow': 'https://stackoverflow.com/users/',
  };

  // Get the URL format for the platform, or use the username as is for custom/unknown platforms
  const urlFormat = platformUrlFormats[platformLower] || '';

  // For custom websites or platforms without a specific format
  if (platformLower === 'website' || platformLower === 'addalink' || !urlFormat) {
    // If it's already a full URL, use it as is
    if (cleanUsername.startsWith('http://') || cleanUsername.startsWith('https://')) {
      return cleanUsername;
    }
    // Otherwise, add https:// prefix
    return `https://${cleanUsername}`;
  }

  // For all other platforms, append the username to the URL format
  return urlFormat + cleanUsername;
};

const StoreItem = ({ categoryId, category, categoryApps, categoryRefs, profileData }: StoreItemProps): React.ReactNode => {
  const t = useTranslations('storePage');
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [username, setUsername] = useState('');
  const { onAddLink, isLoading: isAddingLoading } = useAddLinkMutation();
  const { onUpdateLink, isLoading: isUpdatingLoading } = useUpdateLinkMutation();
  const { onDeleteLink, isLoading: isDeletingLoading } = useDeleteLinkMutation();
  const isSubmittingLoading = isAddingLoading || isUpdatingLoading || isDeletingLoading;

  // Function to get existing link data if it exists
  const getExistingLinkData = (appId: string): ProfileLink | undefined => {
    if (!profileData?.links) return undefined;
    return profileData.links.find(link => link.title.toLowerCase() === appId.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      // Check if username is already a full URL
      const isFullUrl = username.startsWith('http://') || username.startsWith('https://');
      // Construct the proper URL for the social media platform
      const fullUrl = isFullUrl ? username : constructSocialMediaUrl(selectedApp.id, username);
      const existingLink = getExistingLinkData(selectedApp.id);

      if (existingLink) {
        await onUpdateLink({
          pk: existingLink.pk,
          url: fullUrl,
          title: existingLink.title,
          iconurl: existingLink.iconurl,
          type: existingLink.type,
          sort: existingLink.sort,
        });
      } else {
        await onAddLink({
          title: selectedApp.id,
          url: fullUrl,
          iconurl: selectedApp.iconurl,
          type: 0,
          sort: profileData?.links?.length || 0,
        });
      }

      setIsModalOpen(false);
      setSelectedApp(null);
      setUsername('');
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  };

  if (isSubmittingLoading) {
    return <LoadingOverlay isLoading={isSubmittingLoading} />;
  }
  return (
    <div
      ref={el => {
        if (el) {
          categoryRefs.current[categoryId] = el;
        }
      }}
      data-category={categoryId}
      className="mb-8"
    >
      <h2 className="text-xl font-bold mb-4 text-[--main-color1] dark:text-white">{category.name}</h2>
      <div className="flex flex-col space-y-2">
        {categoryApps.map((app: App) => {
          const buttonConfig = getButtonConfig(app.id, t, profileData);
          return (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 rounded-lg card-container shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-22 h-22 rounded-full overflow-hidden relative flex-shrink-0 mr-3">
                  <Image
                    src={`${baseIconsUrl}${app.iconurl}`}
                    alt={app.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{app.name}</span>
              </div>
              <button
                className="py-1 px-4 text-xs text-[--main-color1] rounded-[125px] border border-[#FEC400] bg-[rgba(254,196,0,0.20)] flex items-center justify-center gap-1"
                onClick={() => {
                  setSelectedApp(app);
                  const existingLink = getExistingLinkData(app.id);
                  if (existingLink && buttonConfig.type === 'update') {
                    setUsername(existingLink.url || '');
                  } else {
                    setUsername('');
                  }
                  setIsModalOpen(true);
                }}
              >
                <span>{buttonConfig.label}</span>
                {buttonConfig.type === 'add' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 4V20M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal for adding/updating app */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-6 mt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0 mr-4">
                <Image
                  src={`${baseIconsUrl}${selectedApp.iconurl}`}
                  alt={selectedApp.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white">{selectedApp.name}</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder={`${selectedApp.name} username`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLoading}
                className="w-full py-3 bg-[--main-color1] text-black font-medium rounded-lg flex items-center justify-center"
              >
                {isSubmittingLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('processing')}
                  </span>
                ) : (
                  `${getButtonConfig(selectedApp?.id || '', t, profileData).type === 'update' ? t('update') : t('add')} ${selectedApp?.name
                  }`
                )}
              </button>

              {/* Remove button only appears for existing links */}
              {selectedApp && getButtonConfig(selectedApp.id, t, profileData).type === 'update' && (
                <div className="mt-3">
                  <span
                    className="block text-center text-red-500 cursor-pointer hover:underline"
                    onClick={e => {
                      e.preventDefault();
                      // Find the link to delete
                      const linkToDelete = profileData?.links?.find(
                        link => link.title.toLowerCase() === selectedApp.id.toLowerCase()
                      );
                      if (linkToDelete?.pk) {
                        onDeleteLink(linkToDelete.pk);
                        setIsModalOpen(false); // Close modal after deletion
                      }
                    }}
                  >
                    {t('remove')}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreItem;
