import React from 'react';

const MainCategories = () => {
  const categories = [
    { id: 1, name: 'دستگاه' },
    { id: 2, name: 'لیکوئید ها' },
    { id: 3, name: 'کویل' },
    { id: 4, name: 'کارتریج' },
    { id: 5, name: 'پاد یکبار مصرف' },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-[#252525] rounded-3xl p-4 h-64 flex flex-col items-center justify-end cursor-pointer hover:scale-105 transition-transform shadow-lg border border-primary/5 relative overflow-hidden group"
            >
              {/* Image on Top */}
              <img 
                src="/category-img.png" 
                alt={cat.name} 
                className="w-36 h-36 object-contain mb-4 group-hover:scale-110 transition-transform duration-300 z-10"
              />
              
              {/* Text on Bottom */}
              <h3 className="font-bold text-lg text-primary z-10 mb-2">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainCategories;