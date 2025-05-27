'use client'
import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePickerModal({ isOpen, onClose, onSelect, currentDate }) {
  if (!isOpen) return null;

  // Generate array of years (current year ± 10 years)
  const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Track selected year and month separately
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const handleSearch = () => {
    const newDate = new Date(selectedYear, selectedMonth);
    onSelect(newDate);
    onClose();
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="box flex justify-center items-center">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-lg p-4 w-full max-w-[400px] h-auto flex flex-col shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#344053]">Select Date</h2>
            <button 
              onClick={onClose}
              className="text-[#344053] hover:text-[#006198] text-xl"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex flex-1 gap-4">
            {/* Year Column */}
            <div className="flex-1 border-r pr-4">
              <h3 className="text-sm font-medium text-[#344053] mb-2">Year</h3>
              <div className="h-[200px] overflow-y-auto">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full text-left px-3 py-2 rounded-md text-base ${
                      year === selectedYear 
                        ? 'bg-[#006198] text-white' 
                        : 'hover:bg-[#f8f9fb] text-[#344053]'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Column */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#344053] mb-2">Month</h3>
              <div className="h-[200px] overflow-y-auto">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`w-full text-left px-3 py-2 rounded-md text-base ${
                      index === selectedMonth
                        ? 'bg-[#006198] text-white'
                        : 'hover:bg-[#f8f9fb] text-[#344053]'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#006198] text-white text-base rounded-lg hover:bg-[#004d7a]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      </div>


      {/* Scrollbar Styles */}
      <style jsx global>{`
        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
} 