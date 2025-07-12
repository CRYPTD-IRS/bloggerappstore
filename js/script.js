// Copyright (c) 2025 CRYPTD. All rights reserved. Made by CRYPTD.
// Blogger App Store - Main Script (Refactored for new UI)

const BLOG_URL = 'https://23135645688545465.blogspot.com';
const PROXY_URLS = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
];
let currentProxyIndex = 0;

let appCache = [];
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function showLoading(show = true) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const grid = document.getElementById('app-grid') || document.getElementById('category-app-grid') || document.getElementById('search-results');
    if (loading) loading.style.display = show ? 'flex' : 'none';
    if (error) error.style.display = 'none';
    if (grid) grid.style.display = show ? 'none' : 'grid';
}

function showError(message) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const grid = document.getElementById('app-grid') || document.getElementById('category-app-grid') || document.getElementById('search-results');
    if (loading) loading.style.display = 'none';
    if (error) {
        error.textContent = message;
        error.style.display = 'block';
    }
    if (grid) grid.style.display = 'none';
}

async function fetchWithProxy(url) {
    const proxy = PROXY_URLS[currentProxyIndex];
    try {
        const response = await fetch(proxy + encodeURIComponent(url));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        currentProxyIndex = (currentProxyIndex + 1) % PROXY_URLS.length;
        if (currentProxyIndex === 0) throw error;
        return fetchWithProxy(url);
    }
}

function parseAppData(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return {
        iconUrl: div.querySelector('#icon_url')?.textContent || '',
        version: div.querySelector('#version')?.textContent || '',
        developer: div.querySelector('#developer')?.textContent || '',
        description: div.querySelector('#app_description')?.innerHTML || '',
        downloadLink: div.querySelector('#download_link')?.textContent || '',
        screenshots: Array.from(div.querySelectorAll('#screenshots img')).map(img => img.src)
    };
}

async function fetchAndDisplayApps(targetGridId = 'app-grid') {
    try {
        showLoading(true);
        if (appCache.length > 0 && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            renderApps(appCache, targetGridId);
            showLoading(false);
            return;
        }
        const feedUrl = `${BLOG_URL}/feeds/posts/default`;
        const xmlText = await fetchWithProxy(feedUrl);
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const entries = Array.from(xml.getElementsByTagName('entry'));
        if (!entries.length) throw new Error('No entries found in the blog feed');
        appCache = entries.map(entry => {
            const title = entry.querySelector('title')?.textContent || '';
            const content = entry.querySelector('content')?.textContent || '';
            const id = entry.querySelector('id')?.textContent?.split('-').pop() || '';
            const appData = parseAppData(content);
            return {
                id,
                title,
                ...appData,
                categories: Array.from(entry.getElementsByTagName('category')).map(cat => cat.getAttribute('term'))
            };
        });
        lastFetchTime = Date.now();
        renderApps(appCache, targetGridId);
    } catch (error) {
        showError(`Failed to load apps: ${error.message}. Please try again later.`);
    } finally {
        showLoading(false);
    }
}

function renderApps(apps, targetGridId = 'app-grid') {
    const grid = document.getElementById(targetGridId);
    if (!grid) return;
    if (!apps.length) {
        grid.innerHTML = '<div class="no-results">No apps found</div>';
        return;
    }
    grid.innerHTML = apps.map(app => `
        <div class="app-card">
            <div class="app-header">
                <img src="${app.iconUrl || 'https://via.placeholder.com/80'}" alt="${app.title}" class="app-icon">
                <div class="app-info">
                    <h2 class="app-title">${app.title}</h2>
                    <div class="app-meta">${app.developer ? app.developer + ' · ' : ''}${app.version || ''}</div>
                </div>
            </div>
            ${app.screenshots && app.screenshots.length ? `<img src="${app.screenshots[0]}" class="app-screenshot" alt="Screenshot">` : ''}
            <div class="app-footer">
                <div class="app-categories">
                    ${app.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
                <a href="view_info.html?id=${app.id}" class="install-btn">View</a>
            </div>
        </div>
    `).join('');
}

