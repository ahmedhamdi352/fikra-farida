import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';
import { useState } from 'react';
// import { ProfileForReadDTO } from 'types';
// Define the interface for filter parameters
export interface ConnectionFilters {
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  connectUser1?: string;
  connectUser2?: string;
}

export function useGetConnectionQuery(initial?: { connectUser1?: string; connectUser2?: string }) {
  const [connectUser1, setConnectUser1] = useState<string | undefined>(initial?.connectUser1);
  const [connectUser2, setConnectUser2] = useState<string | undefined>(initial?.connectUser2);
  // const [connectUser1Profile, setConnectUser1Profile] = useState<ProfileForReadDTO | undefined>(undefined);
  // const [connectUser2Profile, setConnectUser2Profile] = useState<ProfileForReadDTO | undefined>(undefined);

  // const fetchPublicProfile = async (username: string) => {
  //   if (!username) return undefined;
  //   const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fikrafarida.com';
  //   const url = `${baseUrl}/api/Account/ProfileByName?username=${encodeURIComponent(username)}`;
  //   const res = await fetch(url, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //     cache: 'no-store',
  //   });
  //   if (!res.ok) return undefined;
  //   try {
  //     return await res.json();
  //   } catch {
  //     return undefined;
  //   }
  // };

  const mutation = useMutation({
    mutationKey: [ProfileService.getConnections.mutationKey],
    mutationFn: async (filters?: ConnectionFilters) => {
      try {
        // Merge incoming filters with initial state if not provided
        const merged: ConnectionFilters | undefined = {
          ...filters,
          connectUser1: filters?.connectUser1 ?? connectUser1,
          connectUser2: filters?.connectUser2 ?? connectUser2,
        };
        // keep latest connect users
        if (merged?.connectUser1) setConnectUser1(merged.connectUser1);
        if (merged?.connectUser2) setConnectUser2(merged.connectUser2);
        // Pass filters to your service method
        const response = await ProfileService.getConnections.request(merged);
        // // In parallel, fetch public profiles for connect users if provided
        // const [p1, p2] = await Promise.all([
        //   merged?.connectUser1 ? fetchPublicProfile(merged.connectUser1) : Promise.resolve(undefined),
        //   merged?.connectUser2 ? fetchPublicProfile(merged.connectUser2) : Promise.resolve(undefined),
        // ]);
        // setConnectUser1Profile(p1);
        // setConnectUser2Profile(p2);

        // Append the two public profiles to the response data
        const originalConnections = response || [];
        // const additionalProfiles: any[] = [];

        // if (p1) {
        //   additionalProfiles.push({
        //     ...p1,
        //     title: p1?.bio,
        //     phone: p1?.phoneNumber1,
        //   });
        // }
        // if (p2) {
        //   additionalProfiles.push({
        //     ...p2,
        //     title: p2?.bio,
        //     phone: p2?.phoneNumber1,
        //   });
        // }

        // Return original connections + the two public profiles
        return [...originalConnections];
      } catch (error) {
        console.error('Connection fetch error:', error);
        throw error;
      }
    },
  });

  const onGetConnections = (filters?: ConnectionFilters) => {
    try {
      // Pass filters as a single object parameter to mutate
      mutation.mutate(filters);
    } catch (error) {
      console.error('Error triggering Connection fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getConnections.mutationKey);

  return {
    data: mutation.data,
    connectUser1,
    connectUser2,
    // connectUser1Profile,
    // connectUser2Profile,
    isLoading,
    error: mutation.error,
    onGetConnections,
  };
}
