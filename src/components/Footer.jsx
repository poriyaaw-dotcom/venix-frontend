// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiMail, FiClock } from 'react-icons/fi';
import venixLogo from '../assets/venix-logo.png';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  // Fetch the first 4 categories dynamically for the footer
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data.slice(0, 4)); // Only take the first 4
        }
      })
      .catch(err => console.error("Failed to load footer categories:", err));
  }, []);

  return (
    <footer className="bg-background pt-16 pb-6 border-t border-gray/10">
      <div className="max-w-[1197px] mx-auto px-6">
        
        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Description */}
          <div>
            <img src={venixLogo} alt="VENIX" className="h-12 w-auto object-contain mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed">
              فروشگاه VENIX ارائه‌دهنده محصولات اصل و باکیفیت ویپ، پاد و جویس با ضمانت اصالت کالا است. 
              ما با پشتیبانی پاسخ‌گو و قیمت مناسب، تجربه‌ای مطمئن و رضایت‌بخش را برای دوستداران ویپینگ فراهم می‌کنیم.
            </p>
          </div>

          {/* Column 2: Contact Info (Updated) */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">تماس با ما</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FiPhone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span dir="ltr" className="text-right">09127467261</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>تهران - مولوی - بازار حضرتی</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span dir="ltr" className="text-right break-all">erfan3xam.8731@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>شنبه تا چهارشنبه: ۹ الی ۱۷</span>
                  <span>پنجشنبه: ۱۰ الی ۱۶</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Important Links (First 4 Categories) */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">لینک‌های مهم</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-primary transition">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback in case categories haven't loaded yet
                <>
                  <li><Link to="/shop" className="hover:text-primary transition">دستگاه</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition">جویس</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition">پاد</Link></li>
                  <li><Link to="/shop" className="hover:text-primary transition">ویپ</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Quick Access (Updated) */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">دسترسی سریع</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-primary transition">تماس با ما</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition">فروشگاه</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition">بلاگ تخصصی</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition">پیگیری سفارش</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>تمامی حقوق محفوظ و متعلق به VENIX می‌باشد.</p>
          <p>
            توسعه و طراحی توسط تیم 
            <a href="#" className="text-primary hover:underline font-bold mx-1">آریس</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;