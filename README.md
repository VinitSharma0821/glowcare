# ✨ GlowCare – Skin Care Products E-Commerce Platform

> **A Pixel-Perfect, Science-Backed Skin Care E-Commerce & Management Platform**  
> Formulated with bio-identical ceramides, ultra-stable actives, and pure botanicals.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/Status-Complete-emerald)](#)

---

## 🌸 Overview

**GlowCare** is an enterprise-grade, responsive, full-stack skin care e-commerce web application designed to help users discover, personalize, and purchase clinical-grade clean skincare formulations.

Users can explore products tailored to their skin type (Oily, Dry, Combination, Sensitive, Normal), run an interactive **AI Skincare Routine Diagnostic Quiz**, examine full INCI ingredient disclosures, read verified buyer reviews, curate wishlists, and smoothly place orders. 

An administrative control center allows brand operators to manage real-time inventory, categories, customer orders with fulfillment status tracking, and view business analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, Lucide Icons, Canvas Confetti |
| **State & Networking** | Context API (Auth, Cart, Toast), Axios, LocalStorage Persistence |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Design Language** | Editorial Luxury Skincare Aesthetic (Playfair Display, Plus Jakarta Sans, Warm Ivory `#FAF8F5`, Botanical Sage `#3D6B58`, Terracotta Rose `#D97762`) |

---

## 🌟 Key Features & Modules

### 1. 🛍️ Customer Storefront & Product Catalogue
- **Editorial Skincare Hero**: High-impact banner with trust counters (100% Clean & Vegan, 72-Hour Hydration Lock, 98.4% Barrier Repair Rate).
- **Targeted Skincare Categories**: Cleansers, Face Wash, Moisturizers, Serums & Ampoules, Sunscreens SPF 50+, Face Masks, Toners, Lip Care, Eye Creams.
- **Advanced Catalogue Search & Filtering**:
  - Live predictive search bar with instant dropdown preview
  - Filter by Category
  - Filter by Skin Type (*Oily, Dry, Combination, Normal, Sensitive*)
  - Filter by Primary Concern (*Acne & Blemishes, Hydration & Dryness, Brightening, Anti-Aging, Redness*)
  - Filter by Regimen Step (*Cleanse, Tone, Treat, Moisturize, Protect, Mask*)
  - Interactive Price Slider ($15 – $60)
  - Sorting: Featured, Bestsellers, Price Low-High, Price High-Low, Rating, Newest.
- **Formulation Detail View**:
  - Multi-angle high-resolution gallery
  - Key active ingredients & dermatological benefits
  - Application ritual (Step-by-step instructions)
  - Full INCI ingredient transparency
  - Sensory profile (Texture & scent)
  - Verified reviews breakdown with customer skin-type badges.

### 2. 🧪 Interactive Skincare Routine Diagnostic (AI Quiz)
- 2-step interactive quiz identifying skin type and primary skin concern.
- Delivers a personalized 5-step regimen (*Cleanse, Tone, Treat, Moisturize, Protect*).
- 1-Click **"Add Complete Routine to Bag"** with automated 15% bundle savings.

### 3. 🛒 Shopping Bag & Streamlined Checkout
- Slide-out Cart Drawer + Dedicated Shopping Bag page.
- **Free Standard Shipping Progress Bar** (Free on orders $50+).
- **Promo Coupon Engine**:
  - `GLOW20`: 20% discount on order subtotal
  - `FREESHIP`: Unlocks free shipping on any cart
  - `FIRSTGLOW`: $10 discount
- Quantity stepper controls and real-time total recalculations.
- Streamlined 2-column Checkout with saved address selector, delivery address validation, and simulated payment methods (*Credit/Debit Card, UPI / NetBanking, Cash on Delivery*).
- Delightful **Order Confirmation** page with celebratory confetti, tracking number, and printable receipt.

### 4. 📦 Order Tracking & User Profile
- **Order History**: Visual status timeline (*Pending → Processing → Shipped → Delivered*).
- Real-time USPS tracking number lookup.
- Cancellation support for pending/processing orders with automatic stock replenishment.
- **Address Book**: Save and manage default delivery addresses.
- **Personalized Skin Diagnostic Profile**: Store diagnosed skin type and concerns.
- **Wishlist**: Save favorite formulations across sessions.

### 5. 🛡️ Admin Management Control Center
- **Analytics KPI Cards**: Real-time revenue, total orders, catalog items, registered customers, low-stock warnings.
- **Inventory & Formulation Management**:
  - Add, edit, and delete formulations
  - Set active ingredients, volume, thumbnail, and routine steps
  - Live stock level monitors (Green > 20, Amber 1-19, Red 0).
- **Category Management**: Create and organize product collections.
- **Order Fulfillment Center**: Update order statuses (*Pending, Processing, Shipped, Delivered, Cancelled*) and assign tracking numbers.
- **Customer Roster**: View customer profiles, order history, and total spending.

---

## 🔑 Demo Access Credentials

Both demo accounts are pre-seeded in the database. You can also use the **1-Click Demo Buttons** on the Login page:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@glowcare.com` | `admin123` | Full access to `/admin` dashboard, inventory, orders, categories |
| **Customer** | `user@glowcare.com` | `user123` | Storefront browsing, saved addresses, wishlist, order history |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates categories, products, demo users, orders, and reviews
npm start        # Starts Express API server on port 5005
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React development server on http://localhost:5173
```

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/auth/register` | Register new customer |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/profile` | Current user profile & saved addresses |
| `PUT` | `/api/auth/profile` | Update profile attributes & skin type |
| `POST` | `/api/auth/address` | Add new saved shipping address |
| `POST` | `/api/auth/wishlist/:id` | Toggle product in user wishlist |
| `GET` | `/api/products` | Query products with filters, search, and pagination |
| `GET` | `/api/products/:identifier`| Single product by slug or ID |
| `GET` | `/api/products/home/highlights` | Homepage featured and bestseller items |
| `GET` | `/api/products/routine-finder` | Diagnostic routine recommendation algorithm |
| `POST` | `/api/products/:id/reviews` | Post verified customer review |
| `POST` | `/api/orders` | Place new customer order |
| `GET` | `/api/orders/my-orders` | Logged-in user's order history |
| `GET` | `/api/orders/:identifier` | Order tracking and invoice details |
| `PUT` | `/api/orders/:id/cancel` | Cancel order & restore inventory |
| `GET` | `/api/admin/stats` | Admin dashboard analytics & KPIs (Admin only) |
| `GET` | `/api/admin/customers` | Registered customer roster (Admin only) |
| `POST/PUT/DELETE`| `/api/products` | Admin inventory CRUD (Admin only) |
| `PUT` | `/api/orders/:id/status` | Update fulfillment tracking status (Admin only) |
| `POST/PUT/DELETE`| `/api/categories` | Admin category management (Admin only) |

---

© 2026 GlowCare Technologies Inc. All rights reserved.
