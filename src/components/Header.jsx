// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiSearch, FiPhone, FiUser, FiShoppingCart, FiMenu } from 'react-icons/fi';
import venixLogo from '../assets/venix-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const { cartCount } = useCart();
  
  // Dynamic categories state fetched from backend
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/products/categories')
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
    <header className="bg-background text-primary sticky top-0 z-50 shadow-lg py-4">
      <div className="container mx-auto px-6 grid grid-cols-[1fr_2.5fr_1fr] items-center gap-6">
        
        {/* Right Side: Logo & Categories */}
        <div className="flex items-center gap-6 justify-start">
          
          {/* The New Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={venixLogo} alt="VENIX" className="h-10 w-auto object-contain" />
          </Link>
          
          {/* Categories Button */}
          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)} 
              className="flex items-center gap-2 text-base font-medium text-gray-200 hover:text-primary transition"
            >
              <FiMenu className="text-lg" />
              <span>دسته بندی</span>
            </button>
            
            {/* Dropdown Menu */}
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
          <a href="tel:02134560" className="hover:scale-110 transition text-gray-200 hover:text-primary"><FiPhone /></a>
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
            <span className="absolute -top-2 -right-2 bg-button text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount > 0 ? cartCount : '۰'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;