# 🥒 Kanvi - Homemade Pickle Business Platform

A complete full-stack web application for the homemade pickle business "Kanvi" built with Next.js, MongoDB, and modern web technologies.

## Features

### User Features

- **Mobile OTP-based Authentication** - Secure OTP login system
- **Dynamic Homepage** - Banner slider with trending and seasonal products
- **Product Catalog** - Browse all available pickle products
- **Shopping Cart** - Add/remove items, update quantities, persistent storage
- **Checkout** - Address form with payment method selection
  - COD available for orders below ₹250
  - Online payment for all orders
  - Coupon code support
- **Order Management** - View order history and status tracking
- **Responsive Design** - Mobile-first, works on all devices

### Admin Features

- **Admin Authentication** - Secure email/password login
- **Dashboard** - Overview of total orders, daily orders, and revenue
- **Product Management** - Add, edit, delete products with trending/seasonal flags
- **Banner Management** - Create and manage homepage banners
- **Order Management** - View all orders with status update capability
- **Coupon Management** - Create discount coupons with expiry dates and usage limits
- **Order Status Tracking** - Update order status from Pending → Confirmed → Preparing → Delivered

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Authentication**: JWT tokens
- **Image Optimization**: Next.js Image component with Sharp

## Project Structure

```
e:\pickle-app/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication routes
│   │   ├── products/          # Product management APIs
│   │   ├── orders/            # Order management APIs
│   │   ├── coupons/           # Coupon management APIs
│   │   ├── banners/           # Banner management APIs
│   │   └── admin/             # Admin-specific APIs
│   ├── admin/                 # Admin panel pages
│   ├── components/            # Reusable React components
│   ├── store/                 # Zustand state management
│   ├── checkout/              # Checkout page
│   ├── cart/                  # Shopping cart page
│   ├── orders/                # Order history page
│   ├── products/              # Products listing page
│   ├── login/                 # User login page
│   └── layout.tsx             # Root layout
├── lib/
│   ├── db.ts                  # MongoDB connection
│   ├── models/                # Mongoose models
│   └── utils/                 # Utility functions
├── middleware/                # Next.js middleware
└── public/                    # Static assets
```

## Database Schema

### Users Collection

```typescript
{
  phone: string (10 digits, unique),
  otp: string | null,
  otpExpiry: Date | null,
  isVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection

```typescript
{
  name: string,
  price: number,
  description: string,
  image: string (URL),
  isTrending: boolean,
  isSeasonal: boolean,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```typescript
{
  userId: string,
  items: [
    { productId, name, price, quantity }
  ],
  totalAmount: number,
  address: { name, phone, address, pincode },
  paymentType: "COD" | "ONLINE",
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERED",
  couponCode: string | null,
  discountAmount: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Coupons Collection

```typescript
{
  code: string (unique, uppercase),
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
  expiryDate: Date,
  usageLimit: number,
  usageCount: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Banners Collection

```typescript
{
  image: string (URL),
  title: string,
  isActive: boolean,
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection

```typescript
{
  email: string (unique),
  password: string (hashed),
  name: string,
  role: "ADMIN" | "SUPER_ADMIN",
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Git

### Local Development

1. **Clone and install dependencies:**

   ```bash
   cd e:\pickle-app
   npm install
   ```

2. **Create `.env.local` file:**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanvi?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-here-change-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Create the first admin user:**
   - Run the development server
   - Make a POST request to `/api/auth/admin-login` with email and password
   - The admin user will be automatically created on first login attempt

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

### Access Points

- **User Home**: http://localhost:3000/
- **User Login**: http://localhost:3000/login
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## Deployment

### Deploy on Vercel

1. **Push code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/kanvi.git
   git branch -M main
   git push -u origin main
   ```

2. **Create MongoDB Atlas Cluster:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Add IP address to whitelist

3. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your secret key
     - `NEXT_PUBLIC_API_URL`: Your production URL
   - Click Deploy

4. **Verify deployment:**
   ```
   https://your-app-name.vercel.app
   ```

### Environment Variables (Production)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kanvi?retryWrites=true&w=majority
JWT_SECRET=your-very-long-secret-key-change-this
NEXT_PUBLIC_API_URL=https://your-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=production
```

## API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and get token
- `POST /api/auth/admin-login` - Admin login

### Products

- `GET /api/products` - Get all products
- `GET /api/products?trending=true` - Get trending products
- `GET /api/products?seasonal=true` - Get seasonal products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders

- `GET /api/orders` - Get user's orders (Auth required)
- `POST /api/orders` - Place new order (Auth required)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin)

### Coupons

- `GET /api/coupons?code=CODE` - Validate coupon
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

### Banners

- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner (Admin)
- `PUT /api/banners/:id` - Update banner (Admin)
- `DELETE /api/banners/:id` - Delete banner (Admin)

## Key Features Implementation

### Cart Persistence

Cart is stored in localStorage using Zustand store. Cart data persists across browser sessions.

### Payment Flow

- **COD**: Available for orders < ₹250
- **Online**: Available for all orders
- Payment gateway integration can be added for online payments

### Coupon System

- Coupons can be percentage or fixed amount discounts
- Support for usage limits and expiry dates
- Applied at checkout with validation

### Order Status Flow

```
PENDING → CONFIRMED → PREPARING → DELIVERED
```

Admin can update status at any time. Users see real-time updates.

## Performance Optimizations

- Next.js Image component for automatic image optimization
- Lazy loading for product images
- Client-side state management with Zustand (minimal re-renders)
- API response caching strategies
- MongoDB indexes on frequently queried fields

## Security Measures

- JWT token-based authentication
- Password hashing with bcryptjs
- Environment variable protection
- Input validation on all endpoints
- SQL injection prevention (using Mongoose)
- CORS headers configuration
- Secure HTTP-only cookies (can be implemented)

## Future Enhancement

- Payment gateway integration (Razorpay, Stripe)
- SMS/Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced analytics dashboard
- Inventory management
- Multi-language support
- Social media integration

## Troubleshooting

### MongoDB Connection Error

- Verify connection string in .env.local
- Check IP whitelist in MongoDB Atlas
- Ensure network access is allowed

### OTP Not Sending

- Implement email service (currently logs to console)
- Add SMS gateway for production
- Check email configuration

### Cart Not Persisting

- Check browser localStorage is enabled
- Verify Zustand store is hydrated on client
- Check console for hydration errors

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

MIT License - feel free to use this project for commercial purposes

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Kanvi - Homemade Pickles**
