import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-background py-12 border-t border-gray/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-primary text-xl">VENIX</h3>
            <p className="text-sm leading-relaxed text-gray/70">فروشگاه معتبر برای دوستداران ویپینگ! ارائه بهترین محصولات با ضمانت اصالت کالا.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-primary">تماس با ما</h3>
            <ul className="space-y-2 text-sm text-gray/70">
              <li>۰۲۱-۳۴۵۶۰</li>
              <li>۰۹۱۲۴۰۰۴۰۰۰</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-primary">لینک های مهم</h3>
            <ul className="space-y-2 text-sm text-gray/70">
              <li><a href="#" className="hover:text-primary transition">قیمت پاد</a></li>
              <li><a href="#" className="hover:text-primary transition">خرید جویس</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-primary">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-gray/70">
              <li><a href="#" className="hover:text-primary transition">قوانین و مقررات</a></li>
              <li><a href="#" className="hover:text-primary transition">پیگیری سفارش</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;