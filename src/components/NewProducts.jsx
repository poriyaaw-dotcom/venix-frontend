import React, { useRef } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ProductCard from './ProductCard';

const NewProducts = () => {
  const sliderRef = useRef(null);
  
  const products = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: 'پاد ماد کالیرن جی  پرو کوکو یوول نسخه جدید و بهبود یافته',
    price: 4680000,
    oldPrice: 5680000,
    discount: 20
  }));

  const scroll = (direction) => {
    if (sliderRef.current) {
      const amount = 304; 
      sliderRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="rounded-[40px] p-8 shadow-[0_20px_50px_-12px_rgba(222,154,0,0.3)] relative overflow-hidden bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)]">
          
          <div className="flex items-center justify-between mb-8 text-white">
            <h2 className="text-[25px] font-bold drop-shadow-md">محصولات جدید</h2>
            
            <div className="flex gap-3">
              <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-white">
                <FiChevronRight className="text-lg" />
              </button>
              <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-white">
                <FiChevronLeft className="text-lg" />
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="flex gap-6 overflow-x-auto px-2 py-6 scroll-smooth" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px]" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewProducts;