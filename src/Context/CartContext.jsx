// src/Context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('venix_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('venix_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ UPDATED: Now accepts maxStock to prevent exceeding available inventory
  const addToCart = (variantId, quantity, productInfo, maxStock = 999) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      
      if (existing) {
        // ✅ CAP THE QUANTITY: Never let it exceed maxStock
        const newQuantity = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.variant_id === variantId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prev, { 
        variant_id: variantId, 
        quantity, 
        title: productInfo?.title || 'محصول',
        titleEn: productInfo?.titleEn || '',
        price: productInfo?.price || 0,
        discountPrice: productInfo?.discountPrice || 0,
        discount: productInfo?.discount || 0,
        image: productInfo?.image || productInfo?.image_url || '',
        product_id: productInfo?.product_id || productInfo?.id || variantId
      }];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId, quantity, maxStock = 999) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    // ✅ CAP THE QUANTITY HERE TOO, just in case they manually type a higher number
    const cappedQuantity = Math.min(quantity, maxStock);
    
    setCartItems((prev) =>
      prev.map((item) => (item.variant_id === variantId ? { ...item, quantity: cappedQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};