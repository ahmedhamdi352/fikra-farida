import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import { ProfileForCreateDTO, ProfileForReadDTO } from 'types';
import { Profile } from 'types/api/AuthForReadDTo';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useRouter } from 'next/navigation';

// Helper function to convert ProfileForReadDTO to Profile format for AuthContext
const mapProfileDTOToProfile = (profileDTO: ProfileForReadDTO): Profile => {
  return {
    userPk: profileDTO.userPk,
    username: profileDTO.username,
    email: profileDTO.email,
    fullname: profileDTO.fullname,
    imageFilename: profileDTO.imageFilename,
    token: profileDTO.token,
    expire_date: profileDTO.subscriptionEnddate,
    isDefault: false, // Default value, may need to be determined by other logic
  };
};

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: [ProfileService.addProfile.mutationKey],
    mutationFn: ProfileService.addProfile.request,
    onSuccess: async response => {
      if (!response) {
        SnackbarUtils.error('Failed to create profile');
        return;
      }

      if(!response.sucess) {
        SnackbarUtils.error(response.message || 'Failed to create profile');
        return;
      }

      // Invalidate and refetch the profiles list
      await queryClient.invalidateQueries({
        queryKey: [ProfileService.getProfiles.queryKey],
      });

      // Fetch the latest profiles data
      try {
        const profilesResponse = await ProfileService.getProfiles.request();
        if (profilesResponse) {
          // Map API profiles to the format expected by AuthContext
          const mappedProfiles = profilesResponse.map(mapProfileDTOToProfile);

          // Store profiles in localStorage
          localStorage.setItem('user_profiles', JSON.stringify(mappedProfiles));
        }
      } catch (error) {
        console.error('Failed to fetch updated profiles after creation:', error);
      }

      SnackbarUtils.success('Profile Created Successfully');
      router.push('/profile');
    },
  });

  const onAddProfile = (payload: ProfileForCreateDTO) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.addProfile.mutationKey);

  return {
    ...mutation,
    isLoading,
    onAddProfile,
  };
}
