/**
 * DATA-LOADER.JS - COMPLETE FIXED VERSION
 * Phones: phone-products folder
 * Other products: products folder
 */

const DataLoader = {
    basePath: 'data/',
    
    async loadCategories() {
        try {
            const response = await fetch(this.basePath + 'categories.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading categories:', error);
            return ["All", "Vivo", "iPhone", "Samsung"];
        }
    },
    
    async loadTrending() {
        try {
            const response = await fetch(this.basePath + 'trending.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading trending:', error);
            return [];
        }
    },
    
    async loadNewLaunch() {
        try {
            const response = await fetch(this.basePath + 'new-launch.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading new launch:', error);
            return [];
        }
    },
    
    async loadPagination() {
        try {
            const response = await fetch(this.basePath + 'pagination.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading pagination:', error);
            return { cardsPerPage: 40 };
        }
    },
    
    // ===== PHONE PRODUCTS IDs (phone-products folder) =====
    async loadPhoneProductIds() {
        return [
            // Mobiles
            'iphone-15',
            'samsung-s23',
            'vivo-v30',
            'oppo-reno12-5g',
            'redmi-13-5g',
            'nothing-phone-2',
            'oneplus-nord-15r',
            'google-pixel-8',
            'vivo-v29',
            'samsung-a54',
            'realme-12-pro'
        ];
    },
    
    // ===== OTHER PRODUCTS IDs (products folder) =====
    async loadOtherProductIds() {
        return [
            // TVs
            'samsung-tv-55',
            'lg-tv-43',
            'sony-tv-65',
            'mi-tv-5x',
            
            // ACs
            'lg-ac-1.5ton',
            'samsung-ac-2ton',
            'voltas-ac-1ton',
            'daikin-ac-1.5ton',
            
            // Earphones
            'boat-earphones-131',
            'jbl-earphones-100',
            'sony-earphones-500',
            'realme-earphones-air',
            
            // Watches
            'apple-watch-9',
            'samsung-watch-6',
            'noise-watch-4',
            'boat-watch-storm',
            
            // Laptops
            'dell-laptop-15',
            'hp-laptop-14',
            'lenovo-laptop-16',
            'apple-macbook-air',
            
            // Tablets
            'apple-ipad-10',
            'samsung-tab-s9',
            'lenovo-tab-p12',
            
            // Accessories
            'charger-20w',
            'powerbank-20000',
            'cable-type-c',
            'cover-iphone-15'
        ];
    },
    
    // ===== LOAD PRODUCT FROM SPECIFIC FOLDER =====
    async loadProductFromFolder(productId, folder) {
        try {
            const response = await fetch(`${this.basePath}${folder}/${productId}.json`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            return null;
        }
    },
    
    // ===== LOAD PRODUCT (AUTO-DETECT FOLDER) =====
    async loadProduct(productId) {
        // Pehle phone-products folder mein dhundo
        let product = await this.loadProductFromFolder(productId, 'phone-products');
        if (product) return product;
        
        // Nahi mila to products folder mein dhundo
        product = await this.loadProductFromFolder(productId, 'products');
        if (product) return product;
        
        console.warn(`Product ${productId} not found in any folder`);
        return null;
    },
    
    // ===== LOAD PRODUCTS BY IDs =====
    async loadProducts(productIds) {
        const promises = productIds.map(id => this.loadProduct(id));
        const products = await Promise.all(promises);
        return products.filter(p => p !== null && p.status === 'active');
    },
    
    // ===== LOAD ALL PHONES (for homepage & products page) =====
    async loadAllPhones() {
        console.log('📱 Loading phones from phone-products folder...');
        const phoneIds = await this.loadPhoneProductIds();
        const products = await this.loadProducts(phoneIds);
        console.log(`Loaded ${products.length} phones`);
        return products;
    },
    
    // ===== LOAD ALL PRODUCTS (for other pages) =====
    async loadAllProducts() {
        const path = window.location.pathname;
        console.log('Loading for path:', path);
        
        // Homepage and products page - sirf phones
        if (path === '/' || path.includes('index.html') || path.includes('products.html')) {
            return this.loadAllPhones();
        }
        
        // Category pages ke liye
        if (window.currentCategory) {
            return this.loadProductsByCategory(window.currentCategory);
        }
        
        // Fallback - kuch nahi
        return [];
    },
    
    // ===== LOAD PRODUCTS BY CATEGORY =====
    async loadProductsByCategory(category) {
        console.log(`Loading products for category: ${category}`);
        
        // ⭐ FIXED: Special handling for Trending
        if (category === 'Trending') {
            const trendingIds = await this.loadTrending();
            console.log('Trending IDs:', trendingIds);
            return this.loadProducts(trendingIds);
        }
        
        // ⭐ FIXED: Special handling for New Launch
        if (category === 'New Launch') {
            const newLaunchIds = await this.loadNewLaunch();
            console.log('New Launch IDs:', newLaunchIds);
            return this.loadProducts(newLaunchIds);
        }
        
        // For other categories (TV, AC, etc.)
        const allOtherIds = await this.loadOtherProductIds();
        const products = await this.loadProducts(allOtherIds);
        
        // Filter by actual category field from JSON
        return products.filter(p => p.category === category);
    },
    
    // ===== SEARCH PRODUCTS =====
    async searchProducts(query) {
        const allProducts = await this.loadAllProducts();
        const lowerQuery = query.toLowerCase();
        
        return allProducts.filter(product => {
            return (
                product.name.toLowerCase().includes(lowerQuery) ||
                product.brand.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        });
    }
};

window.DataLoader = DataLoader;