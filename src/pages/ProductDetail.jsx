// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiShoppingCart, FiStar, FiSend, FiHeart, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiSettings } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
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
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      setLoading(false);
    };
    const loadReviews = async () => {
      try {
        const res = await fetch(`https://api.venixpodshop.com/api/v1/reviews/product/${id}`);
        if (res.ok) setReviews(await res.json());
      } catch (err) {}
    };
    loadProduct();
    loadReviews();
  }, [id]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  if (loading) return <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center px-4"><span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></span></div>;
  if (!product) return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">محصول موردنظر وجود ندارد.</p>
        <Link to="/shop" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">بازگشت به فروشگاه</Link>
      </div>
    </div>
  );

  const selectedVariant = product?.variants?.find(v => v.id === selectedVariantId) || product?.variants?.[0];
  
  // ✅ FIX: Strictly separate final and base prices
  const finalPrice = selectedVariant ? (selectedVariant.final_price || product.price) : product.price;
  const basePrice = selectedVariant ? (selectedVariant.base_price || product.price) : product.price;
  
  // ✅ FIX: Only consider it a discount if base price is strictly greater than final price
  const hasDiscount = basePrice > finalPrice;
  const brandName = product.brand || product.brand_name || null;

  const stockQty = selectedVariant?.stock_quantity;
  const isOutOfStock = stockQty === null || stockQty === undefined || stockQty <= 0;
  const displayStockLimit = typeof stockQty === 'number' && stockQty > 0 ? stockQty : 999;

  const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `https://api.venixpodshop.com${product.image_url}`) : "";
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.meta_title || product.title,
    "image": imageUrl,
    "description": product.meta_description || product.description || "",
    "brand": { "@type": "Brand", "name": brandName || "Venix" },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "IRR",
      "price": finalPrice,
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.average_rating || 0,
      "reviewCount": product.review_count || 0
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans text-gray-200">
      <Helmet>
        <title>{product.meta_title || product.title} | Venix Shop</title>
        <meta name="description" content={product.meta_description || product.description || `خرید ${product.title} از فروشگاه ونیکس`} />
        <meta property="og:title" content={product.meta_title || product.title} />
        <meta property="og:description" content={product.meta_description || product.description || ""} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

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
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8">
          <div className="relative">
            <div className="bg-[#FDF8E8]/[0.035] border border-white/10 rounded-[20px] md:rounded-[28px] p-4 md:p-5 relative">
              <button onClick={() => setIsFavorite(!isFavorite)} className={`absolute top-8 right-8 z-10 w-11 h-11 rounded-full flex items-center justify-center border transition ${isFavorite ? 'bg-primary/15 border-primary text-primary' : 'bg-black/20 border-white/10 text-gray-400 hover:text-primary'}`}>
                <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              {hasDiscount && <div className="absolute top-8 left-8 z-10 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full">فروش ویژه</div>}
              <div className="h-[300px] md:h-[420px] flex items-center justify-center">
                <img src={product.image} alt={product.image_alt_text || product.title} onError={(e) => { e.target.onerror = null; e.target.src = '/category-img.png'; }} className="max-h-[260px] md:max-h-[360px] max-w-[90%] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4">
              {[{icon: FiTruck, text: 'ارسال سریع'}, {icon: FiShield, text: 'خرید امن'}, {icon: FiCheck, text: 'ضمانت اصالت'}].map((item, i) => (
                <div key={i} className="bg-white/[0.025] border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 text-center">
                  <item.icon className="mx-auto mb-2 text-primary" />
                  <span className="text-[11px] text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {brandName && <span className="inline-block bg-white/10 text-primary text-xs px-3 py-1 rounded-full font-bold mb-2 w-fit">برند: {brandName}</span>}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">{product.title}</h1>
            <p dir="ltr" className="text-sm text-gray-500 mt-2 text-right">{product.titleEn}</p>
            <p className="text-sm text-gray-400 leading-7 mt-6">{product.description}</p>
            
            {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FiShoppingCart className="text-primary" /> انتخاب واریانت</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const variantName = variant.attributes_text || 'واریانت';
                    const isSelected = selectedVariantId === variant.id;
                    return (
                      <div key={variant.id} onClick={() => setSelectedVariantId(variant.id)} className={`cursor-pointer transition-all duration-200 rounded-xl p-4 flex justify-between items-center border ${isSelected ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/[0.035] border-white/10 hover:border-white/30'}`}>
                        <div className="flex flex-col gap-1">
                          <div className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-white'}`}>{variantName}</div>
                        </div>
                        <div className={`font-black text-xl ${isSelected ? 'text-primary' : 'text-gray-300'}`}>
                          {formatPrice(variant.final_price || variant.base_price)} <span className="text-xs font-normal text-gray-400">تومان</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6">
              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-gray-500' : 'bg-green-400'}`} />
              <span className={`text-xs ${isOutOfStock ? 'text-gray-400' : 'text-green-400'}`}>
                {isOutOfStock ? 'ناموجود' : 'موجود در انبار'}
              </span>
            </div>
            
            {/* ✅ FIXED PRICE BOX */}
            <div className="mt-5 bg-white/[0.035] border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  {/* ✅ Always show original price crossed out if there is a discount */}
                  {hasDiscount && (
                    <div className="text-sm text-gray-500 line-through mb-1">{formatPrice(basePrice)} تومان</div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{formatPrice(finalPrice)}</span>
                    <span className="text-xs text-gray-500">تومان</span>
                  </div>
                </div>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5"><FiMinus /></button>
                  <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(displayStockLimit, q + 1))} disabled={!isOutOfStock && quantity >= displayStockLimit} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"><FiPlus /></button>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (isOutOfStock) return;
                  const targetVariantId = selectedVariantId || (product.variants && product.variants.length > 0 ? product.variants[0].id : product.id);
                  const maxStock = selectedVariant?.stock_quantity || 999; 
                  
                  addToCart(targetVariantId, quantity, { 
                    title: product.title, 
                    titleEn: product.titleEn || '', 
                    price: finalPrice,
                    basePrice: basePrice,
                    discount: selectedVariant?.discount_percent || 0, 
                    discountPrice: finalPrice, 
                    image: product.image || product.image_url || '', 
                    product_id: product.id 
                  }, maxStock); 
                }} 
                disabled={isOutOfStock}
                className={`w-full mt-5 font-bold py-3 md:py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-button hover:bg-button/90 text-white shadow-button/20'}`}
              >
                {isOutOfStock ? 'ناموجود' : <><FiShoppingCart className="w-5 h-5" /> افزودن به سبد خرید</>}
              </button>
            </div>
          </div>
        </div>
      </main>

      {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 py-8 border-t border-white/10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2"><FiSettings className="text-primary" /> مشخصات فنی</h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            {Array.from({ length: Math.ceil(product.specifications.length / 2) }).map((_, rowIndex) => {
              const start = rowIndex * 2;
              const end = start + 2;
              const rowSpecs = product.specifications.slice(start, end);
              return (
                <div key={rowIndex} className={`flex border-b border-white/5 last:border-b-0 ${rowIndex % 2 === 0 ? 'bg-white/[0.025]' : 'bg-black/20'}`}>
                  {rowSpecs.map((spec, colIndex) => (
                    <div key={colIndex} className="flex-1 p-4 border-l border-white/5 last:border-l-0">
                      <span className="text-gray-300 text-sm md:text-base font-medium leading-7">{spec}</span>
                    </div>
                  ))}
                  {rowSpecs.length === 1 && <div className="flex-1 p-4 border-l border-white/5"></div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-[1240px] mx-auto px-4 py-6 md:py-8 border-t border-white/10 mt-6 md:mt-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-white">نظرات کاربران</h2>
          <div className="flex items-center gap-3 bg-white/[0.035] border border-white/10 rounded-xl px-4 py-2">
            <StarRating filled={Math.round(product.average_rating || 0)} />
            <span className="text-sm text-gray-300 font-bold">{product.average_rating ? product.average_rating.toFixed(1) : '۰'} از ۵ </span>
            <span className="text-xs text-gray-500">({product.review_count || 0} نظر)</span>
          </div>
        </div>
        
        <div className="bg-white/[0.035] border border-white/10 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg font-bold text-white mb-4">ثبت نظر جدید</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-400">امتیاز شما:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setReviewRating(star)}>
                  <FiStar className={`w-6 h-6 ${star <= reviewRating ? 'text-primary fill-primary' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="نظر خود را درباره این محصول بنویسید..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary h-24 mb-4" />
          <button onClick={async () => {
              const token = localStorage.getItem('token');
              if (!token) { alert('لطفاً ابتدا وارد حساب کاربری خود شوید.'); return; }
              try {
                const res = await fetch(`https://api.venixpodshop.com/api/v1/reviews/?product_id=${id}`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
                });
                if (res.ok) { alert('نظر شما با موفقیت ثبت شد.'); setReviewComment(''); setReviewRating(5); }
              } catch (err) { alert('خطای شبکه'); }
            }} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-bold transition flex items-center gap-2">
            <FiSend className="w-4 h-4" /> ارسال نظر
          </button>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? <p className="text-gray-500 text-center py-8">هنوز نظری برای این محصول ثبت نشده است.</p> : reviews.map((review) => (
            <div key={review.id} className="bg-white/[0.025] border border-white/10 rounded-xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StarRating filled={review.rating} size="w-3 h-3" />
                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-7">{review.comment || 'بدون متن'}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;