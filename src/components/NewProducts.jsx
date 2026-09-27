// src/components/NewProducts.jsx

import React, { useRef } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ProductCard from './ProductCard';

const NewProducts = () => {
  const sliderRef = useRef(null);
  
  // Updated to match the new ProductCard expected structure
  const products = [
    { id: 1, title: 'پاد ماد کالیرن جی پرو کوکو یوول', titleEn: 'Caliburn G Pro', price: 5680000, discountPrice: 4680000, discount: 18, image: '/category-img.png', category: 'electronics', brand: 'uvo' },
    { id: 2, title: 'جویس میوه ای ۶۰ میل', titleEn: 'Fruit Juice 60ml', price: 450000, discountPrice: 380000, discount: 15, image: '/category-img.png', category: 'electronics', brand: 'generic' },
    { id: 3, title: 'پاد سیستم نویتک مدل نووا', titleEn: 'Novatech Nova', price: 2100000, discountPrice: 1800000, discount: 14, image: '/category-img.png', category: 'electronics', brand: 'novatech' },
    { id: 4, title: 'باتری ۱۶۵۰ اورجینال سامسونگ', titleEn: 'Samsung 1650 Battery', price: 300000, discountPrice: 250000, discount: 16, image: '/category-img.png', category: 'electronics', brand: 'samsung' },
    { id: 5, title: 'کویل مش ۰.۵ اهم بسته ۵ عددی', titleEn: '0.5 Ohm Mesh Coil', price: 120000, discountPrice: 90000, discount: 25, image: '/category-img.png', category: 'electronics', brand: 'generic' },
    { id: 6, title: 'شارژر دیواری فست شارژ', titleEn: 'Fast Charger Adapter', price: 850000, discountPrice: 750000, discount: 12, image: '/category-img.png', category: 'electronics', brand: 'samsung' },
    { id: 7, title: 'کابل تایپ سی ۱ متری', titleEn: 'Type-C Cable 1m', price: 150000, discountPrice: 120000, discount: 20, image: '/category-img.png', category: 'electronics', brand: 'generic' },
    { id: 8, title: 'هندزفری بلوتوثی مدل QCY', titleEn: 'QCY Bluetooth Handsfree', price: 980000, discountPrice: 850000, discount: 13, image: '/category-img.png', category: 'electronics', brand: 'qcy' },
    { id: 9, title: 'اسپیکر قابل حمل مدل X10', titleEn: 'Portable Speaker X10', price: 1200000, discountPrice: 990000, discount: 17, image: '/category-img.png', category: 'electronics', brand: 'generic' },
    { id: 10, title: 'پاوربانک ۱۰۰۰۰ میلی‌آمپر', titleEn: '10000mAh Power Bank', price: 1500000, discountPrice: 1350000, discount: 10, image: '/category-img.png', category: 'electronics', brand: 'xiaomi' },
  ];

  const scroll = (direction) => {
    if (sliderRef.current) {
      // In RTL, positive scrollLeft moves content to the left (revealing right side)
      sliderRef.current.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-[35px] bg-background flex justify-center">
      <div className="w-full max-w-[1197px] h-[422px] rounded-[30px] p-6 shadow-[0_20px_50px_-12px_rgba(222,154,0,0.3)] relative overflow-hidden bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)] flex flex-col">
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