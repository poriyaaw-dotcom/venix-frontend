// src/pages/Contact.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiChevronLeft } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('پیام شما با موفقیت ارسال شد! (این یک دمو است)');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      <main className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">تماس با ما</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            سوال، پیشنهاد یا انتقادی دارید؟ تیم پشتیبانی ویپ ۶۰ در سریع‌ترین زمان ممکن به شما پاسخ خواهد داد.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Right Side: Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                <FiPhone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">تماس تلفنی</h3>
                <p className="text-sm text-gray-400 mb-2">پاسخگویی از ۹ صبح تا ۹ شب</p>
                <p dir="ltr" className="text-lg font-bold text-white text-right">021 - 1234 5678</p>
              </div>
            </div>

            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">ایمیل پشتیبانی</h3>
                <p className="text-sm text-gray-400 mb-2">پاسخگویی در کمتر از ۲۴ ساعت</p>
                <p dir="ltr" className="text-lg font-bold text-white text-right">support@venixshop.com</p>
              </div>
            </div>

            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                <FiMapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">آدرس فروشگاه</h3>
                <p className="text-sm text-gray-400 leading-7">
                  تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳، طبقه دوم، واحد ۴
                </p>
              </div>
            </div>

            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                <FiClock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">ساعات کاری</h3>
                <p className="text-sm text-gray-400 leading-7">
                  شنبه تا چهارشنبه: ۹:۰۰ الی ۲۱:۰۰<br />
                  پنج‌شنبه: ۹:۰۰ الی ۱۵:۰۰
                </p>
              </div>
            </div>
          </div>

          {/* Left Side: Contact Form */}
          <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-xl font-bold text-white mb-6">ارسال پیام به ما</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition" 
                    placeholder="مثلا: علی رضایی"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">شماره تماس یا ایمیل</label>
                  <input 
                    type="text" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition" 
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">موضوع پیام</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition" 
                  placeholder="مثلا: پیگیری سفارش"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">متن پیام</label>
                <textarea 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition resize-none" 
                  placeholder="پیام خود را بنویسید..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-button hover:bg-button/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-button/20"
              >
                <FiSend className="w-5 h-5" />
                ارسال پیام
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;