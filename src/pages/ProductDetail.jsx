// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiShoppingCart, FiStar, FiSend, FiHeart, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiSettings } from 'react-icons/fi';
import { useCart } from '../Context/CartContext';
import { fetchProductById, formatPrice } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const StarRating = ({ filled = 5, size = "w-4 h-4" }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => <FiStar key={s} className={`${size} ${s <= filled ? 'text-primary fill-primary' : 'text-gray-700'}`} />)}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) return <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center"><span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></span></div>;
  if (!product) return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">محصول موردنظر وجود ندارد.</p>
        <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">بازگشت به فروشگاه</Link>
      </div>
    </div>
  );

  const hasDiscount = product.discount > 0;
  const price = hasDiscount ? product.discountPrice : product.price;
  
  // ✅ Safe brand extraction
  const brandName = product.brand ? (typeof product.brand === 'object' ? product.brand.name : product.brand) : null;

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
      <Header />
      <div className="max-w-[1240px] mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-primary">خانه</Link>
          <FiChevronLeft className="w-3 h-3" />
          <Link to="/shop" className="hover:text-primary">فروشگاه</Link>
          <FiChevronLeft className="w-3 h-3" />
          <span className="text-gray-300 truncate max-w-[220px]">{product.title}</span>
        </div>
      </div>
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
          <div className="relative">
            <div className="bg-[#FDF8E8]/[0.035] border border-white/10 rounded-[28px] p-5 relative">
              <button onClick={() => setIsFavorite(!isFavorite)} className={`absolute top-8 right-8 z-10 w-11 h-11 rounded-full flex items-center justify-center border transition ${isFavorite ? 'bg-primary/15 border-primary text-primary' : 'bg-black/20 border-white/10 text-gray-400 hover:text-primary'}`}>
                <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              {hasDiscount && <div className="absolute top-8 left-8 z-10 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full">فروش ویژه</div>}
              <div className="h-[420px] flex items-center justify-center">
                <img src={product.image} alt={product.title} className="max-h-[360px] max-w-[90%] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[{icon: FiTruck, text: 'ارسال سریع'}, {icon: FiShield, text: 'خرید امن'}, {icon: FiCheck, text: 'ضمانت اصالت'}].map((item, i) => (
                <div key={i} className="bg-white/[0.025] border border-white/10 rounded-2xl p-4 text-center">
                  <item.icon className="mx-auto mb-2 text-primary" />
                  <span className="text-[11px] text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            {/* ✅ Safe Brand Display */}
            {brandName && (
              <span className="inline-block bg-white/10 text-primary text-xs px-3 py-1 rounded-full font-bold mb-2 w-fit">
                برند: {brandName}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">{product.title}</h1>
            <p dir="ltr" className="text-sm text-gray-500 mt-2 text-right">{product.titleEn}</p>
            <div className="flex items-center gap-3 mt-5 pb-6 border-b border-white/10">
              <StarRating filled={5} />
              <span className="text-xs text-gray-400">۵ از ۵</span>
            </div>
            <p className="text-sm text-gray-400 leading-7 mt-6">{product.description}</p>
            
            {/* ✅ Safe Attributes Display */}
            {product.attributes && Array.isArray(product.attributes) && product.attributes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FiSettings className="text-primary" /> مشخصات فنی
                </h3>
                <div className="bg-white/[0.035] border border-white/10 rounded-2xl overflow-hidden">
                  {product.attributes.map((attr, idx) => (
                    <div key={attr.id || idx} className={`flex justify-between p-4 ${idx !== product.attributes.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <span className="text-gray-400 text-sm">{attr.name}</span>
                      <span className="text-white text-sm font-medium text-left" dir="ltr">
                        {attr.values && Array.isArray(attr.values) 
                          ? attr.values.map(v => v.value).join('، ') 
                          : (attr.value || 'نامشخص')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-400">موجود در انبار</span>
            </div>
            <div className="mt-5 bg-white/[0.035] border border-white/10 rounded-2xl p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  {hasDiscount && <div className="text-sm text-gray-500 line-through mb-1">{formatPrice(product.price)} تومان</div>}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{formatPrice(price)}</span>
                    <span className="text-xs text-gray-500">تومان</span>
                  </div>
                </div>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5"><FiMinus /></button>
                  <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5"><FiPlus /></button>
                </div>
              </div>
              <button onClick={() => addToCart({ ...product, quantity })} className="w-full mt-5 bg-button hover:bg-button/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-button/20 flex items-center justify-center gap-2">
                <FiShoppingCart className="w-5 h-5" /> افزودن به سبد خرید
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;