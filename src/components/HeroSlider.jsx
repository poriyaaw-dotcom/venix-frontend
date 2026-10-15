import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Point directly to the backend where the uploads folder actually lives
  const BACKEND_URL = "http://api.venixpodshop.com"; 

  const posters = [
    { id: 1, image: `${BACKEND_URL}/uploads/cover1.jpg`, alt: 'Hero Cover 1' },
    { id: 2, image: `${BACKEND_URL}/uploads/cover2.jpg`, alt: 'Hero Cover 2' },
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
            className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={poster.image} 
              alt={poster.alt} 
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