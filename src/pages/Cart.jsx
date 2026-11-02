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
          <div className="bg-white/[0.035] border border-white/10 rounded-3xl p-6 md:p-12 max-w-2xl mx-auto">
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

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemId = item.variant_id || item.id;
              
              // ✅ FIX: Use item.price (which is now the correct final_price for the user's group)
              const hasDiscount = item.discount > 0;
              const displayPrice = item.price || 0;
              const strikePrice = hasDiscount ? (item.basePrice || item.price) : null;
              
              return (
                <React.Fragment key={itemId}>
                  {/* --- MOBILE LAYOUT --- */}
                  <div className="md:hidden bg-white/[0.035] border border-white/10 rounded-2xl p-4 transition hover:border-white/20">
                    <div className="flex items-center gap-4 mb-4">
                      <Link to={`/product/${item.product_id || item.id}`} className="w-24 h-24 bg-white/[0.025] rounded-xl flex items-center justify-center shrink-0 group">
                        <img 
                          src={(item.image || item.image_url) ? ((item.image || item.image_url).startsWith('http') ? (item.image || item.image_url) : `http://localhost:8000${item.image || item.image_url}`) : '/category-img.png'} 
                          alt={item.title} 
                          className="w-20 h-20 object-contain group-hover:scale-105 transition duration-300" 
                          onError={(e) => { e.target.onerror = null; e.target.src='/category-img.png'; }}
                        />
                      </Link>
                      <div className="flex-1 text-right">
                        <Link to={`/product/${item.product_id || item.id}`} className="text-sm font-bold text-white hover:text-primary transition line-clamp-2">
                          {item.title}
                        </Link>
                        <p dir="ltr" className="text-xs text-gray-500 mt-1">{item.titleEn}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/[0.025]">
                        <button onClick={() => updateQuantity(itemId, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-base font-bold text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemId, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(itemId)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <FiTrash2 className="w-4 h-4" />
                        <span className="text-sm">حذف</span>
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <div className="text-left">
                        {hasDiscount && strikePrice && (
                          <div className="text-xs text-gray-500 line-through">{formatPrice(strikePrice * item.quantity)}</div>
                        )}
                        <div className="text-lg font-black text-white">{formatPrice(displayPrice * item.quantity)} <span className="text-xs font-normal text-gray-500">تومان</span></div>
                      </div>
                    </div>
                  </div>

                  {/* --- DESKTOP LAYOUT --- */}
                  <div className="hidden md:flex bg-white/[0.035] border border-white/10 rounded-2xl p-4 flex-col sm:flex-row items-center gap-6 transition hover:border-white/20">
                    <Link to={`/product/${item.product_id || item.id}`} className="w-full sm:w-28 h-28 bg-white/[0.025] rounded-xl flex items-center justify-center shrink-0 group">
                      <img 
                        src={(item.image || item.image_url) ? ((item.image || item.image_url).startsWith('http') ? (item.image || item.image_url) : `http://localhost:8000${item.image || item.image_url}`) : '/category-img.png'} 
                        alt={item.title} 
                        className="w-20 h-20 object-contain group-hover:scale-105 transition duration-300" 
                        onError={(e) => { e.target.onerror = null; e.target.src='/category-img.png'; }}
                      />
                    </Link>

                    <div className="flex-1 w-full text-center sm:text-right">
                      <Link to={`/product/${item.product_id || item.id}`} className="text-base font-bold text-white hover:text-primary transition line-clamp-2">
                        {item.title}
                      </Link>
                      <p dir="ltr" className="text-xs text-gray-500 mt-1 text-right">{item.titleEn}</p>
                    </div>

                    <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/[0.025]">
                      <button onClick={() => updateQuantity(itemId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(itemId, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition">
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-center sm:text-left w-full sm:w-auto">
                      {hasDiscount && strikePrice && (
                        <div className="text-xs text-gray-500 line-through mb-1">{formatPrice(strikePrice * item.quantity)}</div>
                      )}
                      <div className="text-lg font-black text-white">{formatPrice(displayPrice * item.quantity)}</div>
                      <div className="text-[10px] text-gray-500 font-medium">تومان</div>
                    </div>

                    <button onClick={() => removeFromCart(itemId)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/checkout" className="block w-full max-w-md bg-button hover:bg-button/90 text-white py-4 rounded-xl font-bold text-center transition shadow-lg shadow-button/20 text-lg">
              ادامه فرآیند خرید ({formatPrice(cartTotal)} تومان)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;