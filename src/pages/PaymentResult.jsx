// src/pages/PaymentResult.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiHome, FiPackage } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const isSuccess = searchParams.get('status') === 'success';
    setTimeout(() => setStatus(isSuccess ? 'success' : 'failed'), 1000);
  }, [searchParams]);

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/[0.035] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          {status === 'loading' && <div className="py-12"><span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto block mb-4"></span><p className="text-white font-bold">در حال بررسی وضعیت پرداخت...</p></div>}
          {status === 'success' && (
            <>
              <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-black text-white mb-3">پرداخت با موفقیت انجام شد!</h1>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">سفارش شما با موفقیت ثبت شد و به زودی پردازش خواهد شد. کد رهگیری برای شما پیامک خواهد شد.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/profile')} className="w-full bg-button hover:bg-button/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"><FiPackage className="w-5 h-5" /> مشاهده سفارشات</button>
                <button onClick={() => navigate('/')} className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"><FiHome className="w-5 h-5" /> بازگشت به خانه</button>
              </div>
            </>
          )}
          {status === 'failed' && (
            <>
              <FiXCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-black text-white mb-3">پرداخت ناموفق بود</h1>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">متاسفانه عملیات پرداخت انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/cart')} className="w-full bg-button hover:bg-button/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2">بازگشت به سبد خرید</button>
                <button onClick={() => navigate('/')} className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"><FiHome className="w-5 h-5" /> بازگشت به خانه</button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default PaymentResult;