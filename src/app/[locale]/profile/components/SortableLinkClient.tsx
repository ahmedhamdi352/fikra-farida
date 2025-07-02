'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProfileLink } from 'types/api/ProfileForReadDTO';
import Image from 'next/image';

interface SortableLinkClientProps {
  link: ProfileLink;
}

export const SortableLinkClient = ({ link }: SortableLinkClientProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.pk });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 1,
    position: 'relative' as const,
    opacity: isDragging ? 0.6 : 1,
  };

  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-all duration-200 rounded-xl mb-3 border border-[#B0A18E]
                ${isDragging ? 'ring-2 ring-[#FEC400] shadow-lg scale-[1.02]' : ''}`}
    >
      <div className="flex items-center px-4 py-2">
        <button
          className="touch-none select-none -ml-1 p-1 text-[#B0A18E] hover:text-[#FEC400] active:text-[#FEC400] transition-colors mr-2
                    md:mr-3 relative before:content-[''] before:absolute before:inset-[-8px] before:bg-transparent"
          {...listeners}
          aria-label="Drag to reorder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="transform scale-90 md:scale-100"
          >
            <path
              d="M9.4098 7.2998H9.3998M14.5998 7.2998H14.5898M9.3098 11.9998H9.2998M14.5998 11.9998H14.5898M9.4098 16.6998H9.3998M14.5998 16.6998H14.5898"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-3">
          <Image
            src={`${baseIconsUrl}${link.iconurl}`}
            alt={link.title}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>

        <span className="text-white text-base flex-grow truncate">{link.title}</span>

        <label className="relative inline-flex items-center cursor-pointer ml-3">
          <input type="checkbox" className="sr-only peer" defaultChecked={true} />
          <div
            className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                      after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                      peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
          ></div>
        </label>
      </div>
    </div>
  );
};
