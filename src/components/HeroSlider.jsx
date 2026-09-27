import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const posters = [
    { id: 1, bg: 'bg-primary' },
    { id: 2, bg: 'bg-[#eab308]' },
    { id: 3, bg: 'bg-[#ca8a04]' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % posters.length), 5000);
    return () => clearInterval(timer);
  }, [posters.length]);

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-primary">
      {posters.map((poster, idx) => (
        <div key={poster.id} className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${poster.bg} ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-6xl font-black text-background/20 tracking-widest">VENIX</h2>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {posters.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-background w-8' : 'bg-background/50'}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;