function renderCategoryGrid(apps) {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return;
    const categorySet = new Set();
    apps.forEach(app => {
        app.categories.forEach(cat => categorySet.add(cat));
    });
    const categories = Array.from(categorySet).sort();
    if (!categories.length) {
        categoryGrid.innerHTML = '<div class="no-results">No categories found</div>';
        return;
    }
    categoryGrid.innerHTML = categories.map(cat => `
        <div class="category-card" data-category="${encodeURIComponent(cat)}">
            <div class="category-icon">📦</div>
            <div class="category-name">${cat}</div>
        </div>
    `).join('');
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.category;
            window.history.pushState({}, '', `?category=${cat}`);
            showCategoryApps(decodeURIComponent(cat));
        });
    });
}

function showCategoryApps(category) {
    const section = document.getElementById('category-apps-section');
    const grid = document.getElementById('category-app-grid');
    const title = document.getElementById('selected-category-title');
    const catGrid = document.getElementById('category-grid');
    if (!section || !grid || !title || !catGrid) return;
    title.textContent = category;
    section.style.display = 'block';
    catGrid.style.display = 'none';
    const filtered = appCache.filter(app => app.categories.includes(category));
    renderApps(filtered, 'category-app-grid');
    const backBtn = document.getElementById('back-to-categories');
    if (backBtn) {
        backBtn.onclick = () => {
            section.style.display = 'none';
            catGrid.style.display = 'grid';
            window.history.pushState({}, '', 'category.html');
        };
    }
}

function handleCategoryPage() {
    fetchAndDisplayApps().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            showCategoryApps(decodeURIComponent(category));
        } else {
            renderCategoryGrid(appCache);
        }
    });
}

function handleViewInfoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const container = document.getElementById('app-detail-container');
    const loading = document.getElementById('loading');
    if (!id || !container) return;
    fetchAndDisplayApps().then(() => {
        const app = appCache.find(a => a.id === id);
        if (!app) {
            container.innerHTML = '<div class="error-message">App not found.</div>';
            return;
        }
        if (loading) loading.style.display = 'none';
        container.innerHTML = `
            <div class="app-detail-card">
                <div class="app-detail-header">
                    <img src="${app.iconUrl || 'https://via.placeholder.com/96'}" alt="${app.title}" class="app-detail-icon">
                    <div class="app-detail-info">
                        <h1 class="app-detail-title">${app.title}</h1>
                        <div class="app-detail-meta">
                            <span>${app.developer ? app.developer : ''}</span>
                            ${app.version ? `<span class="app-detail-version">v${app.version}</span>` : ''}
                        </div>
                        <div class="app-categories">
                            ${app.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                        </div>
                    </div>
                </div>
                ${app.screenshots && app.screenshots.length ? `
                <div class="app-detail-screenshots">
                    ${app.screenshots.map(src => `<img src="${src}" alt="Screenshot" class="app-detail-screenshot">`).join('')}
                </div>` : ''}
                <div class="app-detail-description">${app.description}</div>
                <a href="${app.downloadLink}" class="install-btn" target="_blank">Download</a>
            </div>
        `;
    });
}

// Initialize everything when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/')) {
        fetchAndDisplayApps();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', e => {
                if (e.key === 'Enter') handleSearch();
            });
        }
    } else if (path.endsWith('category.html')) {
        handleCategoryPage();
    } else if (path.endsWith('view_info.html')) {
        handleViewInfoPage();
    } else if (path.endsWith('search.html')) {
        fetchAndDisplayApps('search-results');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => handleSearch('search-results'));
            searchInput.addEventListener('keyup', e => {
                if (e.key === 'Enter') handleSearch('search-results');
            });
        }
    }
});

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path.endsWith('category.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            showCategoryApps(decodeURIComponent(category));
        } else {
            const section = document.getElementById('category-apps-section');
            const catGrid = document.getElementById('category-grid');
            if (section && catGrid) {
                section.style.display = 'none';
                catGrid.style.display = 'grid';
            }
        }
    }
});
