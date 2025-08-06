import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  openOption?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  openOption
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(openOption ?? false);

  return (
    <div className="py-4 border-b border-[var(--main-color1)]">
      <button
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-lg font-medium text-[var(--main-color1)]">{title}</h3>
        </div>
        <svg
          className={`h-5 w-5 text-[var(--main-color1)] transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`mt-4 space-y-4 transition-all duration-200 ease-in-out ${isOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="text-sm text-[var(--main-color1)]">
          {children}
        </div>
      </div>
    </div>
  );
}
