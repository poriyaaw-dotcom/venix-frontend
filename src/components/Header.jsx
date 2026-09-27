import React, { useState } from 'react';
import { FiSearch, FiPhone, FiUser, FiShoppingCart, FiMenu } from 'react-icons/fi';

const Header = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const categories = ['دستگاه', 'لیکوئید ها', 'کویل', 'کارتریج', 'پاد یکبار مصرف'];

  return (
    <header className="bg-background text-primary sticky top-0 z-50 shadow-lg py-4">
      {/* Changed grid ratio so middle is much wider */}
      <div className="container mx-auto px-6 grid grid-cols-[1fr_2.5fr_1fr] items-center gap-6">
        
        {/* Right Side */}
        <div className="flex items-center gap-4 justify-start">
          <h1 className="text-2xl font-bold tracking-wider text-primary">VENIX</h1>
          <div className="relative">
            <button onClick={() => setShowCategories(!showCategories)} className="flex items-center gap-1 text-base font-medium hover:text-gray transition">
              <FiMenu className="text-lg" />
              <span>دسته بندی</span>
            </button>
            {showCategories && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-background rounded-xl shadow-2xl py-2 border border-primary/20">
                {categories.map((cat, idx) => (
                  <button key={idx} className="block w-full text-right px-4 py-2 hover:bg-primary/10 transition text-gray hover:text-primary text-sm">{cat}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Search Bar (Now truly wide) */}
        <div className="flex justify-center w-full">
          <div className="relative w-full max-w-5xl">
            <input type="text" placeholder="جستجو در محصولات..." className="w-full px-6 py-3 rounded-full bg-gray text-background placeholder-background/60 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm" />
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-background/70 hover:text-background transition">
              <FiSearch className="text-lg" />
            </button>
          </div>
        </div>

        {/* Left Side */}
        <div className="flex items-center gap-5 text-xl justify-end">
          <a href="tel:02134560" className="hover:scale-110 transition"><FiPhone /></a>
          <button onClick={() => setShowLogin(true)} className="hover:scale-110 transition"><FiUser /></button>
          <button className="hover:scale-110 transition relative">
            <FiShoppingCart />
            <span className="absolute -top-2 -right-2 bg-button text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">۰</span>
          </button>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 w-full max-w-md border border-primary/30 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-primary text-center">ورود به حساب</h2>
            <input type="tel" placeholder="شماره موبایل" className="w-full mb-4 px-4 py-3 rounded-xl bg-gray text-background placeholder-background/50 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="text" placeholder="نام و نام خانوادگی" className="w-full mb-6 px-4 py-3 rounded-xl bg-gray text-background placeholder-background/50 focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex gap-3">
              <button onClick={() => setShowLogin(false)} className="flex-1 bg-button text-white py-3 rounded-xl hover:opacity-90 transition font-bold text-lg">ورود</button>
              <button onClick={() => setShowLogin(false)} className="flex-1 bg-gray text-background py-3 rounded-xl hover:opacity-80 transition font-bold text-lg">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;