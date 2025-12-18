# Capital Billing System - Backend Setup

## 📁 Project Structure

```
backend/
├── models/              # Database schemas
│   ├── User.js
│   ├── Shop.js
│   ├── Category.js
│   ├── Product.js
│   ├── Batch.js
│   ├── Bill.js
│   ├── Report.js
│   └── Supplier.js
├── controllers/         # Business logic
│   ├── shopController.js
│   ├── categoryController.js
│   ├── productController.js
│   └── reportController.js
├── routes/              # API endpoints
│   ├── shopRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   └── reportRoutes.js
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server (Development)
```bash
npm run dev
```

### 3. Start Server (Production)
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📝 API Endpoints

### SHOP
- `POST   /api/shop/create` - Create new shop
- `GET    /api/shop/my-shop` - Get current shop
- `GET    /api/shop/:shopId` - Get shop by ID
- `PUT    /api/shop/update/:shopId` - Update shop
- `DELETE /api/shop/delete/:shopId` - Delete shop

### CATEGORIES
- `POST   /api/categories/create` - Create category
- `GET    /api/categories/all` - Get all categories
- `GET    /api/categories/:categoryId` - Get category by ID
- `PUT    /api/categories/update/:categoryId` - Update category
- `DELETE /api/categories/delete/:categoryId` - Delete category

### PRODUCTS
- `POST   /api/products/create` - Create product
- `GET    /api/products/all` - Get all products
- `GET    /api/products/category/:categoryId` - Get products by category
- `GET    /api/products/:productId` - Get product by ID
- `PUT    /api/products/update/:productId` - Update product
- `DELETE /api/products/delete/:productId` - Delete product

### REPORTS
- `POST   /api/reports/generate` - Generate report
- `GET    /api/reports/all` - Get all reports
- `GET    /api/reports/metrics` - Get dashboard metrics
- `GET    /api/reports/:reportId` - Get report by ID

### HEALTH
- `GET    /api/health` - Health check

## 🔌 Response Format

All endpoints return JSON in this format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin requests
- **nodemon** - Development auto-reload

## 🔧 Configuration

- **PORT**: 5000 (default, changeable via environment variable)
- **CORS**: Enabled for development (localhost:3000, localhost:5500)
- **Body Parser**: JSON support

## 🎯 Features

✅ Complete CRUD operations
✅ In-memory storage (ready for database integration)
✅ UUID generation for unique IDs
✅ Soft delete pattern (isActive flag)
✅ Category-Product relationship
✅ Price calculation with discount & GST
✅ Report generation with metrics
✅ Error handling & validation

## 🔜 Next Steps

1. Database integration (MongoDB/PostgreSQL)
2. Authentication & authorization
3. PDF generation service
4. GitHub API integration
5. WhatsApp integration
6. Advanced reporting & analytics

---

**Status**: Backend structure complete ✅ Ready for testing and database integration
