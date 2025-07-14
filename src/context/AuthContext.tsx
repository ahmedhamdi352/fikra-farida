'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthForReadDTo, Profile } from '../types/api/AuthForReadDTo';
import { ProfileService } from 'api';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  profiles: Profile[];
  activeProfile: Profile | null;
  setAuth: (loginResponse: AuthForReadDTo) => void;
  switchProfile: (profileId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILES_STORAGE_KEY = 'user_profiles';
const ACTIVE_PROFILE_KEY = 'active_profile_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Load profiles from localStorage
    const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const storedActiveProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);

    if (storedProfiles) {
      try {
        const parsedProfiles: Profile[] = JSON.parse(storedProfiles);
        setProfiles(parsedProfiles);

        // Set active profile
        if (storedActiveProfileId && parsedProfiles.length > 0) {
          const activeProfileId = parseInt(storedActiveProfileId, 10);
          const profile = parsedProfiles.find(p => p.userPk === activeProfileId) ||
            parsedProfiles.find(p => p.isDefault) ||
            parsedProfiles[0];

          if (profile) {
            setActiveProfile(profile);
            setToken(profile.token);

            // Update cookie with current token
            Cookies.set('token', profile.token, {
              expires: 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse stored profiles:', error);
        // Clear invalid data
        localStorage.removeItem(PROFILES_STORAGE_KEY);
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } else {
      // Fallback to old token method for backward compatibility
      const storedToken = Cookies.get('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const setAuth = (loginResponse: AuthForReadDTo) => {
    if (loginResponse && loginResponse.profiles && loginResponse.profiles.length > 0) {
      setProfiles(loginResponse.profiles);
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(loginResponse.profiles));

      const defaultProfile = loginResponse.profiles.find(profile => profile.isDefault) || loginResponse.profiles[0];
      setActiveProfile(defaultProfile);
      setToken(defaultProfile.token);

      localStorage.setItem(ACTIVE_PROFILE_KEY, defaultProfile.userPk.toString());

      Cookies.set('token', defaultProfile.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } else if (loginResponse && loginResponse.token) {
      setToken(loginResponse.token);
      Cookies.set('token', loginResponse.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      localStorage.setItem('token', loginResponse.token);
    }
  };

  const switchProfile = async (profileId: number) => {

    const profile = profiles.find(p => p.userPk === profileId);
    if (profile) {
      setActiveProfile(profile);
      setToken(profile.token);

      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId.toString());

      Cookies.set('token', profile.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      //
      await queryClient.invalidateQueries({
        queryKey: [ProfileService.getProfile.queryKey],
      });
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem(PROFILES_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    setToken(null);
    setProfiles([]);
    setActiveProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!token,
      token,
      profiles,
      activeProfile,
      setAuth,
      switchProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
