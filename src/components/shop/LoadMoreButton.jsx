// src/components/shop/LoadMoreButton.jsx

import React from 'react';

const LoadMoreButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-button text-white text-[13px] font-bold px-8 py-3 rounded-[15px] hover:bg-button/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-button/20"
  >
    مشاهده محصولات بیشتر
  </button>
);

export default LoadMoreButton;