import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronLeft, FiChevronRight, FiSliders, FiX } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/shop/Breadcrumb';
import ShopSidebar from '../components/shop/ShopSidebar';
import SortDropdown from '../components/shop/SortDropdown';
import { fetchProducts, toFarsiNumber } from '../utils/api';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';

  const [filters, setFilters] = useState({ 
    categories: urlCategory ? [urlCategory] : [], 
    brands: urlBrand ? [urlBrand] : [], 
    priceRange: [0, 100000000] 
  });
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: urlCategory ? [urlCategory] : [],
      brands: urlBrand ? [urlBrand] : []
    }));
    setCurrentPage(1);
  }, [urlCategory, urlBrand]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      setAllProducts(data);
      setIsLoading(false);
    };
    loadProducts();
    
    const loadCategories = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/products/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const prodCategory = product.category || product.category_name || 'دستگاه';
    const prodBrand = product.brand || product.brand_name || 'generic';

    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(prodCategory);
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(prodBrand);
    
    const finalPrice = product.discountPrice || product.price;
    const priceMatch = finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
    
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      const shopSection = document.getElementById('shop-section');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleFilterChange = (newFilters) => { 
    setFilters(newFilters); 
    setCurrentPage(1); 
  };

  // Find the current category for SEO
  const currentCategoryData = categories.find(c => c.name === urlCategory);
  const pageTitle = currentCategoryData?.meta_title || (urlCategory ? `${urlCategory} | فروشگاه ونیکس` : 'فروشگاه محصولات | ونیکس');
  const pageDescription = currentCategoryData?.meta_description || 'خرید انواع ویپ، پاد سیستم، جویس و لوازم جانبی با بهترین قیمت و ضمانت اصالت کالا';

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <Breadcrumb />
      <section id="shop-section" className="my-[35px] scroll-mt-24">
        <div className="max-w-[1197px] mx-auto px-4">
          <div className="flex items-start justify-between mb-4 md:mb-6 relative z-10">
            <h1 className="text-[25px] font-bold text-white">{currentCategoryData?.name || 'فروشگاه محصولات'}</h1>
            <div className="flex flex-col items-end gap-2">
              <div className="relative z-20">
                <SortDropdown value={sort} onChange={setSort} />
              </div>
              <button onClick={() => setIsMobileFilterOpen(true)} className="md:hidden flex items-center gap-1.5 bg-[#FDF8E8]/40 text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-[15px] text-xs md:text-sm font-bold hover:bg-[#FDF8E8]/60 transition">
                <FiSliders className="w-3.5 h-3.5 md:w-4 md:h-4" /> فیلترها
              </button>
            </div>
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 justify-items-center">
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 justify-items-center min-h-[400px]">
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
          <div className="relative h-full w-[85%] max-w-[320px] bg-background shadow-2xl overflow-y-auto animate-slideInLeft rounded-r-2xl">
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