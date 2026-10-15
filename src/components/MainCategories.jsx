import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://api.venixpodshop.com/api/v1/products/categories');
        if (res.ok) {
          const data = await res.json();
          // Limit to the first 10 categories to preserve the landing page design
          setCategories(data.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="hidden md:block my-[35px] bg-background">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <div className="flex flex-wrap justify-center gap-3 md:gap-[74px]">
          {loading ? (
            // Loading skeletons to prevent layout shift
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#252525] rounded-[20px] md:rounded-[30px] w-[120px] h-[120px] md:w-[180px] md:h-[180px] animate-pulse"></div>
            ))
          ) : (
            categories.map((cat) => (
              <Link
                to={`/shop?category=${cat.slug || cat.id}`}
                key={cat.id}
                className="bg-[#252525] rounded-[20px] md:rounded-[30px] flex flex-col items-center justify-end cursor-pointer hover:scale-105 transition-transform shadow-lg border border-primary/5 relative overflow-hidden group w-[120px] h-[120px] md:w-[180px] md:h-[180px] p-3 md:p-4"
              >
                <img 
  src={cat.image_url ? (cat.image_url.startsWith('http') ? cat.image_url : `https://api.venixpodshop.com${cat.image_url}`) : '/category-img.png'} 
  alt={cat.name} 
  className="w-12 h-12 md:w-24 md:h-24 object-contain mb-1.5 md:mb-2 group-hover:scale-110 transition-transform duration-300 z-10"
  onError={(e) => { e.target.onerror = null; e.target.src='/category-img.png'; }} 
/>
                <h3 className="font-bold text-xs md:text-sm text-primary z-10 text-center leading-tight">{cat.name}</h3>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
