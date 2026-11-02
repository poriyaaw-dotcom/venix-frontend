// src/components/MobileBottomNav.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../Context/CartContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Hide on admin or login pages
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null;
  }

  const navItems = [
    { path: '/', icon: FiHome, label: 'خانه' },
    { path: '/shop', icon: FiGrid, label: 'فروشگاه' },
    { path: '/cart', icon: FiShoppingCart, label: 'سبد خرید', badge: cartCount },
    { path: '/profile', icon: FiUser, label: 'پروفایل' },
  ];

  return (
    // ✅ md:hidden ensures this is 100% INVISIBLE on desktop/tablet
    // ✅ iOS Glassmorphism: bg-black/70 backdrop-blur-xl border-t border-white/10
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                
                {/* Cart Badge */}
                {item.badge > 0 && item.path === '/cart' && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-black/70">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;