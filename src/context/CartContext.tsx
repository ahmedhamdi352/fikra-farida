'use client';

import { Product } from 'types';
import { createContext, useContext, useEffect, useState } from 'react';

interface CartItem extends Product {
  quantity: number;
  selectedColorIndex: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, colorIndex?: number) => void;
  removeFromCart: (productId: string, colorIndex: number) => void;
  updateQuantity: (productId: string, colorIndex: number, quantity: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'fikra-farida-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, quantity = 1, colorIndex = 0) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === product.id && item.selectedColorIndex === colorIndex
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id && item.selectedColorIndex === colorIndex
            ? { ...item, quantity }
            : item
        );
      }

      return [...currentItems, { ...product, quantity, selectedColorIndex: colorIndex }];
    });
  };

  const removeFromCart = (productId: string, colorIndex: number) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === productId && item.selectedColorIndex === colorIndex)
      )
    );
  };

  const updateQuantity = (productId: string, colorIndex: number, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.selectedColorIndex === colorIndex
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
