import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import MainCategories from './components/MainCategories';
import NewProducts from './components/NewProducts';
import SalesSection from './components/SalesSection';
import BlogSection from './components/BlogSection';
import QASection from './components/QASection';
import Footer from './components/Footer';
import Shop from './pages/Shop';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
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
          } 
        />
        
        {/* Shop Page Route */}
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
  );
}

export default App;