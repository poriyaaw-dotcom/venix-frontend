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

  // ✅ UPDATED: Now stores max_stock in the cart item to enforce limits
  const addToCart = (variantId, quantity, productInfo, maxStock = 999) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      
      if (existing) {
        const limit = existing.max_stock !== undefined && existing.max_stock !== null ? existing.max_stock : 999;
        const newQuantity = Math.min(existing.quantity + quantity, limit);
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
        price: productInfo?.price || 0,          // ✅ This is now the final_price (correct group price)
        basePrice: productInfo?.basePrice || 0,  // ✅ Kept for strikethrough display
        discountPrice: productInfo?.discountPrice || 0,
        discount: productInfo?.discount || 0,
        image: productInfo?.image || productInfo?.image_url || '',
        product_id: productInfo?.product_id || productInfo?.id || variantId,
        max_stock: maxStock                      // ✅ Save the limit in the cart item
      }];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  // ✅ UPDATED: Reads max_stock from the cart item to cap quantity
  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.variant_id === variantId) {
          const limit = item.max_stock !== undefined && item.max_stock !== null ? item.max_stock : 999;
          return { ...item, quantity: Math.min(quantity, limit) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // ✅ Total is now accurate because item.price is the correct group final_price
  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};