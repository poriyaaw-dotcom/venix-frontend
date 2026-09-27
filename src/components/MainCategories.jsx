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
    <section className="my-[35px] bg-background">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="flex flex-wrap justify-center gap-[74px]">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-[#252525] rounded-[30px] flex flex-col items-center justify-end cursor-pointer hover:scale-105 transition-transform shadow-lg border border-primary/5 relative overflow-hidden group w-[180px] h-[180px] p-4"
            >
              <img src="/category-img.png" alt={cat.name} className="w-24 h-24 object-contain mb-2 group-hover:scale-110 transition-transform duration-300 z-10" />
              <h3 className="font-bold text-sm text-primary z-10">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainCategories;