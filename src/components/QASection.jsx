import React, { useState } from 'react';

const QASection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

    const questions = [
    { id: 1, q: 'ویپ و پاد چه تفاوتی با یکدیگر دارند؟', a: 'ویپ و پاد هر دو دستگاه‌های الکترونیکی برای مصرف ای‌جویس هستند، اما از نظر اندازه، توان و نوع استفاده تفاوت دارند. پادها معمولاً کوچک‌تر، سبک‌تر و ساده‌تر هستند و برای استفاده روزمره گزینه راحت‌تری محسوب می‌شوند. ویپ‌ها معمولاً قدرت و قابلیت تنظیم بیشتری دارند و برای افرادی طراحی شده‌اند که کنترل بیشتری روی بخار و تنظیمات دستگاه می‌خواهند.' },
    { id: 2, q: 'پاد سیستم برای چه افرادی مناسب است؟', a: 'پاد سیستم به دلیل ابعاد کوچک، وزن کم و استفاده آسان، برای افرادی که دستگاهی قابل حمل و ساده می‌خواهند مناسب‌تر است. با این حال، محصولات حاوی نیکوتین برای افراد غیرسیگاری، افراد زیر سن قانونی و در دوران بارداری مناسب نیستند.' },
    { id: 3, q: 'عمر کویل یا کارتریج پاد چقدر است؟', a: 'عمر کویل یا کارتریج به میزان استفاده، نوع ای‌جویس و نحوه استفاده از دستگاه بستگی دارد. معمولاً کاهش طعم، کاهش بخار یا ایجاد مزه سوختگی می‌تواند نشانه زمان تعویض کویل یا کارتریج باشد. برای افزایش عمر آن، بهتر است مخزن را بیش از حد خالی نگذارید و از توان مناسب دستگاه استفاده کنید.' },
    { id: 4, q: 'چه زمانی باید کویل ویپ یا پاد را تعویض کنیم؟', a: 'اگر طعم بخار تغییر کرده، مزه سوختگی احساس می‌کنید، مقدار بخار کاهش یافته یا نشتی و عملکرد دستگاه غیرعادی شده است، ممکن است زمان تعویض کویل یا کارتریج رسیده باشد. استفاده از کویل مناسب و رعایت دستورالعمل سازنده می‌تواند به عملکرد بهتر دستگاه کمک کند.' },
    { id: 5, q: 'چطور از ویپ یا پاد خود بهتر نگهداری کنیم؟', a: 'برای افزایش عمر دستگاه، آن را دور از گرمای شدید و رطوبت نگهداری کنید، اتصالات را تمیز نگه دارید و از شارژر و کابل مناسب استفاده کنید. همچنین بهتر است دستگاه را طبق دستورالعمل شرکت سازنده شارژ و استفاده کنید و در صورت مشاهده آسیب به باتری یا بدنه، از دستگاه استفاده نکنید.' },
    { id: 6, q: 'هنگام خرید ویپ یا پاد به چه نکاتی توجه کنیم؟', a: 'هنگام خرید باید به نوع دستگاه، ظرفیت باتری، نوع کویل یا کارتریج، قابلیت تنظیم توان، ظرفیت مخزن و کیفیت ساخت توجه کنید. همچنین بهتر است محصول را از فروشگاه معتبر تهیه کنید تا از اصالت کالا و سازگاری قطعات و لوازم جانبی مطمئن باشید.' },
  ];

  return (
    // Exact size 1440x607
    <section className="my-[35px] w-full flex justify-center">
      <div className="w-full max-w-[1440px] h-[607px] bg-[#1a2236] rounded-[30px] flex items-center justify-center relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute text-[250px] text-white/[0.03] font-black select-none pointer-events-none" style={{ top: '-5%', right: '10%' }}>?</div>
        <div className="absolute text-[200px] text-white/[0.03] font-black select-none pointer-events-none" style={{ bottom: '-5%', left: '10%' }}>?</div>

        {/* Constrained to 1197px for perfect alignment */}
        <div className="max-w-[1197px] w-full mx-auto px-6 flex gap-8 z-10">
          
          {/* Right Side: Questions (476px wide) */}
          <div className="w-[476px] flex flex-col gap-3">
            {questions.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                // Exact size 476x55
                className={`w-[476px] h-[55px] rounded-xl flex items-center justify-between px-6 transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-[#2a3b5c] text-white shadow-lg border border-white/10'
                    : 'bg-[#232d45] text-gray-400 hover:bg-[#2a3b5c]/50 border border-transparent'
                }`}
              >
                <span className="text-sm font-medium">{item.q}</span>
                <span className={`text-xl transition-transform duration-300 ${activeIndex === index ? 'rotate-45' : ''}`}>+</span>
              </button>
            ))}
          </div>

          {/* Left Side: Answer Box (Matches height of 6 questions + gaps) */}
          {/* 6 * 55px + 5 * 12px gap = 390px */}
          <div className="flex-1 h-[390px] bg-[#232d45] rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-white/5 shadow-2xl">
            <h3 className="text-xl font-bold text-primary mb-4">
              {questions[activeIndex].q}
            </h3>
            <p className="text-gray-300 leading-relaxed text-base max-w-lg">
              {questions[activeIndex].a}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QASection;