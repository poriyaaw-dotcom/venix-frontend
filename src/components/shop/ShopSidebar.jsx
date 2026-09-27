// src/components/shop/ShopSidebar.jsx

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'electronics', label: 'الکترونیک', count: 42 },
  { id: 'fashion', label: 'مد و پوشاک', count: 28 },
  { id: 'home', label: 'خانه و آشپزخانه', count: 19 },
  { id: 'beauty', label: 'زیبایی و بهداشت', count: 35 },
  { id: 'sports', label: 'ورزش و سفر', count: 14 },
];

const BRANDS = [
  { id: 'samsung', label: 'سامسونگ', count: 18 },
  { id: 'apple', label: 'اپل', count: 12 },
  { id: 'xiaomi', label: 'شیائومی', count: 22 },
  { id: 'lg', label: 'ال جی', count: 9 },
  { id: 'sony', label: 'سونی', count: 15 },
];

const PRICE_STEPS = [
  { label: 'همه قیمت‌ها', value: [0, 10000000] },
  { label: 'زیر ۵۰۰ هزار تومان', value: [0, 500000] },
  { label: '۵۰۰ هزار تا ۲ میلیون', value: [500000, 2000000] },
  { label: '۲ میلیون تا ۵ میلیون', value: [2000000, 5000000] },
  { label: 'بالاتر از ۵ میلیون', value: [5000000, 10000000] },
];

const ShopSidebar = ({ filters, setFilters }) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    brands: true,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (id) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const toggleBrand = (id) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(id)
        ? prev.brands.filter((b) => b !== id)
        : [...prev.brands, id],
    }));
  };

  const setPriceRange = (range) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const clearAll = () =>
    setFilters({ categories: [], brands: [], priceRange: [0, 10000000] });

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10000000;

  return (
    <div className="bg-[#FDF8E8]/40 rounded-[30px] p-5 sticky top-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray/20">
        <h2 className="text-[16px] font-bold text-gray">فیلترها</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors"
          >
            <FiX className="w-3.5 h-3.5" />
            <span>پاک کردن</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection
        title="دسته‌بندی‌ها"
        isOpen={openSections.categories}
        onToggle={() => toggleSection('categories')}
      >
        <ul className="space-y-3">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="flex items-center gap-2">
                  <CustomCheckbox
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span className="text-[12px] text-gray group-hover:text-primary transition-colors">
                    {cat.label}
                  </span>
                </span>
                <span className="text-[10px] text-gray/50">({cat.count})</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="محدوده قیمت"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-2">
          {PRICE_STEPS.map((step, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <CustomRadio
                checked={
                  filters.priceRange[0] === step.value[0] &&
                  filters.priceRange[1] === step.value[1]
                }
                onChange={() => setPriceRange(step.value)}
              />
              <span className="text-[12px] text-gray group-hover:text-primary transition-colors">
                {step.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection
        title="برندها"
        isOpen={openSections.brands}
        onToggle={() => toggleSection('brands')}
      >
        <ul className="space-y-3">
          {BRANDS.map((brand) => (
            <li key={brand.id}>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="flex items-center gap-2">
                  <CustomCheckbox
                    checked={filters.brands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                  />
                  <span className="text-[12px] text-gray group-hover:text-primary transition-colors">
                    {brand.label}
                  </span>
                </span>
                <span className="text-[10px] text-gray/50">
                  ({brand.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Apply Button (mobile) */}
      <button className="w-full mt-5 bg-button text-white text-[13px] font-bold py-3 rounded-[15px] hover:bg-button/90 transition-colors lg:hidden">
        اعمال فیلترها
      </button>
    </div>
  );
};

/* ---------- Sub-components ---------- */

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray/20 py-4 last:border-b-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full mb-3"
    >
      <span className="text-[13px] font-bold text-gray">{title}</span>
      {isOpen ? (
        <FiChevronUp className="w-4 h-4 text-primary" />
      ) : (
        <FiChevronDown className="w-4 h-4 text-gray/60" />
      )}
    </button>
    {isOpen && <div className="animate-fadeIn">{children}</div>}
  </div>
);

const CustomCheckbox = ({ checked, onChange }) => (
  <span
    onClick={onChange}
    className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all ${
      checked
        ? 'bg-primary border-primary'
        : 'border-gray/40 hover:border-primary'
    }`}
  >
    {checked && (
      <svg
        className="w-2.5 h-2.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={4}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </span>
);

const CustomRadio = ({ checked, onChange }) => (
  <span
    onClick={onChange}
    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
      checked
        ? 'border-primary'
        : 'border-gray/40 hover:border-primary'
    }`}
  >
    {checked && <span className="w-2 h-2 rounded-full bg-primary" />}
  </span>
);

export default ShopSidebar;