// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiSearch, FiPhone, FiUser, FiShoppingCart, FiMenu, FiFileText, FiInfo } from 'react-icons/fi';
import venixLogo from '../assets/venix-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const { cartCount } = useCart();
  
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://api.venixpodshop.com/api/v1/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error("Failed to load categories:", err);
        setCategories([]);
      });
  }, []);

  return (
    <header className="bg-background text-primary sticky top-0 z-50 shadow-lg">
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-200 p-2 shrink-0">
          <FiMenu className="text-2xl" />
        </button>
        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`); }} className="flex-1 relative">
          <input type="text" placeholder="جستجو در محصولات..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-[36px] px-3 pr-8 rounded-full bg-gray text-background placeholder-background/60 focus:outline-none text-xs" />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-background/70"><FiSearch className="text-sm" /></button>
        </form>
        <a href="tel:09127467261" className="text-gray-200 p-2 shrink-0 hover:text-primary transition">
          <FiPhone className="text-xl" />
        </a>
      </div>

      {/* --- DESKTOP HEADER (100% UNTOUCHED) --- */}
      <div className="hidden md:block py-4">
        <div className="container mx-auto px-6 grid grid-cols-[1fr_2.5fr_1fr] items-center gap-6">
        
        {/* Right Side: Logo & Categories */}
        <div className="flex items-center gap-6 justify-start">
          <Link to="/" className="flex items-center shrink-0">
            <img src={venixLogo} alt="VENIX" className="h-10 w-auto object-contain" />
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)} 
              className="flex items-center gap-2 text-base font-medium text-gray-200 hover:text-primary transition"
            >
              <FiMenu className="text-lg" />
              <span>دسته بندی</span>
            </button>
            
            {showCategories && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-background rounded-xl shadow-2xl py-2 border border-primary/20">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="block w-full text-right px-4 py-2 hover:bg-primary/10 transition text-gray-400 hover:text-primary text-sm"
                    onClick={() => setShowCategories(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex justify-center w-full">
          <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`); }} className="relative w-[612px]">
            <input 
              type="text" 
              placeholder="جستجو در محصولات..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[39px] px-5 rounded-full bg-gray text-background placeholder-background/60 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm" 
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-background/70 hover:text-background transition"><FiSearch className="text-lg" /></button>
          </form>
        </div>

        {/* Left Side: Icons */}
        <div className="flex items-center gap-5 text-xl justify-end">
          <a href="tel:09127467261" className="hover:scale-110 transition text-gray-200 hover:text-primary"><FiPhone /></a>
          <button 
            onClick={() => {
              const token = localStorage.getItem('token');
              navigate(token ? '/profile' : '/login');
            }} 
            className="hover:scale-110 transition text-gray-200 hover:text-primary"
          >
            <FiUser />
          </button>
          <Link to="/cart" className="hover:scale-110 transition relative text-gray-200 hover:text-primary">
            <FiShoppingCart />
            {/* ✅ FIXED: Only show badge when cartCount > 0 */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-button text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      </div>
      
      {/* --- MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-background shadow-2xl p-6 overflow-y-auto animate-slideInRight">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block"><img src={venixLogo} alt="VENIX" className="h-8" /></Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400"><FiMenu className="text-2xl" /></button>
            </div>
            
            <h3 className="text-white font-bold mb-4 text-sm">منو</h3>
            <div className="space-y-2 mb-8">
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full text-right px-4 py-3 rounded-lg hover:bg-primary/10 transition text-gray-300 hover:text-primary text-sm border border-white/5">
                <FiFileText className="text-lg" /> <span>بلاگ</span>
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full text-right px-4 py-3 rounded-lg hover:bg-primary/10 transition text-gray-300 hover:text-primary text-sm border border-white/5">
                <FiInfo className="text-lg" /> <span>درباره ما</span>
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full text-right px-4 py-3 rounded-lg hover:bg-primary/10 transition text-gray-300 hover:text-primary text-sm border border-white/5">
                <FiPhone className="text-lg" /> <span>تماس با ما</span>
              </Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full text-right px-4 py-3 rounded-lg hover:bg-primary/10 transition text-gray-300 hover:text-primary text-sm border border-white/5">
                <FiUser className="text-lg" /> <span>پروفایل کاربری</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;