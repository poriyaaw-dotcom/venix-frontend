// src/utils/api.js

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Helper to format prices with Persian numbers and separators (e.g., ۶٬۰۰۰۰۰۰)
export const formatPrice = (price) => {
  if (!price) return '۰';
  return new Intl.NumberFormat('fa-IR').format(price);
};

// Helper to convert English numbers to Persian
export const toFarsiNumber = (n) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, x => farsiDigits[x]);
};

// 1. Fetch All Products (For Shop Page)
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=&sort_by=newest`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🔥 RAW BACKEND DATA:", data);
    const productsArray = Array.isArray(data) ? data : (data.items || []);

    return productsArray.map(product => {
      const firstVariant = product.variants?.[0] || {};
      // ✅ FIX: Changed purchase_cost to final_price
      const price = firstVariant.final_price || 0; 
      
      return {
        id: product.id,
        title: product.title,
        titleEn: product.title_en || product.title,
        price: price,
        discountPrice: price,
        discount: firstVariant.discount_percent || 0,
        oldPrice: firstVariant.base_price || price,
        image: '/category-img.png',
        category: product.category?.name || 'دستگاه',
        brand: product.brand?.name || 'generic',
        variants: product.variants || [] // Pass the variants array through!
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// 2. Fetch Single Product (For Product Detail Page)
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const product = await response.json();
    
    const firstVariant = product.variants?.[0] || {};
    // ✅ FIX: Changed purchase_cost to final_price
    const price = firstVariant.final_price || 0;

    return {
      id: product.id,
      title: product.title,
      titleEn: product.title_en || product.title,
      price: price,
      discountPrice: price,
      discount: 0,
      image: '/category-img.png',
      brand: product.brand?.name || 'NO NAME',
      description: product.description || 'توضیحات محصول به زودی اضافه می‌شود.',
      category: product.category?.name || 'دستگاه',
      variants: product.variants || []
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// 3. Create Order & Initiate Payment (For Checkout Page)
export const createOrderAndPay = async (checkoutPayload) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید.');

    const checkoutRes = await fetch(`${API_BASE_URL}/checkout/create-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(checkoutPayload)
    });
    
    if (!checkoutRes.ok) {
      const err = await checkoutRes.json();
      throw new Error(err.detail || 'خطا در ثبت سفارش');
    }
    
    const orderData = await checkoutRes.json();
    
    return { 
      message: orderData.message,
      order_id: orderData.order_id,
      total_price: orderData.total_price
      // payment_url will be added here once the payment gateway is integrated
    };
    
  } catch (error) {
    console.error("Checkout error:", error);
    throw error;
  }
};