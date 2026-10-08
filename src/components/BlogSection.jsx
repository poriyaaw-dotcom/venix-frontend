// src/components/BlogSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/blog/');
        if (res.ok) {
          const data = await res.json();
          // Filter only active blogs
          const activeBlogs = data.filter(b => b.is_active).slice(0, 5); // Limit to 5 for the carousel design
          setBlogs(activeBlogs);
          if (activeBlogs.length > 0) {
            setActiveIndex(Math.floor(activeBlogs.length / 2));
          }
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading || blogs.length === 0) return null;

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="mt-[30px] mb-[35px] bg-background overflow-hidden relative">
      <div className="max-w-[1197px] mx-auto px-6">
        <div className="flex items-center justify-between mb-6 text-white relative z-20">
          <h2 className="text-[25px] font-bold">بلاگ تخصصی</h2>
          <button 
            onClick={() => navigate('/blog')} 
            className="bg-button text-white px-6 py-2 rounded-xl hover:opacity-90 transition text-sm font-medium shadow-md"
          >
            مشاهده همه
          </button>
        </div>

        <div className="relative h-[360px] flex items-start justify-center perspective-1000 pt-2">
          {blogs.map((blog, index) => {
            let offset = index - activeIndex;
            const len = blogs.length;
            if (offset > Math.floor(len / 2)) offset = offset - len;
            if (offset < -Math.floor(len / 2)) offset = offset + len;

            const isActive = index === activeIndex;
            const distance = Math.abs(offset);
            
            let width, height, scale;
            if (distance === 0) { 
              width = 'w-[259px]'; 
              height = 'h-[336px]'; 
              scale = 1; 
            } else if (distance === 1) { 
              width = 'w-[233px]'; 
              height = 'h-[302px]'; 
              scale = 0.92; 
            } else { 
              width = 'w-[210px]'; 
              height = 'h-[272px]'; 
              scale = 0.84; 
            }

            const imageUrl = blog.image_url 
              ? (blog.image_url.startsWith('http') ? blog.image_url : `http://127.0.0.1:8000${blog.image_url}`)
              : null;

            const style = {
              transform: `translateX(${offset * 170}px) scale(${scale}) rotateY(${offset * -15}deg)`,
              zIndex: 10 - distance,
              opacity: 1 - distance * 0.2,
              filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
            };

            return (
              <div
                key={blog.id}
                onClick={() => isActive ? navigate(`/blog/${blog.id}`) : handleCardClick(index)}
                className={`absolute ${width} ${height} rounded-3xl cursor-pointer transition-all duration-500 ease-out shadow-2xl flex flex-col overflow-hidden border-4 border-transparent hover:border-white/20`}
                style={style}
              >
                <div className="h-3/5 w-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
                   {imageUrl ? (
                     <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-white/30 text-5xl font-bold">VENIX</span>
                   )}
                </div>
                <div className="h-2/5 bg-[#2a2a2a] p-4 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-primary line-clamp-1">{blog.title}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-3">{blog.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
