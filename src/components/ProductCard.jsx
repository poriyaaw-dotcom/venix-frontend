import React from 'react';

const toPersianNum = (num) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, x => farsiDigits[x]);
};

const ProductCard = ({ product }) => {
  return (
    // Reduced shadow spread for a softer, rounder look
    <div className="bg-[#FDF8E8]/40 backdrop-blur-sm rounded-[30px] p-5 relative flex flex-col h-[420px] shadow-[0_4px_15px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 border border-white/40 overflow-hidden flex-shrink-0 w-full">
      
      {product.discount && (
        <div className="absolute top-0 right-0 bg-button text-white px-4 py-1.5 rounded-bl-xl font-medium text-lg shadow-md z-20">
          {toPersianNum(product.discount)}%
        </div>
      )}

      <div className="h-48 flex items-center justify-center mb-4 mt-2">
        <img src="/category-img.png" alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
      </div>

      <div className="w-full h-[2px] bg-button mb-4 opacity-80"></div>

      <div className="flex-grow mb-4">
        <h3 className="text-black text-base font-medium mb-1 leading-tight line-clamp-2 h-12">{product.name}</h3>
        <p className="text-black/70 text-xs tracking-wide text-left" dir="ltr">UWELL CALIBURN G4 PRO KOKO</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          {product.oldPrice && (
            <span className="text-black/40 text-xs line-through decoration-black/40">
              {toPersianNum(product.oldPrice.toLocaleString())} تومان
            </span>
          )}
          <span className="text-black font-medium text-lg">
            {toPersianNum(product.price.toLocaleString())} <span className="text-xs font-normal text-black/60">تومان</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;