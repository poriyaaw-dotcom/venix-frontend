import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/products/categories');
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
    <section className="my-[35px] bg-background">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="flex flex-wrap justify-center gap-[74px]">
          {loading ? (
            // Loading skeletons to prevent layout shift
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#252525] rounded-[30px] w-[180px] h-[180px] animate-pulse"></div>
            ))
          ) : (
            categories.map((cat) => (
              <Link
                to={`/shop?category=${cat.slug || cat.id}`}
                key={cat.id}
                className="bg-[#252525] rounded-[30px] flex flex-col items-center justify-end cursor-pointer hover:scale-105 transition-transform shadow-lg border border-primary/5 relative overflow-hidden group w-[180px] h-[180px] p-4"
              >
                <img 
  src={cat.image_url ? (cat.image_url.startsWith('http') ? cat.image_url : `http://127.0.0.1:8000${cat.image_url}`) : '/category-img.png'} 
  alt={cat.name} 
  className="w-24 h-24 object-contain mb-2 group-hover:scale-110 transition-transform duration-300 z-10"
  onError={(e) => { e.target.onerror = null; e.target.src='/category-img.png'; }} 
/>
                <h3 className="font-bold text-sm text-primary z-10 text-center">{cat.name}</h3>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
