// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.venixpodshop.ir';
const ADMIN_PHONE_NUMBERS = ['09127467261', '09019244403']; // ✅ Hardcoded security check

const AdminLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
      value = value.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    value = value.replace(/\D/g, '').slice(0, 11);
    setPhone(value);
  };

  const handleOtpChange = (e) => {
    let value = e.target.value;
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
      value = value.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    value = value.replace(/\D/g, '').slice(0, 5);
    setOtp(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length !== 11 || !phone.startsWith('09')) {
      setError('شماره موبایل نامعتبر است. فرمت صحیح: ۰۹xxxxxxxxx');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
      });
      
      if (res.ok) {
        setStep(2);
        setCooldown(60);
      } else {
        setError('خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
      }
    } catch { 
      setError('خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 5) {
      setError('کد تایید نامعتبر است.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // ✅ FRONTEND SECURITY CHECK
        if (data.user?.is_admin && ADMIN_PHONE_NUMBERS.includes(data.user?.phone_number)) {
          localStorage.setItem('token', data.access_token);
          navigate('/admin');
        } else {
          setError('این شماره مجاز به ورود به پنل مدیریت نیست.');
          setOtp('');
        }
      } else {
        setError(data.detail || 'کد نامعتبر است یا منقضی شده است.');
        setOtp('');
      }
    } catch { 
      setError('خطای شبکه. لطفاً دوباره تلاش کنید.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] font-sans text-gray-200 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <FiShield className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            {step === 1 ? 'ورود به پنل مدیریت' : 'تایید هویت مدیر'}
          </h1>
          <p className="text-gray-400 text-sm">
            {step === 1 
              ? 'برای دسترسی به داشبورد، شماره مدیر را وارد کنید' 
              : `کد ارسال شده به ${phone} را وارد کنید`}
          </p>
        </div>

        <div className="bg-white/[0.035] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-sm flex items-center justify-center gap-2">
              <FiAlertCircle /> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2">شماره موبایل مدیر</label>
                <div className="relative">
                  <FiShield className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    placeholder="۰۹xxxxxxxxx" 
                    required 
                    maxLength="11"
                    inputMode="numeric"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white placeholder-gray-600 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" 
                    dir="ltr" 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className={`w-full font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 ${phone.length > 0 ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                ) : (
                  <>دریافت کد تایید <FiArrowLeft /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-2 text-center">کد تایید ۵ رقمی</label>
                <div className="relative">
                  <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input 
                    type="text"
                    value={otp} 
                    onChange={handleOtpChange} 
                    placeholder="-----" 
                    required 
                    maxLength="5" 
                    inputMode="numeric" 
                    autoComplete="one-time-code"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white text-center text-2xl tracking-[0.5em] outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" 
                    dir="ltr" 
                  />
                </div>
              </div>
              
              {cooldown > 0 ? (
                <p className="text-center text-gray-400 text-sm">
                  ارسال مجدد کد در <span className="text-yellow-500 font-bold">{cooldown}</span> ثانیه
                </p>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="text-yellow-500 text-sm hover:underline mb-2 block w-full text-center font-medium"
                >
                  تغییر شماره موبایل
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                ) : (
                  <>ورود به داشبورد <FiShield /></>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          این بخش فقط برای مدیران سیستم ونیکس در دسترس است.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;