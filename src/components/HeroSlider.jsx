import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ✅ UPDATED: Pointing to your uploaded images in the backend 'uploads' folder
  const posters = [
    { id: 1, image: 'http://127.0.0.1:8000/uploads/cover1.jpg' },
    { id: 2, image: 'http://127.0.0.1:8000/uploads/cover2.jpg' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % posters.length), 5000);
    return () => clearInterval(timer);
  }, [posters.length]);

  return (
    <section className="bg-background flex justify-center mb-[35px]">
      <div className="relative w-full max-w-[1750px] h-[200px] md:h-[486px] overflow-hidden bg-gray-900">
        {posters.map((poster, idx) => (
          <div 
            key={poster.id} 
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* ✅ The Image: object-cover ensures it fills the box perfectly without stretching */}
            <img 
              src={poster.image} 
              alt={`VENIX Cover ${poster.id}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
          {posters.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)} 
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/50'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;