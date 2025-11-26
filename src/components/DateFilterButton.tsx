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

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
    <div className="relative" ref={filterRef} style={{ zIndex: showFilterDropdown ? 50 : 'auto' }}>
      <button
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        className={`p-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--main-color1] ${
          isFilterApplied
            ? 'border-[--main-color1] bg-[--main-color1] text-black'
            : (buttonClassName || 'border border-[--main-color1] hover:bg-[--main-color1] hover:bg-opacity-10 text-[--main-color1]')
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

