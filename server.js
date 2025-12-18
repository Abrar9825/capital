const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { Octokit } = require('@octokit/rest');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Setup Multer for in-memory uploads
const upload = multer({ storage: multer.memoryStorage() });

// Configure GitHub Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB().then(async () => {
  try {
    // Clean up old indexes if they exist
    const mongoose = require('mongoose');
    const db = mongoose.connection;

    // Drop problematic productId index if it exists
    if (db.collections.products) {
      try {
        await db.collection('products').dropIndex('productId_1');
        console.log('✅ Dropped old productId_1 index');
      } catch (err) {
        // Index doesn't exist, that's fine
      }
    }

    // Drop problematic billId index if it exists
    if (db.collections.bills) {
      try {
        await db.collection('bills').dropIndex('billId_1');
        console.log('✅ Dropped old billId_1 index');
      } catch (err) {
        // Index doesn't exist, that's fine
      }
    }
    
    console.log('✅ Database connected and ready');
  } catch (err) {
    console.log('Index cleanup skipped:', err.message);
  }
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});

// ============================================
// MIDDLEWARE
// ============================================
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://capital-yk88.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Increase body size limit for PDF uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, './public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// ============================================
// VIEWS ROUTE
// ============================================
app.get('/', (req, res) => {
  res.render('index', { currentPage: 'dashboard' });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/billing', (req, res) => {
  res.render('billing', { currentPage: 'billing' });
});

app.get('/billing1', (req, res) => {
  res.render('billing1', { currentPage: 'billing' });
});

app.get('/categories', (req, res) => {
  res.render('categories', { currentPage: 'categories' });
});

app.get('/products', (req, res) => {
  res.render('products', { currentPage: 'products' });
});

app.get('/billPreview', async (req, res) => {
  try {
    const { billNumber } = req.query;
    const Bill = require('./models/Bill');
    const Shop = require('./models/Shop');

    let bill = null;
    let shop = null;

    if (billNumber) {
      bill = await Bill.findOne({ billNumber, isActive: true });
    }

    // Get shop data (default or specific)
    shop = await Shop.findOne({ isActive: true });

    res.render('billPreview', { bill, shop });
  } catch (error) {
    console.error('Error loading bill preview:', error);
    res.render('billPreview', { bill: null, shop: null });
  }
});

app.get('/billsSummary', (req, res) => {
  try {
    res.render('billsSummary');
  } catch (error) {
    console.error('Error loading bills summary:', error);
    res.redirect('/billing');
  }
});

app.get('/reports', (req, res) => {
  res.render('reports', { currentPage: 'reports' });
});

app.get('/billsHistory', (req, res) => {
  res.render('billsHistory', { currentPage: 'reports' });
});

app.get('/billsManagement', (req, res) => {
  res.render('billsManagement', { currentPage: 'reports' });
});

app.get('/settings', (req, res) => {
  res.render('settings', { currentPage: 'settings' });
});

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Upload Bill PDF to GitHub
// POST /api/upload-bill
app.post('/api/upload-bill', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        console.log('📦 Uploading File Size:', req.file.size, 'bytes');

        const timestamp = Date.now();
        const filename = `bill_${timestamp}.pdf`;
        const filePath = `bills/${filename}`;
        const content = req.file.buffer.toString('base64');

        // Upload to GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: filePath,
            message: `Add bill PDF: ${filename}`,
            content: content,
            branch: 'main'
        });

        // Generate public raw URL
        const publicUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`;
        
        console.log('✅ PDF uploaded to GitHub:', publicUrl);
        res.json({ pdfUrl: publicUrl });

    } catch (error) {
        console.error('❌ GitHub Upload Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ROUTES
// ============================================
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: "Server running ✅", timestamp: new Date() });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📋 API: ${API_URL}`);
  console.log(`🏥 Health: ${API_URL}/api/health`);
});

module.exports = app;
