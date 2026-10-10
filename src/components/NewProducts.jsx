// src/components/NewProducts.jsx

import React, { useRef, useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ProductCard from './ProductCard';

const NewProducts = () => {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        // Fetch newest products from backend
        const res = await fetch('http://127.0.0.1:8000/api/v1/products/search?q=&sort_by=newest');
        const data = await res.json();
        
        // Map backend data to ProductCard expected format and limit to 10
        const mapped = data.slice(0, 10).map(p => ({
          id: p.id,
          title: p.title,
          titleEn: p.title_en,
          name: p.title, // Fallback for ProductCard
          image: p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `http://127.0.0.1:8000${p.image_url}`) : '/category-img.png',
          variants: p.variants || [] // Keep variants array intact for ProductCard!
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch new products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="my-[35px] bg-background flex justify-center">
        <div className="w-full max-w-[1197px] h-auto md:h-[422px] md:py-6 rounded-[30px] p-6 flex items-center justify-center text-white">
          در حال بارگذاری...
        </div>
      </section>
    );
  }

  return (
    <section className="my-[35px] bg-background flex justify-center">
      <div className="w-full max-w-[1197px] h-auto md:h-[422px] md:py-6 rounded-[30px] p-6 shadow-[0_20px_50px_-12px_rgba(222,154,0,0.3)] relative overflow-hidden bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)] flex flex-col">
        <div className="flex items-center justify-between mb-4 text-white">
          <h2 className="text-[25px] font-bold drop-shadow-md">محصولات جدید</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll('right')} className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-white">
              <FiChevronRight />
            </button>
            <button onClick={() => scroll('left')} className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-white">
              <FiChevronLeft />
            </button>
          </div>
        </div>
        <div 
          ref={sliderRef} 
          className="flex gap-4 overflow-x-auto flex-grow items-center px-2" 
          style={{ scrollbarWidth: 'none' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
