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
  const itemsPerPage = 12;

  const [categoryDetails, setCategoryDetails] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.venixpodshop.ir/api/v1';

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: urlCategory ? [urlCategory] : [],
      brands: urlBrand ? [urlBrand] : []
    }));
    setCurrentPage(1);
  }, [urlCategory, urlBrand]);

  // ✅ FIXED: Fetches from /products/categories
  useEffect(() => {
    if (urlCategory) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`${API_URL}/products/categories`);
          if (res.ok) {
            const cats = await res.json();
            const found = cats.find(c => c.slug === urlCategory || c.name === urlCategory);
            setCategoryDetails(found || null);
          }
        } catch (err) {
          console.error("Failed to fetch category details", err);
        }
      };
      fetchCategory();
    } else {
      setCategoryDetails(null);
    }
  }, [urlCategory, API_URL]);

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

  return (
    <div className="min-h-screen bg-background font-sans text-gray-200">
      <Helmet>
        <title>{categoryDetails?.meta_title || 'خرید ویپ، پاد سیستم و جویس | فروشگاه ونیکس'}</title>
        <meta name="description" content={categoryDetails?.meta_description || 'خرید آنلاین انواع ویپ، پاد سیستم، جویس و لوازم جانبی با بهترین قیمت و ضمانت اصالت کالا در فروشگاه ونیکس.'} />
        <link rel="canonical" href={`https://venixpodshop.ir${urlCategory ? `/shop?category=${urlCategory}` : '/shop'}`} />
        <meta property="og:title" content={categoryDetails?.meta_title || 'خرید ویپ، پاد سیستم و جویس | فروشگاه ونیکس'} />
        <meta property="og:description" content={categoryDetails?.meta_description || 'خرید آنلاین انواع ویپ، پاد سیستم، جویس و لوازم جانبی با بهترین قیمت.'} />
        <meta property="og:url" content={`https://venixpodshop.ir${urlCategory ? `/shop?category=${urlCategory}` : '/shop'}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <Breadcrumb />
      <section id="shop-section" className="my-[35px] scroll-mt-24">
        <div className="max-w-[1197px] mx-auto px-4">
          <div className="flex items-start justify-between mb-4 md:mb-6 relative z-10">
            <h1 className="text-[25px] font-bold text-white">{categoryDetails?.name || 'فروشگاه محصولات'}</h1>
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

      {/* ✅ SEO Description Rendering */}
      {categoryDetails?.description && (
        <section className="max-w-[1197px] mx-auto px-4 py-12 border-t border-white/10 mt-12">
          <div className="text-gray-300 leading-8 text-sm md:text-base space-y-4">
            {categoryDetails.description.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-xl md:text-2xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg md:text-xl font-bold text-primary mt-6 mb-3">{line.replace('### ', '')}</h3>;
              if (line.trim() === '') return <div key={i} className="h-2" />;
              if (line.startsWith('- ')) return <div key={i} className="flex gap-2 mr-4"><span className="text-primary">•</span><span>{line.replace('- ', '')}</span></div>;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </section>
      )}

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