import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import MainCategories from './components/MainCategories';
import NewProducts from './components/NewProducts';
import SalesSection from './components/SalesSection';
import BlogSection from './components/BlogSection';
import QASection from './components/QASection';
import Footer from './components/Footer';

function App() {
  return (
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
  );
}

export default App;