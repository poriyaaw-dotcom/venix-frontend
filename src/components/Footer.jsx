// src/components/Footer.jsx
import React from 'react';
import venixLogo from '../assets/venix-logo.png';

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-6 border-t border-gray/10">
      <div className="max-w-[1197px] mx-auto px-6">
        
        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            {/* Replaced text with Logo Image */}
            <img src={venixLogo} alt="VENIX" className="h-12 w-auto object-contain mb-6" />
            <p className="text-gray/60 text-sm leading-relaxed">
              فروشگاه VENIX ارائه‌دهنده محصولات اصل و باکیفیت ویپ، پاد و جویس با ضمانت اصالت کالا است. 
              ما با پشتیبانی پاسخ‌گو و قیمت مناسب، تجربه‌ای مطمئن و رضایت‌بخش را برای دوستداران ویپینگ فراهم می‌کنیم.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray mb-6">تماس با ما</h4>
            <ul className="space-y-4 text-sm text-gray/60">
              <li>۰۲-۳۴۶۰</li>
              <li>۰۲۱-۳۴۵۶</li>
              <li>۰۱۲۴۰۰۰۰۰</li>
              <li>۰۹۱۲۰۰۵۰۵</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray mb-6">لینک های مهم</h4>
            <ul className="space-y-4 text-sm text-gray/60">
              <li><a href="#" className="hover:text-primary transition">قیمت پاد</a></li>
              <li><a href="#" className="hover:text-primary transition">قیمت ویپ</a></li>
              <li><a href="#" className="hover:text-primary transition">خرید جویس</a></li>
              <li><a href="#" className="hover:text-primary transition">درباره ما</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray mb-6">دسترسی سریع</h4>
            <ul className="space-y-4 text-sm text-gray/60">
              <li><a href="#" className="hover:text-primary transition">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-primary transition">پیگیری سفارش</a></li>
              <li><a href="#" className="hover:text-primary transition">سوالات متداول</a></li>
              <li><a href="#" className="hover:text-primary transition">بلاگ تخصصی</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray/40 gap-4">
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