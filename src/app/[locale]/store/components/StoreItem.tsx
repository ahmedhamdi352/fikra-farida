import { MutableRefObject, useState, useRef, useEffect } from 'react';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import Image from 'next/image';
import { useAddLinkMutation, useUpdateLinkMutation, useDeleteLinkMutation } from 'hooks/links';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { useTranslations } from 'next-intl';
import { LinksService } from 'api/services/LinksService';
import { useForm } from 'react-hook-form';
import { PhoneInput } from 'components/forms/phone-input';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';

interface App {
  id: string;
  name: string;
  iconurl: string;
  category: string;
  type?: string;
  url?: string;
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
  appType?: string,
  appIconUrl?: string,
  t?: ReturnType<typeof useTranslations<'storePage'>>,
  profileData?: { links?: ProfileLink[] }
): { type: 'add' | 'update'; label: string; color: string } => {
  if (!t) {
    return { type: 'add', label: 'Add', color: 'bg-[--main-color1]' };
  }

  // For customLink and customFile, always show "Add" since users can add multiple
  if (appType === 'customLink' || appType === 'customFile') {
    return { type: 'add', label: t('add'), color: 'bg-[--main-color1]' };
  }

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

interface PhoneFormData {
  phoneNumber: string;
}

const StoreItem = ({ categoryId, category, categoryApps, categoryRefs, profileData }: StoreItemProps): React.ReactNode => {
  const t = useTranslations('storePage');
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [username, setUsername] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onAddLink, isLoading: isAddingLoading } = useAddLinkMutation();
  const { onUpdateLink, isLoading: isUpdatingLoading } = useUpdateLinkMutation();
  const { onDeleteLink, isLoading: isDeletingLoading } = useDeleteLinkMutation();
  const isSubmittingLoading = isAddingLoading || isUpdatingLoading || isDeletingLoading || isUploading;
  
  // State to track phone number for PhoneInput (needed to force re-render)
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  
  // Form control for phone input (only used when type is 'number')
  const { control: phoneControl, watch: watchPhone, reset: resetPhoneForm } = useForm<PhoneFormData>({
    defaultValues: {
      phoneNumber: '',
    },
  });
  
  // Update form when phoneNumberValue changes
  useEffect(() => {
    if (isModalOpen && selectedApp?.type === 'number') {
      resetPhoneForm({ phoneNumber: phoneNumberValue });
    }
  }, [phoneNumberValue, isModalOpen, selectedApp?.type, resetPhoneForm]);

  // Function to get existing link data if it exists
  const getExistingLinkData = (appId: string, appIconUrl?: string): ProfileLink | undefined => {
    if (!profileData?.links) return undefined;
    // For customLink and customFile, match by iconurl since title might be custom
    if (appId === 'addALink' || appId === 'addAFile') {
      return profileData.links.find(link => link.iconurl === appIconUrl);
    }
    // For other apps, match by title
    return profileData.links.find(link => link.title.toLowerCase() === appId.toLowerCase());
  };

  // Extract username from URL for username type apps
  const extractUsernameFromUrl = (url: string, baseUrl: string): string => {
    if (!baseUrl || !url.startsWith(baseUrl)) {
      return url;
    }
    return url.replace(baseUrl, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const appType = selectedApp.type || 'link';

      // Handle customLink type (name + URL)
      if (appType === 'customLink') {
        let finalUrl = linkUrl.trim();
        if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = `https://${finalUrl}`;
        }

        await onAddLink({
          title: linkName.trim() || selectedApp.id,
          url: finalUrl,
          iconurl: selectedApp.iconurl,
          type: 10,
          sort: profileData?.links?.length || 0,
        });

        setIsModalOpen(false);
        setSelectedApp(null);
        setLinkName('');
        setLinkUrl('');
        return;
      }

      // Handle customFile type (name + file upload)
      if (appType === 'customFile') {
        if (!selectedFile) {
          alert('Please select a file');
          return;
        }

        setIsUploading(true);
        try {
          // First, add the link with a placeholder URL
          const addLinkResponse = await onAddLink({
            title: linkName.trim() || selectedApp.id,
            url: '', // Empty URL for file type
            iconurl: selectedApp.iconurl,
            type: 11,
            sort: profileData?.links?.length || 0,
          });

          // Get the link ID from the response - the response has a 'link' property with the link data
          interface AddLinkResponse {
            link?: { pk: number };
            pk?: number;
            data?: { pk: number };
            linkPk?: number;
            id?: number;
          }
          const response = addLinkResponse as AddLinkResponse;
          const linkPk = response?.link?.pk || 
                       addLinkResponse?.pk || 
                       response?.data?.pk || 
                       (typeof addLinkResponse === 'number' ? addLinkResponse : null) ||
                       response?.linkPk ||
                       response?.id;

          if (!linkPk) {
            console.error('Response structure:', JSON.stringify(addLinkResponse, null, 2));
            throw new Error('Failed to get link ID from response');
          }

          await LinksService.uploadLinkFile.request(linkPk, selectedFile);
          
          // Refetch profile data after file upload
          queryClient.invalidateQueries({ queryKey: [ProfileService.getProfile.queryKey] });
          try {
            await ProfileService.getProfile.request();
          } catch (error) {
            console.error('Error refetching profile after file upload:', error);
          }

        } catch (error) {
          console.error('Error in file upload process:', error);
          alert('Failed to upload file. Please try again.');
          throw error;
        } finally {
          setIsUploading(false);
        }

        setIsModalOpen(false);
        setSelectedApp(null);
        setLinkName('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Handle other types (existing logic)
      let finalUrl = '';

      // Handle different types
      if (appType === 'username' && selectedApp.url) {
        // For username type: add base URL + username
        const cleanUsername = username.trim().replace(/^@/, ''); // Remove @ if present
        finalUrl = selectedApp.url + cleanUsername;
      } else if (appType === 'link') {
        // For link type: use as-is, but add https:// if not present
        finalUrl = username.trim();
        if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = `https://${finalUrl}`;
        }
      } else if (appType === 'number') {
        // For number type: get value from phone form
        let phoneNumber = watchPhone('phoneNumber') || username.trim();
        // If app has a url property (like tel:), prepend it to the phone number
        if (selectedApp.url) {
          // Remove the url prefix if already present to avoid duplication
          phoneNumber = phoneNumber.replace(new RegExp(`^${selectedApp.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '');
          finalUrl = selectedApp.url + phoneNumber;
        } else {
          finalUrl = phoneNumber;
        }
      } else if (appType === 'email') {
        // For email type: use as-is, but if app has a url property (like mailto:), prepend it
        let emailValue = username.trim();
        if (selectedApp.url) {
          // Remove the url prefix if already present to avoid duplication
          emailValue = emailValue.replace(new RegExp(`^${selectedApp.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '');
          finalUrl = selectedApp.url + emailValue;
        } else {
          finalUrl = emailValue;
        }
      } else if (appType === 'custom') {
        // For custom type: use as-is, add https:// if not present
        finalUrl = username.trim();
        if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = `https://${finalUrl}`;
        }
      }

      const existingLink = getExistingLinkData(selectedApp.id, selectedApp.iconurl);

      if (existingLink) {
        await onUpdateLink({
          pk: existingLink.pk,
          url: finalUrl,
          title: existingLink.title,
          iconurl: existingLink.iconurl,
          type: existingLink.type,
          sort: existingLink.sort,
        });
      } else {
        await onAddLink({
          title: selectedApp.id,
          url: finalUrl,
          iconurl: selectedApp.iconurl,
          type: 0,
          sort: profileData?.links?.length || 0,
        });
      }

      setIsModalOpen(false);
      setSelectedApp(null);
      setUsername('');
      setPhoneNumberValue('');
    } catch (error) {
      console.error('Error adding link:', error);
      setIsUploading(false);
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
          const buttonConfig = getButtonConfig(app.id, app.type, app.iconurl, t, profileData);
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
                  const existingLink = getExistingLinkData(app.id, app.iconurl);
                  
                  // Reset all form fields
                  setUsername('');
                  setLinkName('');
                  setLinkUrl('');
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }

                  if (existingLink && buttonConfig.type === 'update') {
                    // Extract username from URL if type is username
                    if (app.type === 'username' && app.url && existingLink.url) {
                      const extractedUsername = extractUsernameFromUrl(existingLink.url, app.url);
                      setUsername(extractedUsername);
                    } else if (app.type === 'number') {
                      // For number type, set phone value
                      // Check if the stored value already has country code or tel: prefix
                      const phoneValue = existingLink.url || '';
                      let formattedPhone = phoneValue;
                      
                      // Remove tel: prefix if present (we'll add it back on save)
                      if (app.url && phoneValue.startsWith(app.url)) {
                        formattedPhone = phoneValue.substring(app.url.length);
                      }
                      
                      // If it doesn't start with +, try to format it
                      if (formattedPhone && !formattedPhone.startsWith('+')) {
                        // If it starts with 0 (common in Egypt), replace with +20
                        if (formattedPhone.startsWith('0')) {
                          formattedPhone = '+20' + formattedPhone.substring(1);
                        } else {
                          // Assume it's already without country code, add default (Egypt +20)
                          formattedPhone = '+20' + formattedPhone;
                        }
                      }
                      
                      // If it already has +, use it as is (e.g., "+201115826263")
                      setPhoneNumberValue(formattedPhone || '');
                      setUsername(existingLink.url || '');
                    } else if (app.type === 'email') {
                      // For email type, remove mailto: prefix if present (we'll add it back on save)
                      let emailValue = existingLink.url || '';
                      if (app.url && emailValue.startsWith(app.url)) {
                        emailValue = emailValue.substring(app.url.length);
                      }
                      setUsername(emailValue);
                    } else {
                      setUsername(existingLink.url || '');
                    }
                  } else if (app.type === 'number') {
                    // Reset phone value when opening modal for new entry
                    setPhoneNumberValue('');
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
              {/* Custom Link Form (name + URL) */}
              {selectedApp.type === 'customLink' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter link name"
                      value={linkName}
                      onChange={e => setLinkName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1]"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      placeholder="Enter link URL"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1]"
                      required
                    />
                  </div>
                </>
              )}

              {/* Custom File Form (name + file upload) */}
              {selectedApp.type === 'customFile' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter file name"
                      value={linkName}
                      onChange={e => setLinkName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1]"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        setSelectedFile(file || null);
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[--main-color1] file:text-black hover:file:bg-[--main-color1]/90"
                      required
                    />
                    {selectedFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Regular Form (for other types) */}
              {selectedApp.type !== 'customLink' && selectedApp.type !== 'customFile' && (
                <div className="mb-6">
                  {selectedApp.type === 'number' ? (
                    <PhoneInput
                      key={`phone-input-${selectedApp.id}-${phoneNumberValue || 'new'}`}
                      name="phoneNumber"
                      control={phoneControl}
                      placeholder={`Enter ${selectedApp.name} number`}
                      defaultCountry="eg"
                      defaultValue={phoneNumberValue || ''}
                    />
                  ) : (
                    <>
                      <input
                        type={
                          selectedApp.type === 'email' ? 'email' :
                          'text'
                        }
                        placeholder={
                          selectedApp.type === 'username' ? `Enter ${selectedApp.name} username` :
                          selectedApp.type === 'link' ? `Enter ${selectedApp.name} link` :
                          selectedApp.type === 'email' ? `Enter ${selectedApp.name} email` :
                          `Enter ${selectedApp.name}`
                        }
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[--main-color1]"
                        required
                      />
                      {selectedApp.type === 'username' && (
                        <p className="text-xs text-gray-500 mt-1">
                          We need only username
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

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
                  `${getButtonConfig(selectedApp?.id || '', selectedApp?.type, selectedApp?.iconurl, t, profileData).type === 'update' ? t('update') : t('add')} ${selectedApp?.name
                  }`
                )}
              </button>

              {/* Remove button only appears for existing links (not for customLink/customFile) */}
              {selectedApp && selectedApp.type !== 'customLink' && selectedApp.type !== 'customFile' && getButtonConfig(selectedApp.id, selectedApp.type, selectedApp.iconurl, t, profileData).type === 'update' && (
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
