import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  id: string;
  name: string;
  subName: string;
  price: string;
  priceNum: number;
  unit: string;
  quantity: number;
  themeColor: string;
  image?: string;
}

type Page = 'home' | 'checkout' | 'success' | 'admin';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, silent?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isBuyModalOpen: boolean;
  openBuyModal: () => void;
  closeBuyModal: () => void;
  page: Page;
  navigateTo: (p: Page, orderNumber?: string) => void;
  lastOrderNumber: string;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [page, setPage] = useState<Page>(
    window.location.pathname === '/admin' ? 'admin' : 'home'
  );
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  const addToCart = (product: Product, silent = false) => {
    const priceNum = parseInt(product.buyNowSection.price.replace(/[^0-9]/g, '')) || 0;
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        subName: product.subName,
        price: product.buyNowSection.price,
        priceNum,
        unit: product.buyNowSection.unit,
        quantity: 1,
        themeColor: product.themeColor,
        image: product.image,
      }];
    });
    if (!silent) setIsDrawerOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const navigateTo = (p: Page, orderNumber?: string) => {
    if (orderNumber) setLastOrderNumber(orderNumber);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const total = items.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      total, itemCount,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      isBuyModalOpen,
      openBuyModal: () => setIsBuyModalOpen(true),
      closeBuyModal: () => setIsBuyModalOpen(false),
      page, navigateTo, lastOrderNumber,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
