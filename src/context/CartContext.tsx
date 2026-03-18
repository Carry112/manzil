import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { getSessionId } from '../lib/session';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: (CartItem & { product: Product })[];
  addItem: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<(CartItem & { product: Product })[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadCart = async () => {
    const sessionId = getSessionId();
    const { data, error } = await api.cart.list(sessionId);
    if (!error && data) {
      setItems(data as (CartItem & { product: Product })[]);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const addItem = async (productId: string, size: string, color: string, quantity: number) => {
    const sessionId = getSessionId();
    const existingItem = items.find(
      (item) => item.product_id === productId && item.size === size && item.color === color
    );
    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const { error } = await api.cart.add({ session_id: sessionId, product_id: productId, quantity, size, color });
      if (!error) await loadCart();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) { await removeItem(itemId); return; }
    const { error } = await api.cart.updateQty(itemId, quantity);
    if (!error) await loadCart();
  };

  const removeItem = async (itemId: string) => {
    const { error } = await api.cart.remove(itemId);
    if (!error) await loadCart();
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    const { error } = await api.cart.clearSession(sessionId);
    if (!error) setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, updateQuantity, removeItem, clearCart,
        itemCount, total, isOpen,
        openCart:  () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart:() => setIsOpen(!isOpen),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
