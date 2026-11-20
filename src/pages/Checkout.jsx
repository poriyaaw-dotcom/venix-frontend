// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiCheck, FiTruck, FiShield, FiChevronLeft, FiChevronDown, FiAlertCircle, FiCreditCard } from 'react-icons/fi';
import { formatPrice, createOrderAndPay } from '../utils/api';
import { provinces } from '../utils/iranLocations';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    province: '', city: '', full_address: '', postal_code: '', phone: '',
    payment_method: 'card_to_card'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);

  // ✅ Derived city list based on selected province
  const selectedProvince = provinces.find(p => p.name_fa === formData.province);
  const cityOptions = selectedProvince ? selectedProvince.cities : [];
  const isTehran = formData.province === 'تهران';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Province change: reset city, and force payment method off COD if leaving Tehran
  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    setFormData(prev => ({
      ...prev,
      province: newProvince,
      city: '',
      payment_method: (newProvince !== 'تهران' && prev.payment_method === 'cash_on_delivery')
        ? 'card_to_card'
        : prev.payment_method
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/me/addresses`, {
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
      phone: addr.phone || '',
      payment_method: formData.payment_method
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) { setError('سبد خرید شما خالی است!'); return; }

    if (!formData.province || !formData.city || !formData.full_address || !formData.postal_code || !formData.phone) {
      setError('لطفاً تمام فیلدهای آدرس و شماره تماس را به درستی پر کنید.');
      return;
    }

    // ✅ Tehran-only COD guard (kept + hardened)
    if (formData.payment_method === 'cash_on_delivery' && formData.province.trim() !== 'تهران') {
      setError('پرداخت درب منزل فقط برای استان تهران امکان‌پذیر است. لطفاً روش پرداخت را تغییر دهید.');
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED PAYLOAD: Parse integers and remove 'phone' to match backend schema exactly
      const checkoutPayload = {
        items: cartItems.map(item => ({ 
          variant_id: parseInt(item.variant_id || item.id, 10), 
          quantity: parseInt(item.quantity, 10) 
        })),
        shipping_address: {
          province: formData.province,
          city: formData.city,
          full_address: formData.full_address,
          postal_code: formData.postal_code
        },
        payment_method: formData.payment_method
      };

      const paymentData = await createOrderAndPay(checkoutPayload);
      clearCart();

      if (formData.payment_method === 'cash_on_delivery') {
        navigate(`/profile?tab=orders&success=cod`);
      } else {
        navigate(`/card-to-card?orderId=${paymentData.order_id}&amount=${paymentData.total_price}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  // ✅ Reusable dark-themed select styling
  const selectClass = "w-full bg-white/[0.025] border border-white/10 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition appearance-none";

  if (cartItems.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
        <Header />
        <main className="max-w-[1240px] mx-auto px-4 py-20 text-center">
          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-6 md:p-12 max-w-2xl mx-auto">
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
        <h1 className="text-2xl md:text-3xl font-black text-white mb-8">تسویه حساب و پرداخت</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 h-fit">
            <h2 className="text-lg md:text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
              <FiTruck className="text-primary" /> اطلاعات ارسال سفارش
            </h2>

            {savedAddresses.length > 0 && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <label className="block text-sm font-medium text-primary mb-2">انتخاب آدرس از پروفایل</label>
                <select
                  onChange={(e) => {
                    const addr = savedAddresses.find(a => a.id === parseInt(e.target.value));
                    if (addr) handleAddressSelect(addr);
                    else setFormData({ province: '', city: '', full_address: '', postal_code: '', phone: '', payment_method: formData.payment_method });
                  }}
                  className={`${selectClass}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Province */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">استان</label>
                <div className="relative">
                  <select name="province" required value={formData.province} onChange={handleProvinceChange} className={selectClass}>
                    <option value="">انتخاب استان...</option>
                    {provinces.map(p => <option key={p.name_fa} value={p.name_fa} className="bg-background text-white">{p.name_fa}</option>)}
                    {/* Fallback for old free-text saved addresses */}
                    {formData.province && !provinces.some(p => p.name_fa === formData.province) && (
                      <option value={formData.province} className="bg-background text-white">{formData.province}</option>
                    )}
                  </select>
                  <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">شهر</label>
                <div className="relative">
                  <select
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.province}
                    className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">{formData.province ? 'انتخاب شهر...' : 'ابتدا استان را انتخاب کنید'}</option>
                    {cityOptions.map(c => <option key={c.name_fa} value={c.name_fa} className="bg-background text-white">{c.name_fa}</option>)}
                    {formData.city && !cityOptions.some(c => c.name_fa === formData.city) && (
                      <option value={formData.city} className="bg-background text-white">{formData.city}</option>
                    )}
                  </select>
                  <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">آدرس کامل</label>
              <textarea name="full_address" required value={formData.full_address} onChange={handleChange} rows="3" autoComplete="off"
                className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="خیابان، کوچه، پلاک، واحد" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">کد پستی</label>
                <input type="text" name="postal_code" required value={formData.postal_code} onChange={handleChange} autoComplete="off"
                  className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  dir="ltr" placeholder="1245678901" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">شماره تماس</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} autoComplete="off"
                  className="w-full bg-white/[0.025] border border-white/10 rounded-xl px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  dir="ltr" placeholder="09123456789" />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-3">روش پرداخت</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${formData.payment_method === 'card_to_card' ? 'bg-primary/10 border-primary' : 'bg-white/[0.025] border-white/10 hover:border-white/30'}`}>
                  <input type="radio" name="payment_method" value="card_to_card" checked={formData.payment_method === 'card_to_card'} onChange={handleChange} className="hidden" />
                  <FiCreditCard className={`w-6 h-6 ${formData.payment_method === 'card_to_card' ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="font-bold text-white">کارت به کارت</span>
                </label>

                {/* ✅ COD option: visually disabled outside Tehran */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border transition ${!isTehran ? 'bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed' : formData.payment_method === 'cash_on_delivery' ? 'bg-primary/10 border-primary cursor-pointer' : 'bg-white/[0.025] border-white/10 hover:border-white/30 cursor-pointer'}`}>
                  <input type="radio" name="payment_method" value="cash_on_delivery" checked={formData.payment_method === 'cash_on_delivery'} onChange={handleChange} className="hidden" disabled={!isTehran} />
                  <FiTruck className={`w-6 h-6 ${formData.payment_method === 'cash_on_delivery' && isTehran ? 'text-primary' : 'text-gray-500'}`} />
                  <span className="font-bold text-white">پرداخت درب منزل</span>
                  {!isTehran && <span className="mr-auto text-[11px] text-gray-500">(فقط تهران)</span>}
                </label>
              </div>

              {formData.payment_method === 'cash_on_delivery' && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-200 leading-relaxed">
                    <span className="font-bold">توجه:</span> پرداخت درب منزل <span className="font-bold">فقط برای استان تهران</span> امکان‌پذیر است.
                  </p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className={`w-full bg-button hover:bg-button/90 text-white font-bold py-3.5 md:py-4 rounded-xl transition shadow-lg shadow-button/20 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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