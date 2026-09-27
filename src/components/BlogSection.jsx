import React, { useState } from 'react';

const BlogSection = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  const blogs = [
    { id: 1, title: 'ویپ های پرو', desc: 'ساعت های خنک یکی از محبوب ترین انتخاب ها...' },
    { id: 2, title: 'ویپ های پرو', desc: 'ساعت های خنک یکی از محبوب ترین انتخاب ها...' },
    { id: 3, title: 'ویپ های پرو', desc: 'ساعت های خنک یکی از محبوب ترین انتخاب ها...' },
    { id: 4, title: 'ویپ های پرو', desc: 'ساعت های خنک یکی از محبوب ترین انتخاب ها...' },
    { id: 5, title: 'ویپ های پرو', desc: 'ساعت های خنک یکی از محبوب ترین انتخاب ها...' },
  ];

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  return (
    // Exactly 30px distance from the section above
    <section className="mt-[30px] mb-[35px] bg-background overflow-hidden relative">
      <div className="max-w-[1197px] mx-auto px-6">
        
        <div className="flex items-center justify-between mb-6 text-white relative z-20">
          <h2 className="text-[25px] font-bold">بلاگ تخصصی</h2>
          <button className="bg-button text-white px-6 py-2 rounded-xl hover:opacity-90 transition text-sm font-medium shadow-md">
            مشاهده همه
          </button>
        </div>

        {/* Moved boxes high up using items-start and reduced container height */}
        <div className="relative h-[360px] flex items-start justify-center perspective-1000 pt-2">
          {blogs.map((blog, index) => {
            let offset = index - activeIndex;
            if (offset > 2) offset = offset - 5;
            if (offset < -2) offset = offset + 5;

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

            const style = {
              // Reduced from 210 to 170 to make the small boxes collide/overlap
              transform: `translateX(${offset * 170}px) scale(${scale}) rotateY(${offset * -15}deg)`,
              zIndex: 10 - distance,
              opacity: 1 - distance * 0.2,
              filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
            };

            return (
              <div
                key={blog.id}
                onClick={() => handleCardClick(index)}
                className={`absolute ${width} ${height} rounded-3xl cursor-pointer transition-all duration-500 ease-out shadow-2xl flex flex-col overflow-hidden border-4 border-transparent hover:border-white/20`}
                style={style}
              >
                <div className="h-3/5 w-full bg-gradient-to-b from-[#DE9A00] to-[#8B5A00] flex items-center justify-center relative">
                   <span className="text-white/30 text-5xl font-bold">PRO</span>
                </div>
                <div className="h-2/5 bg-[#2a2a2a] p-4 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-primary">{blog.title}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-2">{blog.desc}</p>
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