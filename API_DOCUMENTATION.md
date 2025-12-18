# Capital Billing System - Backend API Documentation

## 🚀 Server Status
- **Base URL**: `http://localhost:5000/api`
- **Status**: ✅ Running
- **Database**: ✅ MongoDB Connected

---

## 📋 API Endpoints

### 🏪 SHOP MANAGEMENT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shop/create` | Create a new shop |
| GET | `/api/shop/my-shop` | Get active shop details |
| GET | `/api/shop/:shopId` | Get shop by ID |
| PUT | `/api/shop/update/:shopId` | Update shop details |
| DELETE | `/api/shop/delete/:shopId` | Soft delete shop |

#### Create Shop
```json
POST /api/shop/create
{
  "shopName": "My Clothing Store",
  "ownerName": "John Doe",
  "email": "owner@shop.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "gstNumber": "27AABCT1234G1Z5",
  "gstRate": 18
}
```

---

### 📂 CATEGORY MANAGEMENT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/categories/create` | Create new category |
| GET | `/api/categories/all` | Get all active categories |
| GET | `/api/categories/:categoryId` | Get category by ID |
| PUT | `/api/categories/update/:categoryId` | Update category |
| DELETE | `/api/categories/delete/:categoryId` | Soft delete category |

#### Create Category
```json
POST /api/categories/create
{
  "categoryName": "T-Shirts",
  "description": "Men's T-Shirts Collection",
  "emoji": "👕",
  "image": "image_url",
  "displayOrder": 1
}
```

---

### 🛍️ PRODUCT MANAGEMENT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products/create` | Create new product |
| GET | `/api/products/all` | Get all active products |
| GET | `/api/products/category/:categoryId` | Get products by category |
| GET | `/api/products/:productId` | Get product by ID |
| PUT | `/api/products/update/:productId` | Update product |
| DELETE | `/api/products/delete/:productId` | Soft delete product |

#### Create Product
```json
POST /api/products/create
{
  "productName": "Blue T-Shirt",
  "categoryId": "cat-123",
  "basePrice": 500,
  "discount": 10,
  "gstRate": 18,
  "image": "image_url",
  "stock": {
    "current": 50,
    "minimum": 10,
    "maximum": 100,
    "reserved": 0
  }
}
```

---

### 📝 BILL MANAGEMENT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bills/create` | Create new bill |
| GET | `/api/bills/all` | Get all bills |
| GET | `/api/bills/:billId` | Get bill by ID |
| GET | `/api/bills/shop/:shopId` | Get bills by shop |
| PUT | `/api/bills/update/:billId` | Update bill status |
| DELETE | `/api/bills/delete/:billId` | Soft delete bill |

#### Create Bill
```json
POST /api/bills/create
{
  "shopId": "shop-123",
  "items": [
    {
      "productId": "prod-1",
      "quantity": 2
    },
    {
      "productId": "prod-2",
      "quantity": 1
    }
  ],
  "paymentMethod": "cash",
  "paymentStatus": "completed",
  "customerName": "Raj Kumar",
  "customerPhone": "9876543210",
  "notes": "Good customer",
  "discountAmount": 100
}
```

---

### 📊 REPORT MANAGEMENT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/generate` | Generate custom report |
| GET | `/api/reports/all` | Get all reports |
| GET | `/api/reports/:reportId` | Get report by ID |
| GET | `/api/reports/metrics` | Get dashboard metrics |

#### Generate Report
```json
POST /api/reports/generate
{
  "reportType": "monthly_sales",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "shopId": "shop-123",
  "filters": {}
}
```

#### Dashboard Metrics Response
```json
{
  "success": true,
  "data": {
    "todaySales": 15000,
    "todayBills": 10,
    "totalRevenue": 500000,
    "totalBills": 150,
    "averageBillValue": 3333.33
  }
}
```

---

### 🏥 HEALTH CHECK
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

#### Response
```json
{
  "success": true,
  "message": "Server running ✅",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Resource data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔧 Features Implemented

✅ **MongoDB Integration**
- Full MongoDB with Mongoose ODM
- Automatic timestamps (createdAt, updatedAt)
- Soft delete functionality
- Proper indexing and unique constraints

✅ **Shop Management**
- Create, read, update, delete shops
- GST configuration per shop
- Invoice prefix generation

✅ **Category Management**
- Organize products into categories
- Display order for UI sorting
- Emoji support for visual identification

✅ **Product Management**
- Base price, discount, and GST calculation
- Stock management (current, minimum, maximum, reserved)
- Category association
- Automatic final price calculation

✅ **Bill Management**
- Complete billing system
- Multiple payment methods (cash, card, upi, cheque, online)
- Payment status tracking
- Automatic bill number generation
- Detailed item breakdown

✅ **Report Generation**
- Custom date range reports
- Sales analytics
- Payment method breakdown
- Top selling products
- Dashboard metrics

---

## 🚀 Running the Server

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

---

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=AppName
NODE_ENV=development
```

---

## ✨ Upcoming Features

- User Authentication & Authorization
- Supplier Management
- Purchase Orders
- Inventory Tracking
- PDF Bill Generation
- Email Notifications
- Dashboard Visualization
- Advanced Analytics
- Multi-user Support
- Role-based Access Control

