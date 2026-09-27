import React from 'react';
import ProductCard from './ProductCard';

const SalesSection = () => {
  const products = [
    { id: 1, name: 'دستگاه ویپ ویپرسو درسا ۲', price: 3200000, oldPrice: 4000000, discount: 20 },
    { id: 2, name: 'جویس میوه ای ۶۰ میل نیکوتین ۳', price: 380000, oldPrice: 450000, discount: 15 },
    { id: 3, name: 'پاد سیستم نویتک مدل نووا ', price: 1800000, oldPrice: 2100000, discount: 14 },
    { id: 4, name: 'باتری ۱۶۵۰ اورجینال سامسونگ', price: 250000, oldPrice: 300000, discount: 16 },
    { id: 5, name: 'کویل مش ۰.۵ اهم بسته ۵ عددی', price: 90000, oldPrice: 120000, discount: 25 },
  ];

  return (
    <section className="py-16 w-full bg-[linear-gradient(135deg,#C59338_0%,#DE9A00_50%,#F4B942_100%)]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8 text-white">
          <h2 className="text-[25px] font-bold drop-shadow-md">پیشنهادهای ویژه</h2>
          <button className="bg-button text-white px-6 py-2 rounded-xl hover:opacity-90 transition text-sm font-medium shadow-md">
            مشاهده همه
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalesSection;