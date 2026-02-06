# Deployment Guide

## Exporting the Project

### Method 1: Download ZIP (from Figma Make)
If you're using Figma Make:
1. Click the "Export" button in the top-right corner
2. Select "Download ZIP"
3. Extract the ZIP file to your local machine
4. Navigate to the extracted folder in terminal/command prompt

### Method 2: Manual Copy
1. Copy all project files to your local machine
2. Ensure all files including hidden files (`.gitignore`) are copied
3. Navigate to the project folder in terminal

---

## Local Development Setup

### Prerequisites Check
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

If Node.js is not installed, download from: https://nodejs.org/

### Installation Steps
```bash
# 1. Navigate to project directory
cd path/to/teacher-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be available at: `http://localhost:5173`

---

## Building for Production

### Build the Project
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build Locally
```bash
npm run preview
```

This serves the production build locally for testing.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts**
   - Link to your Vercel account
   - Configure project settings
   - Deploy!

**Advantages:**
- Automatic HTTPS
- Global CDN
- Easy custom domain setup
- Free for personal projects

---

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

---

### Option 3: GitHub Pages

1. **Update `vite.config.ts`** - Add base URL:
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   })
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   - Push code to GitHub
   - Enable GitHub Pages in repository settings
   - Set source to `gh-pages` branch or `docs` folder

---

### Option 4: Traditional Web Server (Apache/Nginx)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder contents** to your web server

3. **Configure server** for SPA routing:

   **Nginx Configuration:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   **Apache Configuration (.htaccess):**
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

---

## Environment Configuration

### Development Environment
Create `.env.local` file:
```env
# Development settings
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SKILL100.AI
```

### Production Environment
Set environment variables in your hosting platform:
```env
# Production settings
VITE_API_URL=https://api.yourproduction.com
VITE_APP_NAME=SKILL100.AI
```

**Important:** 
- All environment variables must be prefixed with `VITE_`
- Rebuild the project after changing environment variables
- Never commit `.env` files to version control

---

## Post-Deployment Checklist

### Before Going Live
- [ ] Test all pages and navigation
- [ ] Verify all interactive features work
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Check all external links
- [ ] Verify charts and data visualizations render correctly
- [ ] Test login functionality
- [ ] Check Excel export functionality
- [ ] Verify modals open and close properly

### Performance Optimization
- [ ] Enable gzip/brotli compression on server
- [ ] Configure caching headers
- [ ] Minify CSS and JavaScript (done automatically by Vite)
- [ ] Optimize images (if adding custom images)
- [ ] Enable HTTPS

### Security (For Production)
- [ ] Implement real authentication (remove mock auth)
- [ ] Add CORS headers properly
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Use environment variables for sensitive data
- [ ] Enable security headers (CSP, HSTS, etc.)

---

## Monitoring and Maintenance

### Recommended Tools
- **Analytics:** Google Analytics, Plausible, or Fathom
- **Error Tracking:** Sentry, LogRocket, or Rollbar
- **Performance:** Lighthouse, WebPageTest
- **Uptime Monitoring:** UptimeRobot, Pingdom

### Regular Maintenance
1. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   ```

2. **Security Audits**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Performance Checks**
   - Run Lighthouse audits monthly
   - Monitor load times
   - Check bundle sizes

---

## Troubleshooting Deployment Issues

### Build Fails
- Check Node.js version (must be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors

### 404 Errors After Deployment
- Configure SPA routing on server (see server configs above)
- Check base URL in `vite.config.ts`

### Blank Page After Deployment
- Check browser console for errors
- Verify all environment variables are set
- Check if base URL is correctly configured

### Assets Not Loading
- Verify `assetsInclude` in `vite.config.ts`
- Check asset paths are relative, not absolute
- Ensure all required files are in `dist/` folder

---

## Custom Domain Setup

### DNS Configuration
1. Add A record or CNAME record to your DNS provider
2. Point to your hosting provider's servers
3. Wait for DNS propagation (up to 48 hours)

### SSL Certificate
- Most hosting providers offer free SSL via Let's Encrypt
- Enable HTTPS in your hosting dashboard
- Force HTTPS redirect

---

## Support and Resources

### Useful Links
- Vite Documentation: https://vitejs.dev/
- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com/

### Community Support
- Stack Overflow: Tag questions with `react`, `vite`, `tailwindcss`
- GitHub Issues: For package-specific problems
- Discord Communities: React, Tailwind CSS servers

---

## Backup Strategy

### What to Backup
- Source code (use Git)
- Database (when connected)
- Configuration files
- Environment variables (stored securely)

### Recommended Approach
```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit"

# Push to remote repository
git remote add origin <your-repo-url>
git push -u origin main
```

---

**Good luck with your deployment!** 🚀

If you encounter any issues, refer to the documentation of your chosen hosting platform or consult the troubleshooting section above.
