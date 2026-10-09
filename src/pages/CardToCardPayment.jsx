// src/pages/CardToCardPayment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCopy, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { formatPrice } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const CardToCardPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount'); // We will pass this from checkout
  
  const [bankInfo, setBankInfo] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/payment/bank-info`);
        if (res.ok) {
          const data = await res.json();
          setBankInfo(data);
        } else {
          // Use fallback if API returns error
          setBankInfo({
            bank_name: "بانک قرض الحسنه رسالت",
            account_holder_name: "سید امیرعلی موسوی",
            card_number: "5041721246057450",
            sheba_number: "IR790700010001113795841001"
          });
          toast.error('استفاده از اطلاعات پیش‌فرض بانکی');
        }
      } catch (error) {
        console.error("Error fetching bank info", error);
        // Use fallback on network error
        setBankInfo({
          bank_name: "بانک قرض الحسنه رسالت",
          account_holder_name: "سید امیرعلی موسوی",
          card_number: "5041721246057450",
          sheba_number: "IR790700010001113795841001"
        });
        toast.error('خطا در دریافت اطلاعات بانکی - استفاده از اطلاعات پیش‌فرض');
      }
    };
    fetchBankInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('لطفاً شماره پیگیری را وارد کنید');
      return;
    }
    if (!orderId) {
      toast.error('شناسه سفارش یافت نشد');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/payment/submit-tracking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: parseInt(orderId),
          tracking_number: trackingNumber
        })
      });

      if (res.ok) {
        toast.success('شماره پیگیری با موفقیت ثبت شد. منتظر تایید مدیریت باشید.');
        // Clear cart from localStorage if needed
        localStorage.removeItem('cart_items');
        navigate('/profile');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'خطا در ثبت شماره پیگیری');
      }
    } catch (error) {
      toast.error('خطای شبکه رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد!');
  };

  if (!bankInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="animate-pulse">در حال بارگذاری اطلاعات...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">پرداخت کارت به کارت</h1>
            <p className="text-gray-400 text-sm">لطفاً مبلغ زیر را به حساب اعلام شده واریز کرده و شماره پیگیری را وارد نمایید.</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 text-center">
            <p className="text-gray-400 text-sm mb-1">مبلغ قابل پرداخت</p>
            <p className="text-3xl font-black text-primary">{formatPrice(amount || 0)} <span className="text-sm font-normal text-gray-400">تومان</span></p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">نام بانک</p>
                <p className="text-white font-bold">{bankInfo.bank_name}</p>
              </div>
            </div>
            <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">نام صاحب حساب</p>
                <p className="text-white font-bold">{bankInfo.account_holder_name}</p>
              </div>
            </div>
            <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">شماره کارت</p>
                <p className="text-white font-bold font-mono text-lg" dir="ltr">{bankInfo.card_number}</p>
              </div>
              <button onClick={() => copyToClipboard(bankInfo.card_number)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white" title="کپی">
                <FiCopy />
              </button>
            </div>
            <div className="bg-white/[0.025] border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">شماره شبا</p>
                <p className="text-white font-bold font-mono text-sm" dir="ltr">{bankInfo.sheba_number}</p>
              </div>
              <button onClick={() => copyToClipboard(bankInfo.sheba_number)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white" title="کپی">
                <FiCopy />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">شماره پیگیری بانکی</label>
              <input 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="1234567890"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-lg tracking-widest outline-none focus:border-primary transition font-mono"
                dir="ltr"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'در حال ثبت...' : 'پرداخت کردم'} <FiCheckCircle />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CardToCardPayment;