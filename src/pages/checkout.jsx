// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiCheck, FiTruck, FiShield, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import { formatPrice, createOrderAndPay } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ province: '', city: '', full_address: '', postal_code: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Fetch saved addresses on mount (Synced with Profile.jsx)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://127.0.0.1:8000/api/v1/auth/me/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setSavedAddresses(data);
            localStorage.setItem('venix_current_user_addresses', JSON.stringify(data));
          } else {
            const localAddr = localStorage.getItem('venix_current_user_addresses');
            if (localAddr) setSavedAddresses(JSON.parse(localAddr));
          }
        })
        .catch(() => {
          const localAddr = localStorage.getItem('venix_current_user_addresses');
          if (localAddr) setSavedAddresses(JSON.parse(localAddr));
        });
    }
  }, []);

  const handleAddressSelect = (addr) => {
    setFormData({
      province: addr.province || '',
      city: addr.city || '',
      full_address: addr.full_address || addr.street || '',
      postal_code: addr.postal_code || '',
      phone: addr.phone || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cartItems.length === 0) { 
      setError('سبد خرید شما خالی است!'); 
      return; 
    }
    
    if (!formData.province || !formData.city || !formData.full_address || !formData.postal_code || !formData.phone) {
      setError('لطفاً تمام فیلدهای آدرس و شماره تماس را به درستی پر کنید.');
      return;
    }

    setLoading(true);

    try {
      const checkoutPayload = {
        items: cartItems.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity
        })),
        shipping_address: {
          province: formData.province,
          city: formData.city,
          full_address: formData.full_address,
          postal_code: formData.postal_code,
          phone: formData.phone
        }
      };

      const paymentData = await createOrderAndPay(checkoutPayload);
      clearCart();
      navigate(`/card-to-card?orderId=${paymentData.order_id}&amount=${paymentData.total_price}`);
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
        <div className="grid grid-cols-1 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/[0.035] border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2"><FiTruck className="text-primary" /> اطلاعات ارسال سفارش</h2>
            
            {/* Single Address Selector at the Top */}
            {savedAddresses.length > 0 && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <label className="block text-sm font-medium text-primary mb-2">انتخاب آدرس از پروفایل</label>
                <select 
                  onChange={(e) => {
                    const addr = savedAddresses.find(a => a.id === parseInt(e.target.value));
                    if (addr) {
                      handleAddressSelect(addr);
                    } else {
                      setFormData({ province: '', city: '', full_address: '', postal_code: '', phone: '' });
                    }
                  }}
                  className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition appearance-none"
                >
                  <option value="">انتخاب کنید یا آدرس جدید وارد نمایید...</option>
                  {savedAddresses.map(addr => (
                    <option key={addr.id} value={addr.id} className="bg-background text-white">
                      {addr.province}، {addr.city} - {addr.full_address || addr.street}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">استان</label>
                <input type="text" name="province" required value={formData.province} onChange={handleChange} autoComplete="off" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" placeholder="تهران" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">شهر</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} autoComplete="off" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" placeholder="تهران" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">آدرس کامل</label>
              <textarea name="full_address" required value={formData.full_address} onChange={handleChange} rows="3" autoComplete="off" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" placeholder="خیابان، کوچه، پلاک، واحد" />
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">کد پستی</label>
                <input type="text" name="postal_code" required value={formData.postal_code} onChange={handleChange} autoComplete="off" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" dir="ltr" placeholder="۱۲۴۵۶۷۸۰" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">شماره تماس</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} autoComplete="off" className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" dir="ltr" placeholder="۰۹۱۲۳۵۶۷۸۹" />
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full bg-button hover:bg-button/90 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-button/20 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> در حال پردازش...</> : <>ادامه و پرداخت <FiChevronLeft /></>}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
