import { MutableRefObject } from 'react';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import Image from 'next/image';

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
  profileData?: { links?: ProfileLink[] }
): { type: 'add' | 'update'; label: string; color: string } => {
  // Function to check if an app exists in the user's profile links
  const getProfileLink = (appId: string): ProfileLink | undefined => {
    if (!profileData?.links) return undefined;
    return profileData.links.find(link => link.title.toLowerCase() === appId.toLowerCase());
  };

  const profileLink = getProfileLink(appId);

  if (!profileLink) {
    return { type: 'add', label: 'Add', color: 'bg-[--main-color1]' };
  }

  return { type: 'update', label: 'Update', color: 'bg-[--main-color1]' };
};

const StoreItem: React.FC<StoreItemProps> = ({ categoryId, category, categoryApps, categoryRefs, profileData }) => {
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

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
          const buttonConfig = getButtonConfig(app.id, profileData);
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
                  console.log(`${buttonConfig.type} ${app.name}`);
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
    </div>
  );
};

export default StoreItem;
