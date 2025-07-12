# Blogger App Store

[🌐 **Live Demo**](https://cryptd-irs.github.io/bloggerappstore/)

## Quick Start: How to Update and Use This App Store

1. **Clone or Download** this repository to your computer.
2. **Edit Your Blogger URL:**
   - Open `js/script.js` and set the `BLOG_URL` constant to your Blogger blog URL.
3. **Customize App Data:**
   - Add or update app posts in your Blogger blog using the provided HTML structure and labels for categories.
4. **Change Styles or Layout:**
   - Edit `css/style.css` for design changes.
   - Edit `index.html` and other HTML files for layout or text changes.
5. **Preview Locally:**
   - Open `index.html` in your browser, or use a local server for best results.
6. **Deploy:**
   - Upload the project to Netlify, Vercel, GitHub Pages, or any static hosting provider.

You can update your app store instantly by editing your Blogger posts—no code changes needed for new apps or categories!

---

# Blogger App Store

A modern, responsive, static App Store website that uses Blogger (Blogspot) as a headless CMS. Built with HTML5, CSS3, and JavaScript (ES6+).

## Features
- Fetches app data from your Blogger blog using its RSS feed
- Fully static, no backend required
- Responsive design with modern UI
- Category and app detail pages
- Uses a CORS proxy for Blogger feed access

## How to Use

1. **Configure Your Blogger Blog**
   - Create posts for each app in your Blogger blog.
   - Use the Blogger "Labels" feature for categories (e.g., Social, Games).
   - In each post, switch to HTML view and use this structure:

     ```html
     <div id="app_description">
         <p>Full app description here.</p>
     </div>
     <div class="app-data" style="display:none;">
         <div id="download_link">https://play.google.com/store/apps/details?id=com.example.app</div>
         <div id="icon_url">https://example.com/icon.png</div>
         <div id="version">v1.2.3</div>
         <div id="developer">Awesome Dev Inc.</div>
         <div id="screenshots">
             <img src="https://example.com/screenshot1.png" alt="Screenshot 1">
             <img src="https://example.com/screenshot2.png" alt="Screenshot 2">
         </div>
     </div>
     ```

2. **Set Your Blogger URL**
   - In `js/script.js`, set the `BLOG_URL` constant to your blog's URL (already set for you).

3. **Run the App Store**
   - Open `index.html` in your browser. (For best results, use a local server or deploy to Netlify, Vercel, GitHub Pages, etc.)

4. **Browse Apps**
   - The homepage lists all apps.
   - Click categories or app cards to view details.

## Troubleshooting
- If apps do not load, check your browser console for errors.
- Make sure your Blogger blog is public and has posts with the correct structure.
- The CORS proxy (https://corsproxy.io) is used to fetch the feed. If it is blocked, try another proxy or deploy your own.

## Customization
- Edit `css/style.css` for styles.
- Edit `js/script.js` for logic or to add features.

---

© 2025 CRYPTD. All rights reserved. Made by CRYPTD.
