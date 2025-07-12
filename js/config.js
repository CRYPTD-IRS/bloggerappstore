// CRYPTD App Store Configuration
const CONFIG = {
    // Your Blogger URL
    BLOG_URL: 'https://23135645688545465.blogspot.com',
    
    // CORS Proxy URLs (will try in order until one works)
    CORS_PROXIES: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/'
    ],

    // App Store Settings
    STORE_NAME: 'CRYPTD Store',
    ITEMS_PER_PAGE: 12,
    
    // Cache settings
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
    
    // Debug mode
    DEBUG: true
};
