# Binodia Express – Restaurant Web App

Customer-facing restaurant app built with React (Vite), Tailwind CSS, React Router, and Firebase (Firestore + Storage). Scope includes Home, Menu, Cart, Checkout, and Order Confirmation.

## Stack
- React + Vite (JavaScript)
- Tailwind CSS
- React Router
- Firebase v9 modular SDK (client-only)

## Local development

1) Install dependencies:

```bash
npm install
```

2) Update Firebase config:

Edit `src/config/firebase.js` and replace placeholder values:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

3) Start the dev server:

```bash
npm run dev
```

4) Build for production:

```bash
npm run build
```

## Firestore data model

- `Categories`: `{ id: string, name: string }`
- `Foods`: `{ id: string, name: string, description?: string, category: string, price: number, image_url?: string }`
- `Orders`:
  ```js
  {
    name: string,
    email?: string,
    phone: string,
    address: string,
    foods: Array<{ id: string, name: string, price: number, quantity: number }>,
    totalprice: number,
    status: 'initiated' | 'preparing' | 'out for delivery' | 'delivered',
    createdAt: serverTimestamp()
  }
  ```

Reads: `Categories`, `Foods`. Writes: `Orders` on checkout.

## Notes
- Prices are displayed in BDT (৳) via `src/utils/currency.js`.
- Cart state persists to `localStorage` using `src/hooks/useCart.js`.
- Menu supports category multi-select and debounced search.
- Images lazy-load; descriptions are clamped to two lines.

