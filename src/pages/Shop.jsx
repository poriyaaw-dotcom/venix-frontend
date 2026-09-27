// src/pages/Shop.jsx

import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/shop/Breadcrumb';
import ShopSidebar from '../components/shop/ShopSidebar';
import SortDropdown from '../components/shop/SortDropdown';
import { mockProducts, toFarsiNumber } from '../data/products';

const Shop = () => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 100000000],
  });
  const [sort, setSort] = useState('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // --- NEW: FILTERING LOGIC ---
  const filteredProducts = mockProducts.filter((product) => {
    // 1. Category Filter
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
    
    // 2. Brand Filter
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
    
    // 3. Price Filter (uses discount price if available, otherwise regular price)
    const finalPrice = product.discountPrice || product.price;
    const priceMatch = finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];

    return categoryMatch && brandMatch && priceMatch;
  });

  // --- SORTING LOGIC (Basic implementation) ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    
    if (sort === 'price-asc') return priceA - priceB;
    if (sort === 'price-desc') return priceB - priceA;
    if (sort === 'discount') return (b.discount || 0) - (a.discount || 0);
    return b.id - a.id; // Default: newest (highest ID first)
  });

  // --- PAGINATION LOGIC (Applied to filtered & sorted products) ---
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  // Reset to page 1 if current page is greater than total pages after filtering
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const shopSection = document.getElementById('shop-section');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-gray">
      <Header />
      <Breadcrumb />

      <section id="shop-section" className="my-[35px] scroll-mt-24">
        <div className="max-w-[1197px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[25px] font-bold text-gray">فروشگاه محصولات</h1>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-[280px] shrink-0">
              {/* Pass the new handler that also resets pagination */}
              <ShopSidebar filters={filters} setFilters={handleFilterChange} />
            </aside>

            <div className="flex-1">
              <p className="text-[12px] text-gray/70 mb-4">
                نمایش <span className="text-primary font-bold">{currentProducts.length}</span> از{' '}
                <span className="text-primary font-bold">{sortedProducts.length}</span> محصول
              </p>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center min-h-[400px]">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray/50">
                    <p className="text-lg font-bold mb-2">محصولی یافت نشد!</p>
                    <p className="text-sm">لطفاً فیلترهای خود را تغییر دهید.</p>
                  </div>
                )}
              </div>

              {/* Pagination Design */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="flex items-center bg-[#D9D9D9] rounded-full p-1 w-fit mx-auto shadow-sm">
                    <button 
                      onClick={() => handlePageChange(safeCurrentPage - 1)} 
                      disabled={safeCurrentPage === 1}
                      className="bg-[#303030] text-white w-12 h-10 rounded-r-full flex items-center justify-center hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center px-6 gap-3">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <React.Fragment key={page}>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md font-bold transition-all ${
                              safeCurrentPage === page 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-[#303030] hover:bg-black/10'
                            }`}
                          >
                            {toFarsiNumber(page)}
                          </button>
                          {page < totalPages && <span className="text-[#303030]/40 font-light text-lg select-none">|</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <button 
                      onClick={() => handlePageChange(safeCurrentPage + 1)} 
                      disabled={safeCurrentPage === totalPages}
                      className="bg-[#303030] text-white w-12 h-10 rounded-l-full flex items-center justify-center hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;