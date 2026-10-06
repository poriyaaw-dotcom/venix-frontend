// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './Context/CartContext'; 
import { Toaster } from 'react-hot-toast'; // ✅ Added Toaster import

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

function App() {
  return (
    <CartProvider>
      <Router>
        {/* ✅ Added Toaster here, safely inside the Router */}
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
          } />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} /> 
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;