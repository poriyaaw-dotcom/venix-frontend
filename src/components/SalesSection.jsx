// src/components/SalesSection.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const SalesSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        // Fetch all active products
        const res = await fetch('http://localhost:8000/api/v1/products/search?q=&sort_by=newest');
        const data = await res.json();
        
        // Filter for products with a discount > 0, map to expected format, and limit to top 5
        const mapped = data
          .filter(p => p.variants && p.variants.some(v => v.discount_percent > 0))
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            title: p.title,
            titleEn: p.title_en,
            name: p.title, // Fallback for ProductCard
            image: p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `http://localhost:8000${p.image_url}`) : '/category-img.png',
            variants: p.variants || [] // Keep variants array intact for ProductCard!
          }));
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch sale products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleProducts();
  }, []);

  if (loading) {
    return (
      <section className="my-6 md:my-[35px] w-full h-auto md:h-[369px] bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)] flex items-start md:items-center pt-4 pb-3 md:pt-0 md:pb-0 justify-center text-white">
        در حال بارگذاری...
      </section>
    );
  }

  return (
    <section className="my-6 md:my-[35px] w-full h-auto md:h-[369px] bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)] flex items-start md:items-center pt-4 pb-3 md:pt-0 md:pb-0">
      <div className="w-full max-w-[1197px] mx-auto px-4 h-full flex flex-col justify-center">
        <div className="flex items-start md:items-center pt-4 pb-3 md:pt-0 md:pb-0 justify-between mb-6 text-white">
          <h2 className="text-[22px] md:text-[25px] font-bold drop-shadow-md">پیشنهادهای ویژه</h2>
          <button 
            onClick={() => navigate('/shop?on_sale=true')} 
            className="bg-button text-white px-5 py-2 md:px-6 md:py-2 rounded-xl hover:opacity-90 transition text-sm md:text-sm font-medium shadow-md"
          >
            مشاهده همه
          </button>
        </div>
        
        <div className="flex md:grid md:grid-cols-4 lg:md:grid-cols-5 gap-3 md:gap-4 w-full overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          {products.map((product) => (
            <div key={product.id} className="w-[calc(50%-6px)] md:w-auto flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalesSection;
