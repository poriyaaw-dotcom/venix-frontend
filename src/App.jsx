// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './Context/CartContext'; 
import { Toaster } from 'react-hot-toast';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import MainCategories from './components/MainCategories';
import NewProducts from './components/NewProducts';
import SalesSection from './components/SalesSection';
import BlogSection from './components/BlogSection';
import QASection from './components/QASection';
import Footer from './components/Footer';

// Pages
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import PaymentResult from './pages/PaymentResult';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import CardToCardPayment from './pages/CardToCardPayment';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail'; 

const FloatingWhatsApp = () => (
  <a 
    href="https://wa.me/989127467261" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-50 w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 group border-2 border-white/10"
    aria-label="Contact us on WhatsApp"
  >
    <svg className="w-6 h-6 md:w-7 md:h-7 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <span className="absolute left-full ml-3 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
      پشتیبانی واتس‌اپ
    </span>
  </a>
);

function MobileBottomBar() {
  const { cartCount } = useCart();
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://api.venixpodshop.com/api/v1/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-white/10 z-40 pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-400 hover:text-primary transition w-full h-full">
            <FiHome className="text-xl mb-1" />
            <span className="text-[10px]">خانه</span>
          </Link>
          <button onClick={() => setShowMobileCategories(true)} className="flex flex-col items-center justify-center text-gray-400 hover:text-primary transition w-full h-full">
            <FiShoppingBag className="text-xl mb-1" />
            <span className="text-[10px]">فروشگاه</span>
          </button>
          <Link to="/cart" className="flex flex-col items-center justify-center text-gray-400 hover:text-primary transition w-full h-full relative">
            <div className="relative">
              <FiShoppingCart className="text-xl mb-1" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-button text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-background">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">سبد خرید</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center text-gray-400 hover:text-primary transition w-full h-full">
            <FiUser className="text-xl mb-1" />
            <span className="text-[10px]">پروفایل</span>
          </Link>
        </div>
      </div>

      {showMobileCategories && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileCategories(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 animate-slideUp max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">دسته‌بندی‌ها</h3>
              <button onClick={() => setShowMobileCategories(false)} className="text-gray-400 hover:text-primary">
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/shop?category=${encodeURIComponent(cat.name)}`} onClick={() => setShowMobileCategories(false)} className="block w-full text-right bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-primary/10 transition text-gray-300 hover:text-primary text-sm font-bold">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ FIXED: Now includes /admin-login so WhatsApp is hidden there too
  const isAdminPage = location.pathname.startsWith('/admin');

  // ✅ THE BOUNCER LOGIC
  useEffect(() => {
    const hostname = window.location.hostname;
    const isAdminSubdomain = hostname.startsWith('admin.');

    if (isAdminSubdomain) {
      // If on admin subdomain and at root, send to admin login
      if (location.pathname === '/') {
        navigate('/admin-login', { replace: true });
      }
    } else {
      // If NOT on admin subdomain, BLOCK access to the actual admin dashboard
      // (But allow /admin-login so they can authenticate first)
      if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <div className="flex flex-col min-h-screen pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen font-sans">
              <Helmet>
                <title>فروشگاه ونیکس | خرید ویپ، پاد سیستم و جویس اورجینال</title>
                <meta name="description" content="خرید آنلاین انواع ویپ، پاد سیستم، جویس، کویل و لوازم جانبی با بهترین قیمت، ضمانت اصالت کالا و ارسال سریع به سراسر ایران. فروشگاه تخصصی ونیکس." />
                <meta property="og:title" content="فروشگاه ونیکس | خرید ویپ، پاد سیستم و جویس اورجینال" />
                <meta property="og:description" content="خرید آنلاین انواع ویپ، پاد سیستم، جویس و لوازم جانبی با ضمانت اصالت و ارسال سریع." />
                <meta property="og:type" content="website" />
              </Helmet>
              <Header />
              <HeroSlider />
              <MainCategories />
              <NewProducts />
              <SalesSection />
              <BlogSection />
              <QASection />
              <Footer />
            </div>
          } />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/card-to-card" element={<CardToCardPayment />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          
          {/* ✅ Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} /> 
        </Routes>
      </div>

      <MobileBottomBar />
      
      {/* Hide WhatsApp button on ALL admin pages (including login) */}
      {!isAdminPage && <FloatingWhatsApp />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <HelmetProvider>
        <Router>
          <AppContent />
        </Router>
      </HelmetProvider>
    </CartProvider>
  );
}

export default App;