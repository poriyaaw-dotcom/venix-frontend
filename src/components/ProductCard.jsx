// src/components/ProductCard.jsx

import React from 'react';
import { formatPrice } from '../data/products';

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    // Exact 201x272, 70% opaque background
    <div className="w-[201px] h-[272px] shrink-0 bg-[#FDF8E8]/70 rounded-[20px] relative flex flex-col overflow-hidden border border-white/40 shadow-sm hover:shadow-lg transition-shadow">
      
      {/* Discount Badge - Fixed size, bigger text */}
      {product.discount && (
        <div className="absolute top-0 right-0 bg-button text-white w-[40px] h-[26px] flex items-center justify-center rounded-bl-xl font-bold text-[13px] shadow-md z-10">
          {formatPrice(product.discount)}٪
        </div>
      )}

      {/* Image Area - 60% of the box (150px) - Removed bottom padding */}
      <div className="h-[150px] w-full flex items-center justify-center px-4 pt-4 bg-white/20">
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain drop-shadow-md" 
        />
      </div>

      {/* 2px Blue Divider Line - Exactly at the split, no margins */}
      <div className="w-[80%] mx-auto h-[2px] bg-button/50"></div>

      {/* Content Area - 40% of the box */}
      <div className="flex-1 flex flex-col justify-between p-3 pt-2">
        
        {/* Titles - Bigger fonts */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[12px] font-bold text-black line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-[11px] text-black/60 line-clamp-1 truncate text-left" dir="ltr">
            {product.titleEn}
          </p>
        </div>

        {/* Prices - Bigger numbers, ALL BLACK */}
        <div className="flex flex-col items-end mt-auto">
          {product.discountPrice ? (
            <>
              <span className="text-[11px] text-black/40 line-through decoration-black/30">
                {formatPrice(product.price)}
              </span>
              <span className="text-[14px] font-bold text-black leading-none mt-0.5">
                {formatPrice(product.discountPrice)} <span className="text-[10px] font-normal text-black/60">تومان</span>
              </span>
            </>
          ) : (
            <span className="text-[14px] font-bold text-black leading-none">
              {formatPrice(product.price)} <span className="text-[10px] font-normal text-black/60">تومان</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;