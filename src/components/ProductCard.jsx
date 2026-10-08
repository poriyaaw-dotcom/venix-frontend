// src/components/ProductCard.jsx
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/api';

const ProductCard = ({ product, onAddToCart }) => {
  // Get the first variant to display on the card
  const firstVariant = product.variants?.[0] || {};
  const hasDiscount = firstVariant.discount_percent > 0;
  const displayPrice = firstVariant.final_price || 0;
  const oldPrice = firstVariant.base_price || 0;
  const discountPercent = firstVariant.discount_percent || 0;
  
  // DEBUG LOG: Let's see exactly what the browser is calculating
  console.log("ProductCard Debug:", { 
    title: product.title, 
    final_price: firstVariant.final_price, 
    displayPrice: displayPrice,
    hasDiscount: hasDiscount 
  });

  return (
    <Link to={`/product/${product.id}`} className="block w-[201px] h-[272px] bg-[#FDF8E8]/40 backdrop-blur-sm rounded-[20px] p-3 relative flex flex-col shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)] transition-all duration-300 border border-white/40 overflow-hidden flex-shrink-0 group">
      
      {hasDiscount && (
        <div className="absolute top-0 right-0 bg-button text-white px-3 py-1.5 rounded-bl-xl font-bold text-xs shadow-md z-20">
          {discountPercent}%
        </div>
      )}

      <div className="h-[130px] flex items-center justify-center mb-2">
        <img 
          src={product.image || "/category-img.png"} 
          alt={product.title || product.name} 
          className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition duration-300" 
        />
      </div>

      <div className="w-full h-[2px] bg-button mb-2 opacity-80"></div>

      <div className="flex-grow mb-1">
        <h3 className="text-black text-xs font-bold mb-1 leading-tight line-clamp-2 h-10 px-1">
          {product.title || product.name}
        </h3>
        <p className="text-black/70 text-[10px] tracking-wide text-left px-1" dir="ltr">
          {product.titleEn || "UWELL CALIBURN G4 PRO KOKO"}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto" onClick={(e) => e.preventDefault()}>
        <div className="flex flex-col">
          {hasDiscount && oldPrice > 0 && (
            <span className="text-black/40 text-[10px] line-through decoration-black/40 mb-0.5">
              {formatPrice(oldPrice)} تومان
            </span>
          )}
          <span className="text-black font-bold text-sm">
            {formatPrice(displayPrice)} <span className="text-[10px] font-normal text-black/60">تومان</span>
          </span>
        </div>
        
        {onAddToCart && (
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            className="bg-button hover:bg-button/90 text-white p-2 rounded-lg transition shadow-md"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;