// src/components/shop/ShopSidebar.jsx

import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

const ShopSidebar = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
  });

  useEffect(() => {
    // Fetch Categories dynamically
    fetch('http://127.0.0.1:8000/api/v1/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Failed to load categories:", err));

    // Fetch Brands dynamically
    fetch('http://127.0.0.1:8000/api/v1/products/brands')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(err => console.error("Failed to load brands:", err));
  }, []);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (name) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(name)
        ? prev.categories.filter((c) => c !== name)
        : [...prev.categories, name],
    }));
  };

  const toggleBrand = (name) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(name)
        ? prev.brands.filter((b) => b !== name)
        : [...prev.brands, name],
    }));
  };

  const clearAll = () =>
    setFilters({ categories: [], brands: [], priceRange: [0, 100000000] });

  const hasActiveFilters =
    filters.categories.length > 0 || filters.brands.length > 0;

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
          {categories.length === 0 ? (
            <li className="text-[12px] text-gray/50">دسته‌بندی یافت نشد</li>
          ) : (
            categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="flex items-center gap-2">
                    <CustomCheckbox
                      checked={filters.categories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    <span className="text-[12px] text-gray group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </span>
                </label>
              </li>
            ))
          )}
        </ul>
      </FilterSection>

      {/* Brands */}
      <FilterSection
        title="برندها"
        isOpen={openSections.brands}
        onToggle={() => toggleSection('brands')}
      >
        <ul className="space-y-3">
          {brands.length === 0 ? (
            <li className="text-[12px] text-gray/50">برندی یافت نشد</li>
          ) : (
            brands.map((brand) => (
              <li key={brand.id}>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="flex items-center gap-2">
                    <CustomCheckbox
                      checked={filters.brands.includes(brand.name)}
                      onChange={() => toggleBrand(brand.name)}
                    />
                    <span className="text-[12px] text-gray group-hover:text-primary transition-colors">
                      {brand.name}
                    </span>
                  </span>
                </label>
              </li>
            ))
          )}
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
    className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all cursor-pointer ${
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

export default ShopSidebar;
