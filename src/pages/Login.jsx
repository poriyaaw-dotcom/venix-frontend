// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft, FiBriefcase } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const Login = () => {
  const navigate = useNavigate();
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ NEW: Track if OTP has been sent at least once
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Request OTP function with error handling
  const requestOTP = async () => {
    setErrorMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
      });
      
      if (res.status === 429) {
        const data = await res.json();
        setErrorMessage(data.detail || 'لطفاً ۶۰ ثانیه صبر کنید');
        setCooldown(60);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to send OTP');
      
      // ✅ Mark as sent and start cooldown
      setIsOtpSent(true);
      setCooldown(60);
    } catch (err) {
      setErrorMessage('خطا در ارسال کد تایید');
      console.error(err);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
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
        setIsOtpSent(true); // ✅ Mark as sent
        setCooldown(60);    // ✅ Start cooldown
      } else {
        setError('خطا در ارسال کد');
      }
    } catch { 
      setError('خطای شبکه'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp })
      });
      
      // Handle 429 Too Many Requests
      if (res.status === 429) {
        const data = await res.json();
        setErrorMessage(data.detail || 'تعداد تلاش‌های ناموفق بیش از حد است');
        setCooldown(60);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        if (isPartnerMode) {
          setStep(3);
        } else {
          if (data.user?.is_admin) navigate('/admin');
          else navigate('/profile');
        }
      } else {
        setError(data.detail || 'کد نامعتبر است');
        setOtp(''); // ✅ Automatically clear the wrong code
      }
    } catch { 
      setError('خطای شبکه'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/partner-request`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          business_name: businessName, 
          description: businessDesc,
          first_name: firstName,
          last_name: lastName
        })
      });
      
      if (res.ok) {
        const saved = localStorage.getItem(`venix_data_${phone}`);
        const data = saved ? JSON.parse(saved) : {};
        data.fullName = `${firstName} ${lastName}`.trim();
        data.businessName = businessName;
        localStorage.setItem(`venix_data_${phone}`, JSON.stringify(data));
        
        alert('درخواست همکاری شما با موفقیت ثبت شد!');
        navigate('/profile');
      } else {
        const err = await res.json();
        setError(err.detail || 'خطا در ثبت درخواست');
      }
    } catch { 
      setError('خطای شبکه'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/[0.035] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex bg-black/20 rounded-xl p-1 mb-8">
            <button onClick={() => { setIsPartnerMode(false); setStep(1); }} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${!isPartnerMode ? 'bg-primary text-white' : 'text-gray-400'}`}>ورود مشتری</button>
            <button onClick={() => { setIsPartnerMode(true); setStep(1); }} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${isPartnerMode ? 'bg-primary text-white' : 'text-gray-400'}`}>همکار هستم</button>
          </div>

          <h2 className="text-2xl font-black text-white mb-2 text-center">
            {isPartnerMode ? (step === 3 ? 'ثبت درخواست همکاری' : 'ورود همکاران') : 'ورود به حساب کاربری'}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            {isPartnerMode ? 'پس از تایید مدیریت، دسترسی عمده برای شما فعال می‌شود.' : 'برای ادامه شماره موبایل خود را وارد کنید'}
          </p>

          {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-center text-sm">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09XXXXXXXXX" required className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white outline-none focus:border-primary transition" dir="ltr" />
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                {loading ? '...' : 'دریافت کد تایید'} <FiArrowLeft />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="12345" required maxLength="5" inputMode="numeric" className="w-full bg-black/20 border border-white/10 rounded-xl pr-12 pl-4 py-4 text-white text-center text-2xl tracking-widest outline-none focus:border-primary transition" dir="ltr" />
              </div>
              
              {/* ✅ ONLY show resend/countdown AFTER the first code is sent */}
              {isOtpSent && cooldown > 0 && (
                <p className="text-center text-gray-400 text-sm mb-4">
                  ارسال مجدد کد در {cooldown} ثانیه
                </p>
              )}
              {isOtpSent && cooldown === 0 && (
                <button 
                  type="button" 
                  onClick={requestOTP}
                  className="text-primary text-sm hover:underline mb-4 block w-full text-center"
                >
                  ارسال مجدد کد تایید
                </button>
              )}
              {errorMessage && (
                <p className="text-red-400 text-sm text-center mb-4">{errorMessage}</p>
              )}
              
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition">
                {loading ? '...' : 'ورود به حساب'}
              </button>
              <button type="button" onClick={() => { setStep(1); setIsOtpSent(false); setCooldown(0); setErrorMessage(''); }} className="w-full text-gray-400 text-sm hover:text-white">تغییر شماره</button>
            </form>
          )}

          {step === 3 && isPartnerMode && (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="نام" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
                <input type="text" placeholder="نام خانوادگی" value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
              </div>
              <input type="text" placeholder="نام فروشگاه / شرکت" value={businessName} onChange={e => setBusinessName(e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
              <textarea placeholder="توضیحات یا مدارک (اختیاری)" value={businessDesc} onChange={e => setBusinessDesc(e.target.value)} rows="3" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />
              
              <button type="submit" disabled={loading} className="w-full bg-button hover:bg-button/90 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                <FiBriefcase /> {loading ? '...' : 'ثبت درخواست همکاری'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;