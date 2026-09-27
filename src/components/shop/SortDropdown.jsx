// src/components/shop/SortDropdown.jsx

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'پرفروش‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
];

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label || 'جدیدترین';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#FDF8E8] text-black text-[12px] px-4 py-2 rounded-[15px] hover:bg-[#FDF8E8]/80 transition-colors border border-gray/20"
      >
        <span>مرتب‌سازی: </span>
        <span className="font-bold text-primary">{currentLabel}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        // Solid background for better visibility
        <div className="absolute top-full mt-2 left-0 w-[180px] bg-[#FDF8E8] rounded-[15px] shadow-xl z-20 overflow-hidden border border-gray/20">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`w-full text-right px-4 py-3 text-[12px] transition-colors border-b border-gray/10 last:border-b-0 ${
                value === option.value
                  ? 'bg-[#303030] text-white font-bold' // Dark background for selected item
                  : 'text-black hover:bg-black/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;