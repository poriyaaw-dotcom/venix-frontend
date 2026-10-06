// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCheck, FiTruck, FiShield, FiChevronLeft } from 'react-icons/fi';
import { formatPrice } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
        <Header />
        <main className="max-w-[1240px] mx-auto px-4 py-20 text-center">
          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
            <FiShoppingBag className="mx-auto text-gray-600 mb-6" style={{ width: '80px', height: '80px' }} />
            <h1 className="text-2xl font-black text-white mb-3">سبد خرید شما خالی است!</h1>
            <p className="text-gray-400 mb-8">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20">
              بازگشت به فروشگاه
              <FiChevronLeft />
            </Link>
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
          <Link to="/" className="hover:text-primary transition">خانه</Link>
          <FiChevronLeft className="w-3 h-3" />
          <span className="text-primary font-bold">سبد خرید</span>
        </div>
      </div>

      <main className="max-w-[1240px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white mb-8">سبد خرید شما</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-4">
            {cartItems.map((item) => {
              // ✅ FIX: Safely get the unique identifier (variant_id or id)
              const itemId = item.variant_id || item.id;
              const hasDiscount = item.discount > 0;
              const finalPrice = hasDiscount ? item.discountPrice : item.price;
              
              return (
                <div key={itemId} className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6 transition hover:border-white/20">
                  <Link to={`/product/${item.product_id || item.id}`} className="w-full sm:w-28 h-28 bg-white/[0.025] rounded-xl flex items-center justify-center shrink-0 group">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-contain group-hover:scale-105 transition duration-300" />
                  </Link>

                  <div className="flex-1 w-full text-center sm:text-right">
                    <Link to={`/product/${item.product_id || item.id}`} className="text-base font-bold text-white hover:text-primary transition line-clamp-2">
                      {item.title}
                    </Link>
                    <p dir="ltr" className="text-xs text-gray-500 mt-1 text-right">{item.titleEn}</p>
                  </div>

                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/[0.025]">
                    {/* ✅ FIX: Use itemId to ensure CartContext finds the correct item */}
                    <button onClick={() => updateQuantity(itemId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(itemId, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center sm:text-left w-full sm:w-auto">
                    {hasDiscount && (
                      <div className="text-xs text-gray-500 line-through mb-1">{formatPrice(item.price * item.quantity)}</div>
                    )}
                    <div className="text-lg font-black text-white">{formatPrice(finalPrice * item.quantity)}</div>
                    <div className="text-[10px] text-gray-500 font-medium">تومان</div>
                  </div>

                  {/* ✅ FIX: Use itemId for removal */}
                  <button onClick={() => removeFromCart(itemId)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10">خلاصه سفارش</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">مجموع کالاها</span>
                  <span className="text-white font-bold">{formatPrice(cartTotal)} تومان</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">هزینه ارسال</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <FiCheck className="w-3 h-3" /> رایگان
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">تخفیف</span>
                  <span className="text-red-400 font-bold">۰ تومان</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-white/10 mb-6">
                <span className="text-base font-bold text-white">مبلغ قابل پرداخت</span>
                <div className="text-2xl font-black text-primary">
                  {formatPrice(cartTotal)} <span className="text-xs font-normal text-gray-400">تومان</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full bg-button hover:bg-button/90 text-white py-4 rounded-xl font-bold text-center transition shadow-lg shadow-button/20">
                ادامه فرآیند خرید
              </Link>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 text-center">
                  <FiTruck className="mx-auto mb-1 text-primary w-5 h-5" />
                  <span className="text-[10px] text-gray-400">ارسال سریع</span>
                </div>
                <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 text-center">
                  <FiShield className="mx-auto mb-1 text-primary w-5 h-5" />
                  <span className="text-[10px] text-gray-400">ضمانت اصالت</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;