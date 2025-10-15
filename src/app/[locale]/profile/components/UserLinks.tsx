'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MeasuringStrategy,
  closestCenter,
  type Modifier,
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
import { useTranslations } from 'next-intl';

interface UserLinksProps {
  profileLinks?: ProfileLink[];
  onLinksChange?: (links: ProfileLink[]) => void;
}

export const UserLinks = ({ profileLinks, onLinksChange }: UserLinksProps) => {
  const t = useTranslations('profile');
  const [links, setLinks] = useState<ProfileLink[]>(profileLinks || []);
  const lastPayloadRef = React.useRef<string | null>(null);
  const updateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { onUpdateBulkLinksSort } = useUpdateBulkLinksSortMutation();

  useEffect(() => {
    if (profileLinks) {
      const sortedLinks = [...(profileLinks || [])].sort((a, b) => (a.sort || 0) - (b.sort || 0));
      setLinks(sortedLinks);
    }
  }, [profileLinks]);

  const sensors = useSensors(
    // Use movement distance to start the drag; feels smoother on touch
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Local vertical-axis restriction modifier (avoids extra dependency)
  const restrictToVerticalAxis: Modifier = ({ transform }) => {
    return { ...transform, x: 0 };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks(items => {
        const oldIndex = items?.findIndex(item => item.pk === active.id);
        const newIndex = items?.findIndex(item => item.pk === over.id);

        const newLinks = arrayMove(items, oldIndex, newIndex);
        onLinksChange?.(newLinks);
        const payload = newLinks.map((link, index) => ({ pk: link.pk, sort: index + 1 }));
        const payloadKey = JSON.stringify(payload);

        // Debounce and de-duplicate identical payloads to avoid double calls
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
        updateTimerRef.current = setTimeout(() => {
          if (lastPayloadRef.current !== payloadKey) {
            lastPayloadRef.current = payloadKey;
            onUpdateBulkLinksSort(payload);
          }
        }, 150);
        return newLinks;
      });
    }
  };

  return (
    <div className="w-full max-w-screen-md py-8">
      <div className="rounded-[32px] p-8 card-container backdrop-blur-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#FEC400] text-2xl font-semibold">{t('myLinks')}</h2>
          <span className="text-white text-lg">({links.length} {t('links')})</span>
        </div>

        <DndContext
          sensors={sensors}
          // closestCenter tends to avoid index jumps in vertical lists on touch
          collisionDetection={closestCenter}
          autoScroll
          onDragEnd={handleDragEnd}
          // continuously measure droppables to improve accuracy on mobile
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          // Limit movement to vertical axis to reduce jitter
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={links.map(link => link.pk)} strategy={verticalListSortingStrategy}>
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
