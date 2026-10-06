// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiCheck, FiTruck, FiShield, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import { formatPrice, createOrderAndPay } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ province: '', city: '', full_address: '', postal_code: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cartItems.length === 0) { 
      setError('سبد خرید شما خالی است!'); 
      return; 
    }
    
    if (!formData.province || !formData.city || !formData.full_address || !formData.postal_code) {
      setError('لطفاً تمام فیلدهای آدرس را به درستی پر کنید.');
      return;
    }

    setLoading(true);

    try {
      // ✅ Construct the authoritative payload expected by the backend
      const checkoutPayload = {
        items: cartItems.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        })),
        shipping_address: {
          province: formData.province,
          city: formData.city,
          full_address: formData.full_address,
          postal_code: formData.postal_code
        }
      };

      const paymentData = await createOrderAndPay(checkoutPayload);
      
      // Clear cart only after successful order creation
      clearCart();
      
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        // Fallback if payment gateway URL is not yet returned by backend
        alert(`سفارش با موفقیت ثبت شد! \nشماره سفارش: ${paymentData.order_id}\nمبلغ: ${paymentData.total_price} تومان`);
        navigate('/'); 
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
        <Header />
        <main className="max-w-[1240px] mx-auto px-4 py-20 text-center">
          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
            <FiAlertCircle className="mx-auto text-gray-600 mb-6" style={{ width: '80px', height: '80px' }} />
            <h1 className="text-2xl font-black text-white mb-3">سبد خرید شما خالی است!</h1>
            <button onClick={() => navigate('/cart')} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20 mt-4">
              بازگشت به سبد خرید <FiChevronLeft />
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
      <Header />
      <div className="max-w-[1240px] mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-primary transition">خانه</button>
          <FiChevronLeft className="w-3 h-3" />
          <button onClick={() => navigate('/cart')} className="hover:text-primary transition">سبد خرید</button>
          <FiChevronLeft className="w-3 h-3" />
          <span className="text-primary font-bold">تسویه حساب</span>
        </div>
      </div>
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-8">تسویه حساب و پرداخت</h1>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"><FiAlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span></div>}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <form onSubmit={handleSubmit} className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2"><FiTruck className="text-primary" /> اطلاعات ارسال سفارش</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">استان</label>
                <input type="text" name="province" required value={formData.province} onChange={handleChange} className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder-gray-600" placeholder="مثال: تهران" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">شهر</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder-gray-600" placeholder="مثال: تهران" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">آدرس کامل</label>
              <textarea name="full_address" required value={formData.full_address} onChange={handleChange} rows="3" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder-gray-600" placeholder="خیابان، کوچه، پلاک، واحد" />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-2">کد پستی</label>
              <input type="text" name="postal_code" required value={formData.postal_code} onChange={handleChange} className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder-gray-600" placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰" dir="ltr" />
            </div>
            <button type="submit" disabled={loading} className={`w-full bg-button hover:bg-button/90 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-button/20 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> در حال پردازش...</> : <>ادامه و پرداخت <FiChevronLeft /></>}
            </button>
          </form>
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10">خلاصه سفارش</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-400">مجموع کالاها</span><span className="text-white font-bold">{formatPrice(cartTotal)} تومان</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">هزینه ارسال</span><span className="text-green-400 font-bold flex items-center gap-1"><FiCheck className="w-3 h-3" /> رایگان</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">تخفیف</span><span className="text-red-400 font-bold">۰ تومان</span></div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-white/10 mb-6">
                <span className="text-base font-bold text-white">مبلغ قابل پرداخت</span>
                <div className="text-2xl font-black text-primary">{formatPrice(cartTotal)} <span className="text-xs font-normal text-gray-400">تومان</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 text-center"><FiTruck className="mx-auto mb-1 text-primary w-5 h-5" /><span className="text-[10px] text-gray-400">ارسال سریع</span></div>
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 text-center"><FiShield className="mx-auto mb-1 text-primary w-5 h-5" /><span className="text-[10px] text-gray-400">ضمانت اصالت</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;