// src/pages/Contact.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiChevronLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-[1240px] mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-primary transition">خانه</Link>
          <FiChevronLeft className="w-3 h-3" />
          <span className="text-primary font-bold">تماس با ما</span>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3">تماس با ما</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            تیم پشتیبانی ونیکس در سریع‌ترین زمان ممکن به شما پاسخ خواهد داد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Phone */}
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4 hover:border-primary/30 transition">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
              <FiPhone className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">تماس تلفنی</h3>
              <p dir="ltr" className="text-lg md:text-xl font-bold text-white text-right mt-1 md:mt-2">09127467261</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4 hover:border-primary/30 transition">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
              <FiMail className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">ایمیل پشتیبانی</h3>
              <p dir="ltr" className="text-base md:text-lg font-bold text-white text-right mt-1 md:mt-2 break-all">erfan3xam.8731@gmail.com</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4 hover:border-primary/30 transition">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
              <FiMapPin className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">آدرس فروشگاه</h3>
              <p className="text-sm text-gray-400 leading-7 mt-2">
                تهران - مولوی - بازار حضرتی
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4 hover:border-primary/30 transition">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
              <FiClock className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">ساعات کاری</h3>
              <p className="text-sm text-gray-400 leading-7 mt-2">
                شنبه تا چهارشنبه: ۹ الی ۱۷<br />
                پنجشنبه: ۱۰ الی ۱۶
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
