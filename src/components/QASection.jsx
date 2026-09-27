import React, { useState } from 'react';

const QASection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const questions = [
    { id: 1, q: 'ویپ چیست و چه تفاوتی با سیگار دارد؟', a: 'ویپ یک دستگاه الکترونیکی است که با گرم کردن مایع مخصوص (جویس)، بخاری تولید می‌کند که حاوی نیکوتین و طعم‌دهنده است. برخلاف سیگار، ویپ قطران و مواد شیمیایی مضر کمتری دارد.' },
    { id: 2, q: 'چگونه کویل را تعویض کنیم؟', a: 'کویل را به آرامی از کارتریج بیرون بکشید و کویل جدید را جا بزنید. حتماً ۵ دقیقه صبر کنید تا پنبه کاملاً به جویس آغشته شود و سپس دستگاه را روشن کنید.' },
    { id: 3, q: 'آیا ارسال شما رایگان است؟', a: 'بله، برای تمامی سفارش‌های بالای ۱ میلیون تومان، ارسال به سراسر کشور کاملاً رایگان و با بسته‌بندی ایمن انجام می‌شود.' },
    { id: 4, q: 'گارانتی محصولات چگونه است؟', a: 'تمامی دستگاه‌های ویپ و پاد سیستم موجود در فروشگاه دارای ۶ ماه گارانتی تعویض بی‌قید و شرط در صورت خرابی فنی هستند.' },
    { id: 5, q: 'چگونه سفارش خود را پیگیری کنیم؟', a: 'پس از ثبت سفارش، کد رهگیری پستی برای شما پیامک می‌شود. همچنین می‌توانید از طریق پنل کاربری خود وضعیت سفارش را مشاهده کنید.' },
    { id: 6, q: 'آیا محصولات اصل هستند؟', a: 'بله، تمامی محصولات ما مستقیماً از نمایندگی‌های رسمی وارد می‌شوند و دارای ضمانت اصالت کالا و کد رجیستری معتبر هستند.' },
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