// src/components/FloatingWhatsApp.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const location = useLocation();
  
  // ✅ Hide on admin routes and login page
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }

  // Your support number
  const phoneNumber = '989127467261'; 
  const message = encodeURIComponent('سلام، من در سایت ونیکس سوالی دارم.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group animate-float"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-white text-3xl" />
      
      {/* Tooltip that appears on hover */}
      <span className="absolute left-16 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
        پشتیبانی ونیکس 💬
      </span>
    </a>
  );
};

export default FloatingWhatsApp;