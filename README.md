# 🥒 Kanvi - Homemade Pickle Business Application

Complete full-stack application for managing a homemade pickle business. Built with Next.js, MongoDB, and Tailwind CSS.

## ✅ Project Status: COMPLETE

All user features, admin features, APIs, and database schemas have been fully implemented.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 🎯 What's Included

✅ User Features

- OTP authentication with MongoDB
- Product browsing (home, all, trending, seasonal)
- Shopping cart with localStorage persistence
- Checkout with address & payment method selection
- Order placement, confirmation & tracking

✅ Admin Features

- Secure admin login & dashboard
- Full product CRUD management
- Homepage banner management
- Order management with status updates
- Coupon creation & validation

✅ Complete Backend

- All API routes implemented
- MongoDB models with Mongoose
- JWT authentication
- Comprehensive error handling

✅ Full Database

- Users, Products, Orders, Coupons, Banners, Admin collections
- Proper relationships & validation

## 🛠 Tech Stack

Next.js 16 • React 19 • MongoDB • Mongoose • Tailwind CSS 4 • Zustand • JWT

## 📄 Configuration

Create `.env.local`:

```
MONGODB_URI=your-mongodb-url
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔗 Key Routes

User: / | /login | /products | /cart | /checkout | /orders  
Admin: /admin/dashboard | /admin/products | /admin/banners | /admin/orders | /admin/coupons

## 📖 Full Documentation

For complete setup, deployment, API reference, and architecture details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

**🥒 Kanvi - Homemade Pickles, Delivered Fresh**
