import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CART_STORAGE_KEY = 'be_cart_v1';
const DELIVERY_FEE_DEFAULT = 50; // BDT

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT': {
      return action.payload;
    }
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      let nextItems;
      if (existing) {
        nextItems = state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, i.quantity + (action.payload.quantity || 1)) }
            : i
        );
      } else {
        const quantity = Math.max(1, action.payload.quantity || 1);
        const { id, name, price, image_url } = action.payload;
        nextItems = [...state.items, { id, name, price, image_url, quantity }];
      }
      return { ...state, items: nextItems };
    }
    case 'REMOVE_ITEM': {
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    }
    case 'INCREMENT': {
      const nextItems = state.items.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return { ...state, items: nextItems };
    }
    case 'DECREMENT': {
      const nextItems = state.items
        .map((i) => (i.id === action.payload.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
      return { ...state, items: nextItems };
    }
    case 'SET_QTY': {
      const qty = Math.max(1, Number(action.payload.quantity) || 1);
      const nextItems = state.items.map((i) => (i.id === action.payload.id ? { ...i, quantity: qty } : i));
      return { ...state, items: nextItems };
    }
    case 'CLEAR': {
      return { ...state, items: [] };
    }
    case 'SET_DELIVERY_FEE': {
      return { ...state, deliveryFee: Math.max(0, Number(action.payload) || 0) };
    }
    default:
      return state;
  }
}

const initialState = {
  items: [],
  deliveryFee: DELIVERY_FEE_DEFAULT,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
          dispatch({ type: 'INIT', payload: { ...initialState, ...parsed } });
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const subtotal = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const total = useMemo(() => subtotal + state.deliveryFee, [subtotal, state.deliveryFee]);

  const api = useMemo(() => ({
    state,
    subtotal,
    total,
    addItem: (payload) => dispatch({ type: 'ADD_ITEM', payload }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
    increment: (id) => dispatch({ type: 'INCREMENT', payload: { id } }),
    decrement: (id) => dispatch({ type: 'DECREMENT', payload: { id } }),
    setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    setDeliveryFee: (fee) => dispatch({ type: 'SET_DELIVERY_FEE', payload: fee }),
  }), [state, subtotal, total]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


