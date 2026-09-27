"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { MenuItem } from "@/data/menu";

export type CartItem = MenuItem & {
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/*
 * Cart store
 */
const emptyCart: CartItem[] = [];
let cartItems: CartItem[] = [];
let hasLoadedCart = false;

const listeners = new Set<() => void>();

function loadCart() {
  if (hasLoadedCart || typeof window === "undefined") {
    return;
  }

  hasLoadedCart = true;

  const savedCart = window.localStorage.getItem("famzi-cart");

  if (!savedCart) {
    return;
  }

  try {
    const parsedCart = JSON.parse(savedCart);

    if (Array.isArray(parsedCart)) {
      cartItems = parsedCart;
    }
  } catch {
    window.localStorage.removeItem("famzi-cart");
  }
}

function getCart() {
  loadCart();
  return cartItems;
}

function getServerCart() {
  return emptyCart;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function updateCart(newCart: CartItem[]) {
  cartItems = newCart;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      "famzi-cart",
      JSON.stringify(cartItems)
    );
  }

  listeners.forEach((listener) => listener());
}

/*
 * Cart Provider
 */

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = useSyncExternalStore(
    subscribe,
    getCart,
    getServerCart
  );

  const addToCart = (item: MenuItem) => {
    const existingItem = items.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {
      updateCart(
        items.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        )
      );

      return;
    }

    updateCart([
      ...items,
      {
        ...item,
        quantity: 1,
      },
    ]);
  };

  const removeFromCart = (id: number) => {
    updateCart(
      items.filter((item) => item.id !== id)
    );
  };

  const increaseQuantity = (id: number) => {
    updateCart(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    updateCart(
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    updateCart([]);
  };

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}