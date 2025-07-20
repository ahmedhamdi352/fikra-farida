'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableLink } from './SortableLink';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import { useUpdateBulkLinksSortMutation } from 'hooks/profile';

interface UserLinksProps {
  profileLinks?: ProfileLink[];
  onLinksChange?: (links: ProfileLink[]) => void;
}

export const UserLinks = ({ profileLinks, onLinksChange }: UserLinksProps) => {
  const [links, setLinks] = useState<ProfileLink[]>(profileLinks || []);

  const { onUpdateBulkLinksSort } = useUpdateBulkLinksSortMutation();

  useEffect(() => {
    if (profileLinks) {
      const sortedLinks = [...(profileLinks || [])].sort((a, b) => (a.sort || 0) - (b.sort || 0));
      setLinks(sortedLinks);
    }
  }, [profileLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks(items => {
        const oldIndex = items?.findIndex(item => item.pk === active.id);
        const newIndex = items?.findIndex(item => item.pk === over.id);

        const newLinks = arrayMove(items, oldIndex, newIndex);
        onLinksChange?.(newLinks);
        onUpdateBulkLinksSort(newLinks.map((link, index) => ({ pk: link.pk, sort: index + 1 })));
        return newLinks;
      });
    }
  };

  return (
    <div className="w-full max-w-screen-md py-8">
      <div className="rounded-[32px] p-8 card-container backdrop-blur-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#FEC400] text-2xl font-semibold">My Links</h2>
          <span className="text-white text-lg">({links.length} Links)</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(link => ({ id: link.pk }))} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {links.map(link => (
                <SortableLink key={link.pk} link={link} totalCount={links.length} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
