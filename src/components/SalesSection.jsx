// src/components/SalesSection.jsx

import React from 'react';
import ProductCard from './ProductCard';

const SalesSection = () => {
  // Updated to match the new ProductCard expected structure
  const products = [
    { 
      id: 1, 
      title: 'دستگاه ویپ ویپرسو درسا ۲', 
      titleEn: 'Vaporesso Drisa 2',
      price: 4000000, 
      discountPrice: 3200000, 
      discount: 20,
      image: '/category-img.png',
      category: 'electronics',
      brand: 'vaporesso'
    },
    { 
      id: 2, 
      title: 'جویس میوه ای ۶۰ میل نیکوتین ۳', 
      titleEn: 'Fruit Juice 60ml Nic 3',
      price: 450000, 
      discountPrice: 380000, 
      discount: 15,
      image: '/category-img.png',
      category: 'electronics',
      brand: 'generic'
    },
    { 
      id: 3, 
      title: 'پاد سیستم نویتک مدل نووا', 
      titleEn: 'Novatech Nova Pod System',
      price: 2100000, 
      discountPrice: 1800000, 
      discount: 14,
      image: '/category-img.png',
      category: 'electronics',
      brand: 'novatech'
    },
    { 
      id: 4, 
      title: 'باتری ۱۶۵۰ اورجینال سامسونگ', 
      titleEn: 'Samsung 1650 Original Battery',
      price: 300000, 
      discountPrice: 250000, 
      discount: 16,
      image: '/category-img.png',
      category: 'electronics',
      brand: 'samsung'
    },
    { 
      id: 5, 
      title: 'کویل مش ۰.۵ اهم بسته ۵ عددی', 
      titleEn: '0.5 Ohm Mesh Coil 5-Pack',
      price: 120000, 
      discountPrice: 90000, 
      discount: 25,
      image: '/category-img.png',
      category: 'electronics',
      brand: 'generic'
    },
  ];

  return (
    // Full width orange background
    <section className="my-[35px] w-full h-[369px] bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)] flex items-center">
      
      {/* Constrained to 1197px to align perfectly with New Products */}
      <div className="w-full max-w-[1197px] mx-auto px-4 h-full flex flex-col justify-center">
        
        <div className="flex items-center justify-between mb-6 text-white">
          <h2 className="text-[25px] font-bold drop-shadow-md">پیشنهادهای ویژه</h2>
          <button className="bg-button text-white px-6 py-2 rounded-xl hover:opacity-90 transition text-sm font-medium shadow-md">
            مشاهده همه
          </button>
        </div>
        
        {/* Added responsive grid classes so it doesn't break on smaller screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalesSection;