// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './Context/CartContext'; 
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import MainCategories from './components/MainCategories';
import NewProducts from './components/NewProducts';
import SalesSection from './components/SalesSection';
import BlogSection from './components/BlogSection';
import QASection from './components/QASection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import MobileBottomNav from './components/MobileBottomNav'; // ✅ ADDED

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
import CardToCardPayment from './pages/CardToCardPayment';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail'; 

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '14px'
              }
            }}
          />
          
          <Routes>
            <Route path="/" element={
              <>
                <Helmet>
                  <title>فروشگاه ونیکس | خرید ویپ، پاد سیستم، جویس و لوازم جانبی</title>
                  <meta name="description" content="خرید آنلاین انواع ویپ، پاد سیستم، جویس و لوازم جانبی با بهترین قیمت و ضمانت اصالت کالا. ارسال سریع به سراسر ایران. فروشگاه ونیکس" />
                  <meta name="keywords" content="ویپ, پاد سیستم, جویس, الکترونیک سیگار, ونیکس, خرید ویپ, vape, pod system" />
                  <link rel="canonical" href="https://venixpodshop.ir/" />
                  <meta property="og:title" content="فروشگاه ونیکس | خرید ویپ، پاد سیستم، جویس" />
                  <meta property="og:description" content="خرید آنلاین انواع ویپ، پاد سیستم و جویس با بهترین قیمت" />
                  <meta property="og:url" content="https://venixpodshop.ir/" />
                  <meta property="og:type" content="website" />
                </Helmet>
                <div className="min-h-screen font-sans">
                  <Header />
                  <HeroSlider />
                  <MainCategories />
                  <NewProducts />
                  <SalesSection />
                  <BlogSection />
                  <QASection />
                  <Footer />
                </div>
              </>
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
            <Route path="/admin" element={<Admin />} /> 
          </Routes>

          {/* ✅ Floating WhatsApp Button */}
          <FloatingWhatsApp />
          
          {/* ✅ Mobile Bottom Navigation (100% invisible on desktop) */}
          <MobileBottomNav />
          
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;