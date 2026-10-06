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

  // ✅ UPDATED: Now explicitly expects variant_id for accurate backend syncing
  const addToCart = (variantId, quantity, productInfo) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variant_id === variantId);
      if (existing) {
        return prev.map((item) =>
          item.variant_id === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        variant_id: variantId, 
        quantity, 
        // Keep minimal product info for UI display only. 
        // Backend will recalculate authoritative price at checkout.
        title: productInfo?.title || 'محصول', 
        price: productInfo?.price || 0 
      }];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.variant_id === variantId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // Note: This total is for UI display only. The backend calculates the authoritative total at checkout.
  const cartTotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};