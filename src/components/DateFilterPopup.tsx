import React from 'react';

interface DateFilter {
  from: string;
  to: string;
}

interface DateFilterPopupProps {
  showFilterDropdown: boolean;
  dateFilter: DateFilter;
  onClose: () => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

const DateFilterPopup: React.FC<DateFilterPopupProps> = ({
  showFilterDropdown,
  dateFilter,
  onClose,
  onDateFilterChange,
  onApplyFilter,
  onClearFilter,
}) => {
  if (!showFilterDropdown) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:top-full sm:right-0 sm:bottom-auto sm:left-auto mt-0 sm:mt-2 w-full sm:w-80 md:w-96 bg-white border-0 sm:border border-[--main-color1] rounded-t-2xl sm:rounded-lg shadow-2xl sm:shadow-xl z-50 transform transition-transform duration-300 ease-out translate-y-0 sm:translate-y-0">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:hidden">
          <h3 className="text-lg font-semibold text-gray-900">Filter by Date</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-4 space-y-4 max-h-[70vh] sm:max-h-none overflow-y-auto">
          {/* Date Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="relative w-[320px]">
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => onDateFilterChange({ ...dateFilter, from: e.target.value })}
                  className="h-[40px] w-full p-3 sm:p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--main-color1] focus:border-transparent text-base sm:text-sm text-[var(--main-color1)]"
                />
                <svg
                  className="absolute left-3 top-3.5 sm:top-2.5 h-5 w-5 text-[--main-color1] pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="relative w-[320px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => onDateFilterChange({ ...dateFilter, to: e.target.value })}
                  min={dateFilter.from}
                  className="h-[40px] w-full p-3 sm:p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--main-color1] focus:border-transparent text-base sm:text-sm text-[var(--main-color1)]"
                />
                <svg
                  className="absolute left-3 top-3.5 sm:top-2.5 h-5 w-5 text-[--main-color1] pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Selected Date Range Preview */}
          {(dateFilter.from || dateFilter.to) && (
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Selected Range:</p>
              <p className="text-sm font-semibold text-[var(--main-color1)] break-words">
                {dateFilter.from || 'Start date'} → {dateFilter.to || 'End date'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onApplyFilter}
              disabled={!dateFilter.from && !dateFilter.to}
              className="w-full bg-[--main-color1] text-white px-4 py-3 sm:py-2.5 rounded-lg text-base sm:text-sm font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Apply Filter
            </button>
            <button
              onClick={onClearFilter}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 px-4 py-3 sm:py-2.5 rounded-lg text-base sm:text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DateFilterPopup;
