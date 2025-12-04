'use client';

import React, { useRef, useEffect } from 'react';
import DateFilterPopup from './DateFilterPopup';
import { useTranslations } from 'next-intl';

interface DateFilter {
  from: string;
  to: string;
}

interface DateFilterButtonProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  isFilterApplied?: boolean;
  buttonClassName?: string;
  iconClassName?: string;
}

const DateFilterButton: React.FC<DateFilterButtonProps> = ({
  dateFilter,
  onDateFilterChange,
  onApplyFilter,
  onClearFilter,
  isFilterApplied = false,
  buttonClassName = '',
  iconClassName = '',
}) => {
  const t = useTranslations('profile.connectionsPage');
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside the button container
      const isInsideButton = filterRef.current?.contains(target);
      
      // Check if click is inside the popup (works for both portal and non-portal)
      const popupElement = document.querySelector('[data-date-filter-popup]');
      const isInsidePopup = popupElement?.contains(target);
      
      // Only close if click is outside both button and popup
      if (!isInsideButton && !isInsidePopup) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      // Use a small delay to avoid immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showFilterDropdown]);

  const handleApplyFilter = () => {
    onApplyFilter();
    setShowFilterDropdown(false);
  };

  const handleClearFilter = () => {
    onClearFilter();
    setShowFilterDropdown(false);
  };

  return (
    <div className="relative inline-block" ref={filterRef} style={{ zIndex: showFilterDropdown ? 50 : 'auto' }}>
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className={`${buttonClassName || 'px-4 py-2 rounded-full font-medium whitespace-nowrap bg-gray-200 dark:bg-[#2A2A2A] hover:bg-gray-300 dark:hover:bg-[#3A3A3A]'} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--main-color1] ${
          isFilterApplied
            ? 'bg-[--main-color1] text-black'
            : ''
        }`}
        title={t('filterByDate')}
      >
        <svg
          className={`h-5 w-5 ${iconClassName}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M7 12h10m-7 6h4" />
        </svg>
      </button>

      <DateFilterPopup
        ref={popupRef}
        showFilterDropdown={showFilterDropdown}
        dateFilter={dateFilter}
        onClose={() => setShowFilterDropdown(false)}
        onDateFilterChange={onDateFilterChange}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />
    </div>
  );
};

export default DateFilterButton;

