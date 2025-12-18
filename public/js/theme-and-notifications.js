// ============================================
// THEME MANAGEMENT (Dark Mode) - MUST BE FIRST
// ============================================

window.initTheme = function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    window.applyTheme(savedTheme);
    console.log('✅ Theme initialized:', savedTheme);
};

window.applyTheme = function(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
};

window.toggleTheme = function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    window.applyTheme(newTheme);
    
    // Update header icon
    const headerIcon = document.getElementById('theme-icon');
    if (headerIcon) {
        headerIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Update sidebar button if exists
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        if (newTheme === 'dark') {
            themeBtn.innerHTML = '☀️';
            const label = themeBtn.querySelector('span:nth-child(2)');
            if (label) label.textContent = 'Light Mode';
        } else {
            themeBtn.innerHTML = '🌙';
            const label = themeBtn.querySelector('span:nth-child(2)');
            if (label) label.textContent = 'Dark Mode';
        }
    }
    
    console.log('🌙 Theme toggled to:', newTheme);
};    

// ============================================
// LOW STOCK NOTIFICATIONS - MUST BE ACCESSIBLE
// ============================================

window.checkLowStockProducts = async function() {
    try {
        const response = await fetch('/api/products/all');
        if (!response.ok) {
            console.error('❌ Error fetching products:', response.status);
            return { lowStockProducts: [], outOfStockProducts: [], totalNotifications: 0 };
        }
        
        const result = await response.json();
        console.log('📦 API Response:', result);
        
        // Extract products from response structure
        let products = Array.isArray(result) ? result : (result.data || []);
        
        console.log('📦 All products fetched:', products.length, 'products');
        
        const lowStockProducts = [];
        const outOfStockProducts = [];
        
        // Process each product
        products.forEach(p => {
            // Get stock value - try different possible structures
            let stockQty = 0;
            if (p.stock && typeof p.stock === 'object' && p.stock.current) {
                stockQty = p.stock.current;
            } else if (typeof p.stock === 'number') {
                stockQty = p.stock;
            } else if (p.currentStock) {
                stockQty = p.currentStock;
            }
            
            const name = p.productName || p.name || 'Unknown';
            console.log(`  Product: "${name}" - Stock: ${stockQty}`);
            
            // Classify products
            if (stockQty === 0 || !stockQty) {
                outOfStockProducts.push(p);
                console.log(`    ✓ Added to OUT OF STOCK`);
            } else if (stockQty <= 5) {
                lowStockProducts.push(p);
                console.log(`    ✓ Added to LOW STOCK`);
            }
        });
        
        const totalNotifications = lowStockProducts.length + outOfStockProducts.length;
        console.log(`\n📊 Summary:`);
        console.log(`  Low Stock: ${lowStockProducts.length}`);
        console.log(`  Out of Stock: ${outOfStockProducts.length}`);
        console.log(`  Total Alerts: ${totalNotifications}\n`);
        
        // Update badge
        window.updateStockNotificationBadge(totalNotifications, lowStockProducts, outOfStockProducts);
        
        return { lowStockProducts, outOfStockProducts, totalNotifications };
    } catch (error) {
        console.error('❌ Error checking stock:', error);
        return { lowStockProducts: [], outOfStockProducts: [], totalNotifications: 0 };
    }
};

window.updateStockNotificationBadge = function(total, lowStock, outOfStock) {
    const badge = document.getElementById('stock-notification-badge');
    
    if (!badge) {
        console.warn('⚠️ Stock notification badge not found');
        return;
    }
    
    if (total > 0) {
        badge.style.display = 'flex';
        badge.textContent = total;
        badge.title = `${lowStock.length} Low Stock, ${outOfStock.length} Out of Stock`;
    } else {
        badge.style.display = 'none';
    }
};

window.showStockNotifications = async function() {
    console.log('📦 Opening stock notifications modal...');
    
    const { lowStockProducts, outOfStockProducts } = await window.checkLowStockProducts();
    
    let html = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4" onclick="this.remove()">
            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto" onclick="event.stopPropagation()">
                <div class="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold text-gray-900 dark:text-white">📦 Stock Alerts</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold text-xl">✕</button>
                    </div>
                </div>
                
                <div class="p-4 space-y-4">
    `;
    
    if (outOfStockProducts.length > 0) {
        html += `
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <h3 class="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Out of Stock (${outOfStockProducts.length})</h3>
                <ul class="space-y-1">
        `;
        outOfStockProducts.forEach(p => {
            const name = p.productName || p.name || 'Unknown';
            const stock = p.stock?.current || 0;
            html += `<li class="text-sm text-red-600 dark:text-red-300">• ${name} (${stock})</li>`;
        });
        html += `</ul></div>`;
    }
    
    if (lowStockProducts.length > 0) {
        html += `
            <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                <h3 class="font-semibold text-orange-700 dark:text-orange-400 mb-2">⚠️ Low Stock (${lowStockProducts.length})</h3>
                <ul class="space-y-1">
        `;
        lowStockProducts.forEach(p => {
            const name = p.productName || p.name || 'Unknown';
            const stock = p.stock?.current || 0;
            html += `<li class="text-sm text-orange-600 dark:text-orange-300">• ${name} (${stock} units)</li>`;
        });
        html += `</ul></div>`;
    }
    
    if (outOfStockProducts.length === 0 && lowStockProducts.length === 0) {
        html += `<p class="text-gray-600 dark:text-gray-400 text-center py-4">✅ All products have sufficient stock</p>`;
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    console.log('✅ Stock modal opened');
};

// ============================================
// INITIALIZATION - SAFE AND DEFERRED
// ============================================

window.initializeThemeAndNotifications = function() {
    console.log('🚀 Initializing Theme and Notifications...');
    
    try {
        // Initialize theme
        if (window.initTheme) {
            window.initTheme();
        }
        
        // Check stock notifications on load
        if (window.checkLowStockProducts) {
            window.checkLowStockProducts().then(() => {
                console.log('✅ Initial stock check complete');
            }).catch(err => {
                console.error('⚠️ Stock check error:', err);
            });
        }
        
        // Check stock notifications every 30 seconds
        setInterval(() => {
            if (window.checkLowStockProducts) {
                window.checkLowStockProducts();
            }
        }, 30000);
        
        // Update theme button state
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                themeBtn.innerHTML = '☀️';
                const label = themeBtn.querySelector('span:nth-child(2)');
                if (label) label.textContent = 'Light Mode';
            } else {
                themeBtn.innerHTML = '🌙';
                const label = themeBtn.querySelector('span:nth-child(2)');
                if (label) label.textContent = 'Dark Mode';
            }
        }
        
        console.log('✅ All initialization complete');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
};

// Initialize when safe
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeThemeAndNotifications);
} else {
    // DOM already loaded
    setTimeout(window.initializeThemeAndNotifications, 100);
}

// Also ensure functions exist on window immediately
if (!window.toggleTheme) {
    console.error('❌ toggleTheme not found on window');
}
if (!window.showStockNotifications) {
    console.error('❌ showStockNotifications not found on window');
}
