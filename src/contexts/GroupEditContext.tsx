'use client';
import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { GroupResponseDTO } from 'types';

interface GroupEditContextType {
  groupToEdit: GroupResponseDTO | null;
  setGroupToEdit: (group: GroupResponseDTO | null) => void;
  clearGroupToEdit: () => void;
}

const STORAGE_KEY = 'group-edit-context';
const GroupEditContext = createContext<GroupEditContextType | undefined>(undefined);

export function GroupEditProvider({ children }: { children: ReactNode }) {
  const [groupToEdit, setGroupState] = useState<GroupResponseDTO | null>(null);

  // Only load from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only set if we don't already have a group to edit
        if (!groupToEdit) {
          setGroupState(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load group edit state:', error);
    }
    // We only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (groupToEdit) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groupToEdit));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [groupToEdit]);

  // Clear the state after a short delay when navigating away
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setGroupState(null);
  //     localStorage.removeItem(STORAGE_KEY);
  //   }, 300); // Short delay to allow navigation to complete
  //   return () => clearTimeout(timer);
  // }, []);

  const setGroupToEdit = useCallback((group: GroupResponseDTO | null) => {
    setGroupState(group);
  }, []);

  const clearGroupToEdit = useCallback(() => {
    setGroupState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      groupToEdit,
      setGroupToEdit,
      clearGroupToEdit,
    }),
    [groupToEdit, setGroupToEdit, clearGroupToEdit]
  );

  return <GroupEditContext.Provider value={value}>{children}</GroupEditContext.Provider>;
}

export function useGroupEdit() {
  const context = useContext(GroupEditContext);
  if (context === undefined) {
    throw new Error('useGroupEdit must be used within a GroupEditProvider');
  }
  return context;
}
