// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiPhone, FiShield, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ The ONLY phone number allowed to access the admin panel
  const ADMIN_PHONE_NUMBER = '09127467261';

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://api.venixpodshop.com/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      });
      
      if (res.ok) {
        toast.success('کد تایید ارسال شد');
        setStep(2);
      } else {
        const data = await res.json();
        toast.error(data.detail || 'خطا در ارسال کد');
      }
    } catch (error) {
      toast.error('خطای شبکه');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://api.venixpodshop.com/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp }),
      });
      
      const data = await res.json();

      if (res.ok) {
        const token = data.access_token;
        
        // Decode token to check admin status and phone number
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const payload = JSON.parse(jsonPayload);

        // ✅ DOUBLE SECURITY CHECK: Must be admin AND must be the exact phone number
        const isCorrectNumber = payload.phone_number === ADMIN_PHONE_NUMBER || payload.sub === ADMIN_PHONE_NUMBER;
        
        if (payload.is_admin && isCorrectNumber) {
          localStorage.setItem('token', token);
          toast.success('خوش آمدید، مدیر عزیز!');
          navigate('/admin');
        } else {
          toast.error('دسترسی غیرمجاز: این حساب کاربری مجاز به ورود نیست.');
          localStorage.removeItem('token'); // Immediately destroy any invalid token
        }
      } else {
        toast.error(data.detail || 'کد تایید اشتباه است.');
      }
    } catch (error) {
      toast.error('خطای شبکه');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">ورود به پنل مدیریت</h1>
          <p className="text-gray-400 text-sm">
            {step === 1 ? 'شماره تماس مدیریتی خود را وارد کنید' : 'کد ارسال شده به گوشی خود را وارد کنید'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">شماره تماس</label>
              <div className="relative">
                <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-white outline-none focus:border-primary transition"
                  placeholder="09123456789"
                  required
                  dir="ltr"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال ارسال...' : 'دریافت کد تایید'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">کد تایید</label>
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-white outline-none focus:border-primary transition text-center text-2xl tracking-widest"
                  placeholder="-----"
                  required
                  dir="ltr"
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'در حال بررسی...' : 'ورود به پنل'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-gray-400 hover:text-white text-sm font-medium transition"
            >
              بازگشت و اصلاح شماره
            </button>
          </form>
        )}

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-200/80 leading-relaxed">
            این بخش فقط مخصوص مدیران سیستم است. ورود با حساب کاربری عادی امکان‌پذیر نیست و تلاش‌های ناموفق ثبت و مسدود می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;