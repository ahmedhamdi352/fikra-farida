'use client';

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLink } from './SortableLink';
import { ProfileLink } from 'types/api/ProfileForReadDTO';

interface DraggableUserLinksProps {
  links: ProfileLink[];
  onLinksChange: (links: ProfileLink[]) => void;
}

export const DraggableUserLinks: React.FC<DraggableUserLinksProps> = ({ links, onLinksChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.pk === active.id);
      const newIndex = links.findIndex((item) => item.pk === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      onLinksChange(newLinks);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map(link => ({ id: link.pk }))}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {links.map((link) => (
            <SortableLink key={link.pk} link={link} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
