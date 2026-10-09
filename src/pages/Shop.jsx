// src/pages/Shop.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiSliders, FiX } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/shop/Breadcrumb';
import ShopSidebar from '../components/shop/ShopSidebar';
import SortDropdown from '../components/shop/SortDropdown';
import { fetchProducts, toFarsiNumber } from '../utils/api';

const Shop = () => {
  const [filters, setFilters] = useState({ categories: [], brands: [], priceRange: [0, 100000000] });
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      setAllProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const finalPrice = product.discountPrice || product.price;
    const priceMatch = finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
    
    // Search match (checks both Persian and English titles)
    const searchLower = urlSearchQuery.toLowerCase();
    const searchMatch = searchLower === '' || 
      (product.title && product.title.toLowerCase().includes(searchLower)) || 
      (product.titleEn && product.titleEn.toLowerCase().includes(searchLower));

    return categoryMatch && brandMatch && priceMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sort === 'price-asc') return priceA - priceB;
    if (sort === 'price-desc') return priceB - priceA;
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // DEBUG: Let's see the raw data reaching the Shop page
  console.log("Shop.jsx Raw Data:", currentProducts.length > 0 ? currentProducts[0] : "No products");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const shopSection = document.getElementById('shop-section');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200">
      <Header />
      <Breadcrumb />
      <section id="shop-section" className="my-[35px] scroll-mt-24">
        <div className="max-w-[1197px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[25px] font-bold text-white">فروشگاه محصولات</h1>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          <div className="flex justify-end lg:hidden mb-4">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 bg-[#FDF8E8]/40 text-gray-800 px-4 py-2 rounded-[15px] text-sm font-bold hover:bg-[#FDF8E8]/60 transition">
              <FiSliders className="w-4 h-4" /> فیلترها
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block w-[280px] shrink-0">
              <ShopSidebar filters={filters} setFilters={handleFilterChange} />
            </aside>
            <div className="flex-1">
              <p className="text-[12px] text-gray-400 mb-4">
                نمایش <span className="text-primary font-bold">{currentProducts.length}</span> از <span className="text-primary font-bold">{sortedProducts.length}</span> محصول
              </p>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-full bg-white/[0.025] border border-white/10 rounded-2xl p-4 animate-pulse">
                      <div className="w-full aspect-square bg-gray-700/50 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-700/50 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center min-h-[400px]">
                  {currentProducts.length > 0 ? currentProducts.map((product) => <ProductCard key={product.id} product={product} />) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                      <p className="text-lg font-bold mb-2">محصولی یافت نشد!</p>
                      <p className="text-sm">لطفاً فیلترهای خود را تغییر دهید.</p>
                    </div>
                  )}
                </div>
              )}
              {!isLoading && totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="flex items-center bg-[#D9D9D9] rounded-full p-1 w-fit mx-auto shadow-sm">
                    <button onClick={() => handlePageChange(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} className="bg-[#303030] text-white w-12 h-10 rounded-r-full flex items-center justify-center hover:bg-black transition disabled:opacity-50"><FiChevronRight className="w-5 h-5" /></button>
                    <div className="flex items-center px-6 gap-3">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <React.Fragment key={page}>
                          <button onClick={() => handlePageChange(page)} className={`w-8 h-8 flex items-center justify-center rounded-md font-bold transition-all ${safeCurrentPage === page ? 'bg-primary text-white shadow-md' : 'text-[#303030] hover:bg-black/10'}`}>{toFarsiNumber(page)}</button>
                          {page < totalPages && <span className="text-[#303030]/40 font-light text-lg select-none">|</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <button onClick={() => handlePageChange(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} className="bg-[#303030] text-white w-12 h-10 rounded-l-full flex items-center justify-center hover:bg-black transition disabled:opacity-50"><FiChevronLeft className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="relative h-full w-[85%] max-w-[320px] bg-background shadow-2xl overflow-y-auto animate-slideInRight">
            <div className="sticky top-0 bg-background z-10 p-4 flex justify-end border-b border-gray-700/30">
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-primary transition"><FiX className="w-6 h-6" /></button>
            </div>
            <div className="p-4 pb-10"><ShopSidebar filters={filters} setFilters={handleFilterChange} /></div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default Shop;