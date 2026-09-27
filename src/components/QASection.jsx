import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const QASection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const questions = [
    { id: 1, question: 'ویپ چیست و چه تفاوتی با سیگار دارد؟', answer: 'ویپ یک دستگاه الکترونیکی است که مایع را بخار می‌کند و نیکوتین را بدون قطران وارد بدن می‌کند.' },
    { id: 2, question: 'چگونه کویل را تعویض کنیم؟', answer: 'کویل را به آرامی از کارتریج بیرون بکشید و کویل جدید را جا بزنید و ۵ دقیقه صبر کنید.' },
    { id: 3, question: 'آیا ارسال شما رایگان است؟', answer: 'برای سفارش‌های بالای ۱ میلیون تومان ارسال رایگان است.' },
  ];

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray">سوالات متداول</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {questions.map((qa, idx) => (
              <button key={qa.id} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full bg-gray/10 rounded-lg px-4 py-3 text-right flex items-center justify-between hover:bg-gray/20 transition text-gray border border-gray/20">
                <span className="font-bold">{qa.question}</span>
                <FiChevronDown className={`transform transition ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
            ))}
          </div>
          <div className="bg-primary/20 rounded-2xl p-6 min-h-[200px] border border-primary/30 flex items-center justify-center">
            {openIndex !== null ? (
              <div>
                <h3 className="font-bold mb-3 text-lg text-primary">{questions[openIndex].question}</h3>
                <p className="text-gray leading-relaxed">{questions[openIndex].answer}</p>
              </div>
            ) : (
              <p className="text-gray/60 text-center">یک سوال را از لیست انتخاب کنید</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QASection;