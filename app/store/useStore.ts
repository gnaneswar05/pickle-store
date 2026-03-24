import { create } from "zustand";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>((set, get) => {
  // Load initial state from localStorage
  const loadFromLocalStorage = () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("kanvi-cart");
    return saved ? JSON.parse(saved) : [];
  };

  return {
    items: loadFromLocalStorage(),

    addItem: (item: CartItem) =>
      set((state) => {
        const existingItem = state.items.find(
          (i) => i.productId === item.productId,
        );
        let newItems;

        if (existingItem) {
          newItems = state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          );
        } else {
          newItems = [...state.items, item];
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("kanvi-cart", JSON.stringify(newItems));
        }

        return { items: newItems };
      }),

    removeItem: (productId: string) =>
      set((state) => {
        const newItems = state.items.filter((i) => i.productId !== productId);
        if (typeof window !== "undefined") {
          localStorage.setItem("kanvi-cart", JSON.stringify(newItems));
        }
        return { items: newItems };
      }),

    updateQuantity: (productId: string, quantity: number) =>
      set((state) => {
        if (quantity <= 0) {
          return state; // Keep current state if quantity is 0 or less
        }

        const newItems = state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        );

        if (typeof window !== "undefined") {
          localStorage.setItem("kanvi-cart", JSON.stringify(newItems));
        }

        return { items: newItems };
      }),

    clearCart: () =>
      set(() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("kanvi-cart");
        }
        return { items: [] };
      }),

    getTotal: () => {
      const { items } = get();
      return items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    },

    getItemCount: () => {
      const { items } = get();
      return items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});

interface Toast {
  id: number;
  title: string;
  message?: string;
  tone?: "success" | "info" | "error";
}

interface ToastStore {
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    set((state) => ({
      toasts: [...state.toasts, { id, tone: "info", ...toast }],
    }));

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((item) => item.id !== id),
        }));
      }, 2600);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

interface AuthStore {
  token: string | null;
  user: { id: string; phone: string } | null;
  setAuth: (token: string, user: { id: string; phone: string }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthStore>((set, get) => {
  const loadFromLocalStorage = () => {
    if (typeof window === "undefined") return { token: null, user: null };
    const token = localStorage.getItem("kanvi-token");
    const user = localStorage.getItem("kanvi-user");
    return { token, user: user ? JSON.parse(user) : null };
  };

  const initial = loadFromLocalStorage();

  return {
    token: initial.token,
    user: initial.user,

    setAuth: (token: string, user: { id: string; phone: string }) =>
      set(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("kanvi-token", token);
          localStorage.setItem("kanvi-user", JSON.stringify(user));
        }
        return { token, user };
      }),

    clearAuth: () =>
      set(() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("kanvi-token");
          localStorage.removeItem("kanvi-user");
        }
        return { token: null, user: null };
      }),

    isAuthenticated: () => {
      const { token } = get();
      return !!token;
    },
  };
});
