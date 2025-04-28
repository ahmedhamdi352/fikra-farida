'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import Image from 'next/image';

interface SortableLinkProps {
  link: ProfileLink;
}

export const SortableLink = ({ link }: SortableLinkProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.pk });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-all duration-200 rounded-2xl mb-3"
    >
      <div className="flex items-center px-4 py-3">
        <button
          className="text-gray-400 hover:text-gray-300 transition-colors mr-3"
          {...listeners}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="currentColor" />
            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="currentColor" />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-3">
          <Image
            src={`https://fikrafarida.com/Media/icons/${link.iconurl}`}
            alt={link.title}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>

        <span className="text-white text-base flex-grow">{link.title}</span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={true}
          />
          <div className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]">
          </div>
        </label>
      </div>
    </div>
  );
};
