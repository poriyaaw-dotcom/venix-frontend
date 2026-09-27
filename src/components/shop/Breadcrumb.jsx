// src/components/shop/Breadcrumb.jsx

import React from 'react';

const Breadcrumb = () => {
  return (
    <div className="bg-background border-b border-gray/10">
      <div className="max-w-[1197px] mx-auto px-4 py-4">
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <span className="text-primary font-bold text-[14px]">فروشگاه</span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;